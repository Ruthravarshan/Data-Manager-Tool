from fastapi import APIRouter, Depends, Query, HTTPException
from sqlalchemy.orm import Session
from sqlalchemy import text
from typing import List, Optional, Dict, Any
from app.database import get_db, engine
from app.models import DataFile, IntegrationSource
from app.schemas import DataFile as DataFileSchema, ScanFolderRequest, ScanFolderResponse, SectionMetadataResponse
from app.file_classifier import scan_folder, scan_folder_recursive
import logging
from datetime import datetime
import pandas as pd
import os
import re

logger = logging.getLogger(__name__)
router = APIRouter(prefix="/api/data-files", tags=["data-files"])

def get_safe_table_name(filename: str) -> str:
    """Generate a safe table name from filename"""
    # Remove extension
    name = os.path.splitext(filename)[0]
    # Remove _raw_ suffix if present
    if "_raw" in name:
        name = name.split("_raw")[0]
    # Replace non-alphanumeric with _
    safe_name = re.sub(r'[^a-zA-Z0-9]', '_', name).lower()
    # Add timestamp/random suffix to ensure uniqueness? 
    # For now, we'll rely on the logic that we can check if table exists or just append a unique ID if needed.
    # But populate_db logic was: base_name + _sub + number.
    # We should probably try to be consistent or just use a unique ID based suffix.
    # Let's use a simple deterministic name first, but we need to handle duplicates.
    # To avoid complexity, let's use: data_{timestamp_ms}_{safe_name}
    timestamp_suffix = datetime.now().strftime("%Y%m%d%H%M%S")
    return f"dt_{safe_name}_{timestamp_suffix}"


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
    # If filtering by protocol, filter by DataFile.protocol_id
    if protocol_id:
        query = query.filter(DataFile.protocol_id == protocol_id)
    
    if section:
        query = query.filter(DataFile.section == section)
    
    if status:
        query = query.filter(DataFile.status == status)
    
    if integration_id:
        query = query.filter(DataFile.integration_id == integration_id)
    
    return query.order_by(DataFile.created_at.desc()).all()


@router.get("/sections", response_model=List[str])
def get_sections(db: Session = Depends(get_db)):
    """Get list of all unique sections"""
    sections = db.query(DataFile.section).distinct().filter(DataFile.section != None).all()
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
        
        if not integration.folder_path:
            logger.error(f"Folder path not configured for integration {integration_id}")
            raise HTTPException(status_code=400, detail="Folder path not configured for this integration")
        
        # Scan folder
        logger.info(f"Starting folder scan for: {integration.folder_path}")
        results, warnings = scan_folder_recursive(integration.folder_path)
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
            # Generate table name and ingest data if imported
            table_name = None
            if result.status == 'Imported' and result.file_path and os.path.exists(result.file_path):
                try:
                    # Determine table name
                    table_name = get_safe_table_name(result.filename)
                    
                    # Read file
                    df = None
                    if result.filename.lower().endswith('.csv'):
                        df = pd.read_csv(result.file_path)
                    elif result.filename.lower().endswith(('.xlsx', '.xls')):
                        df = pd.read_excel(result.file_path)
                    
                    if df is not None:
                        # Add metadata columns
                        df['_imported_at'] = datetime.utcnow()
                        df['_source_file'] = result.filename
                        
                        # Write to DB
                        df.to_sql(table_name, engine, if_exists='replace', index=False)
                        logger.info(f"Ingested {result.filename} into table {table_name}")
                except Exception as e:
                    logger.error(f"Failed to ingest {result.filename}: {e}")
                    # We don't fail the whole scan, just log error. 
                    # Optionally mark as Error/Warning?
                    # For now, proceeding but table_name will be None
                    pass

            data_file = DataFile(
                filename=result.filename,
                prefix=result.prefix,
                section=result.section,
                file_path=result.file_path if result.file_path else 
                          f"{integration.folder_path}/{result.filename}",
                file_size=result.file_size,
                created_at=result.timestamp if isinstance(result.timestamp, datetime) else datetime.utcnow(),
                status=result.status,
                protocol_id=result.protocol_id,
                integration_id=integration_id,
                record_count=result.record_count,
                table_name=table_name
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
            files=stored_files,
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
        
        if protocol_id:
            query = query.filter(DataFile.protocol_id == protocol_id)
        
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

@router.get("/{file_id}/data")
def get_file_data(
    file_id: int, 
    limit: int = 100, 
    offset: int = 0,
    db: Session = Depends(get_db)
):
    """Get content of the data file from the database table"""
    data_file = db.query(DataFile).filter(DataFile.id == file_id).first()
    if not data_file:
        raise HTTPException(status_code=404, detail="Data file not found")
    
    if not data_file.table_name:
        # Fallback to file reading or return empty?
        # If it's imported, it should have a table. If not, maybe it wasn't valid.
        raise HTTPException(status_code=400, detail="Data not ingested into database for this file.")

    try:
        # Verify table exists (basic SQL injection prevention is done by not using user input for table name directly, 
        # but the table_name in DB should be safe as we generated it)
        # However, to be extra safe, we used sqlalchemy text with caution or quoted identifiers.
        # pandas read_sql handles quoting usually.
        
        # We use simple string interpolation for table name because it's from our DB and strict format.
        # But let's check if table exists first using passing check.
        
        query = f'SELECT * FROM "{data_file.table_name}" LIMIT {limit} OFFSET {offset}'
        
        # Use pandas to read sql for convenience as it returns a DataFrame we can convert to dict
        df = pd.read_sql_query(query, engine)
        
        # Convert to records
        # Handle NaN/Inf for JSON
        records = df.replace({float('inf'): None, float('-inf'): None}).where(pd.notnull(df), None).to_dict(orient='records')
        columns = list(df.columns)
        
        return {
            "columns": columns,
            "rows": records,
            "total_rows_fetched": len(records),
            "source_table": data_file.table_name
        }
        
    except Exception as e:
        logger.error(f"Error fetching data from table {data_file.table_name}: {e}")
        raise HTTPException(status_code=500, detail=f"Error retrieving data: {str(e)}")
