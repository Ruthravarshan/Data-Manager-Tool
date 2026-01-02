from fastapi import APIRouter, Depends, Query, HTTPException
from sqlalchemy.orm import Session
from typing import List, Optional
from app.database import get_db
from app.models import DataFile, IntegrationSource
from app.schemas import DataFile as DataFileSchema, ScanFolderRequest, ScanFolderResponse
from app.file_classifier import scan_folder
import logging
from datetime import datetime
import pandas as pd
import os
from app.schemas import SectionMetadataResponse

logger = logging.getLogger(__name__)
router = APIRouter(prefix="/api/data-files", tags=["data-files"])


@router.get("/", response_model=List[DataFileSchema])
def get_data_files(
    section: Optional[str] = Query(None),
    status: Optional[str] = Query(None),
    integration_id: Optional[int] = Query(None),
    protocol_id: Optional[str] = Query(None),
    db: Session = Depends(get_db)
):
    """Get data files with optional filtering"""
    query = db.query(DataFile)
    
    # If filtering by protocol, join with IntegrationSource
    if protocol_id:
        query = query.join(IntegrationSource, DataFile.integration_id == IntegrationSource.id)\
                     .filter(IntegrationSource.protocol_id == protocol_id)
    
    if section:
        query = query.filter(DataFile.section == section)
    
    if status:
        query = query.filter(DataFile.status == status)
    
    if integration_id:
        query = query.filter(DataFile.integration_id == integration_id)
    
    return query.order_by(DataFile.created_at.desc()).all()


@router.get("/sections", response_model=List[str])
def get_sections(
    protocol_id: Optional[str] = Query(None),
    db: Session = Depends(get_db)
):
    """Get list of unique sections, optionally filtered by protocol"""
    query = db.query(DataFile.section).distinct().filter(DataFile.section != None)
    
    if protocol_id:
        query = query.join(IntegrationSource, DataFile.integration_id == IntegrationSource.id)\
                     .filter(IntegrationSource.protocol_id == protocol_id)
                     
    sections = query.all()
    return sorted([s[0] for s in sections if s[0]])


@router.post("/scan/{integration_id}", response_model=ScanFolderResponse)
def scan_integration_folder(
    integration_id: int,
    db: Session = Depends(get_db)
):
    """Scan the data source folder for an integration"""
    try:
        # Get the integration
        integration = db.query(IntegrationSource).filter(IntegrationSource.id == integration_id).first()
        if not integration:
            logger.error(f"Integration {integration_id} not found")
            raise HTTPException(status_code=404, detail="Integration not found")
        
        logger.info(f"Integration found: {integration.name}, folder: {integration.folder_path}")
        
        # Check if folder path is configured
        if not integration.folder_path:
            # If no folder path, check if it's a type that might not need one (like API)
            # For now, we'll simulate a successful sync for non-folder integrations
            # instead of raising an error
            logger.info(f"No folder path for integration {integration_id} ({integration.type}). Simulating sync.")
            
            # Update integration's last_sync
            integration.last_sync = datetime.utcnow()
            db.commit()
            
            return ScanFolderResponse(
                total_files=0,
                imported_files=0,
                unclassified_files=0,
                duplicate_files=0,
                files=[],
                warnings=["Integration does not have a local folder path configured. Simulated sync completed."]
            )
            
        # Scan folder
        logger.info(f"Starting folder scan for: {integration.folder_path}")
        results, warnings = scan_folder(integration.folder_path)
        logger.info(f"Scan completed. Found {len(results)} files")
        
        # Clear existing files for this integration
        db.query(DataFile).filter(DataFile.integration_id == integration_id).delete()
        db.commit()
        
        # Store results in database
        imported_count = 0
        unclassified_count = 0
        duplicate_count = 0
        stored_files = []
        
        for result in results:
            data_file = DataFile(
                filename=result.filename,
                prefix=result.prefix,
                section=result.section,
                file_path=result.file_path if hasattr(result, 'file_path') else 
                          f"{integration.folder_path}/{result.filename}",
                file_size=result.file_size,
                timestamp=result.timestamp,
                status=result.status,
                integration_id=integration_id
            )
            db.add(data_file)
            
            if result.status == "Imported" and result.section:
                imported_count += 1
            elif result.status == "Unclassified":
                unclassified_count += 1
            elif result.status == "Duplicate":
                duplicate_count += 1
            
            stored_files.append(data_file)
        
        db.commit()
        
        # Refresh to get IDs
        for f in stored_files:
            db.refresh(f)
        
        # Update integration's last_sync
        integration.last_sync = datetime.utcnow()
        db.commit()
        
        logger.info(f"Successfully saved {len(stored_files)} files to database")
        
        return ScanFolderResponse(
            total_files=len(results),
            imported_files=imported_count,
            unclassified_files=unclassified_count,
            duplicate_files=duplicate_count,
            files=[DataFileSchema.from_orm(f) for f in stored_files],
            warnings=warnings
        )
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Error scanning folder: {str(e)}", exc_info=True)
        raise HTTPException(status_code=500, detail=f"Error scanning folder: {str(e)}")



