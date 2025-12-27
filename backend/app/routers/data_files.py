from fastapi import APIRouter, Depends, Query, HTTPException
from sqlalchemy.orm import Session
from typing import List, Optional
from app.database import get_db
from app.models import DataFile, IntegrationSource
from app.schemas import DataFile as DataFileSchema, ScanFolderRequest, ScanFolderResponse
from app.file_classifier import scan_folder
import logging
from datetime import datetime

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