@router.get("/metadata", response_model=SectionMetadataResponse)
def get_section_metadata(
    section: str = Query(..., description="Section name, e.g., 'DM (Demographics)'"),
    protocol_id: Optional[str] = Query(None),
    db: Session = Depends(get_db)
):
    """Get metadata for a specific section based on the latest data file"""
    try:
        # query for the latest file in this section
        query = db.query(DataFile)
        
        # Join with IntegrationSource if protocol_id is provided
        if protocol_id:
            query = query.join(IntegrationSource, DataFile.integration_id == IntegrationSource.id)\
                         .filter(IntegrationSource.protocol_id == protocol_id)
        
        # Filter by section and get latest
        latest_file = query.filter(DataFile.section == section)\
                           .order_by(DataFile.created_at.desc())\
                           .first()
        
        # Default values
        domain = section.split()[0] if section else "Unknown" 
        dataset_name = section
        vendor = "Unknown"
        data_source = "Unknown"
        last_updated = None
        record_count = 0
        variable_count = 0
        sample_data = []
        
        # Description mapping
        descriptions = {
            'DM': 'Subject demographics and baseline characteristics',
            'SV': 'Subject visit records and timelines',
            'DS': 'Subject disposition and enrollment status',
            'AE': 'Adverse events recorded during trial',
            'SAE': 'Serious adverse events',
            'MH': 'Subject medical history',
            'CM': 'Concomitant medications',
            'PD': 'Protocol deviations',
            'VS': 'Vital signs measurements',
            'LB': 'Laboratory test results',
            'EX': 'Drug exposure data'
        }
        
        # Clean domain for lookup (remove parenthetical if present)
        # e.g. "DM (Demographics)" -> "DM"
        clean_domain = section.split(' ')[0]
        description = descriptions.get(clean_domain, f"{dataset_name} data")
        
        # Name mapping
        names = {
            'DM': 'Demographics',
            'SV': 'Subject Visits',
            'DS': 'Disposition',
            'AE': 'Adverse Events',
            'SAE': 'Serious Adverse Events',
            'MH': 'Medical History',
            'CM': 'Concomitant Medications',
            'PD': 'Protocol Deviations',
            'VS': 'Vital Signs',
            'LB': 'Laboratory',
            'EX': 'Exposure'
        }
        clean_name = names.get(clean_domain, section)
        
        if latest_file:
            last_updated = latest_file.last_updated or latest_file.created_at
            
            # Get integration info
            if latest_file.integration_id:
                integration = db.query(IntegrationSource).filter(IntegrationSource.id == latest_file.integration_id).first()
                if integration:
                    vendor = integration.vendor or "Unknown"
                    data_source = integration.name or "Unknown"

            # Read file for stats
            try:
                file_path = latest_file.file_path
                # Fallback for relative paths if needed, but we saw they are absolute in DB check
                
                if os.path.exists(file_path):
                    df = None
                    if latest_file.filename.lower().endswith('.csv'):
                        df = pd.read_csv(file_path) # Read full file for accurate counts
                    elif latest_file.filename.lower().endswith(('.xlsx', '.xls')):
                        df = pd.read_excel(file_path)
                    
                    if df is not None:
                        record_count = len(df)
                        variable_count = len(df.columns)
                        
                        # Generate additional fields for display
                        # recordId: DOMAIN-1-{index+1} 
                        # We use a list comprehension for performance
                        df['recordId'] = [f"{clean_domain}-1-{i+1}" for i in range(len(df))]
                        
                        # importedAt
                        import_str = latest_file.created_at.strftime("%d/%m/%Y, %H:%M:%S") if latest_file.created_at else "N/A"
                        df['importedAt'] = import_str
                        
                        # Ensure standard columns exist if missing, to avoid UI errors?
                        # No, we just show what's there. But user asked for specific ones.
                        # STUDYID, DOMAIN, USUBJID usually exist in SDTM data.
                        
                        # Prepare sample data
                        # Replace NaN/inf
                        df_clean = df.replace({float('inf'): None, float('-inf'): None}).where(pd.notnull(df), None)
                        
                        # Ensure columns are strings for Pydantic validation
                        df_clean.columns = df_clean.columns.astype(str)
                        
                        # Select only interesting columns for the preview if possible, but user asked for specific ones.
                        # We will send all, logic in frontend can choose or we send requested ones first.
                        # Let's reorder if columns exist
                        priority_cols = ['recordId', 'importedAt', 'STUDYID', 'DOMAIN', 'USUBJID']
                        existing_cols = [c for c in priority_cols if c in df_clean.columns]
                        other_cols = [c for c in df_clean.columns if c not in priority_cols]
                        
                        sample_data = df_clean[existing_cols + other_cols].head(10).to_dict(orient="records")

                        
            except Exception as e:
                logger.error(f"Error reading file for metadata {latest_file.file_path}: {e}")
                # Pass to return default/partial metadata
    
        return SectionMetadataResponse(
            domain=clean_domain,
            dataset_name=clean_name,
            vendor=vendor,
            data_source=data_source,
            last_updated=last_updated,
            description=description,
            record_count=record_count,
            variable_count=variable_count,
            sample_data=sample_data
        )
    except Exception as e:
        logger.error(f"Error in get_section_metadata: {e}")
        # Return empty response instead of failing
        return SectionMetadataResponse(
            domain=section.split(' ')[0] if section else "Unknown",
            dataset_name=section or "Unknown",
            vendor="Unknown",
            data_source="Unknown",
            last_updated=None,
            description="Failed to load metadata.",
            record_count=0,
            variable_count=0,
            sample_data=[]
        )

@router.get("/{file_id}", response_model=DataFileSchema)
def get_data_file(file_id: int, db: Session = Depends(get_db)):
    """Get a specific data file"""
    data_file = db.query(DataFile).filter(DataFile.id == file_id).first()
    if not data_file:
        raise HTTPException(status_code=404, detail="Data file not found")
    return data_file


@router.delete("/{file_id}")
def delete_data_file(file_id: int, db: Session = Depends(get_db)):
    """Delete a data file record"""
    data_file = db.query(DataFile).filter(DataFile.id == file_id).first()
    if not data_file:
        raise HTTPException(status_code=404, detail="Data file not found")
    
    db.delete(data_file)
    db.commit()
    return {"message": "Data file deleted successfully"}



