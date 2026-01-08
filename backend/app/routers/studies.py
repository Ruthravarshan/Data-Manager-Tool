from fastapi import APIRouter, Depends, HTTPException, File, UploadFile
from sqlalchemy.orm import Session
from typing import List
from app.database import get_db
from app.models import Study, Activity, Site, StudyContact, Vendor
from app.schemas import (
    Study as StudySchema, StudyCreate,
    Site as SiteSchema, SiteCreate,
    StudyContact as ContactSchema, StudyContactCreate,
    Vendor as VendorSchema, VendorCreate
)
from app.file_service import save_upload_file
import uuid

router = APIRouter(prefix="/api/studies", tags=["studies"])

@router.get("/count/active", response_model=dict)
def get_active_studies_count(db: Session = Depends(get_db)):
    """Get count of all studies"""
    count = db.query(Study).count()
    return {"count": count}

@router.get("/", response_model=List[StudySchema])
def read_studies(skip: int = 0, limit: int = 100, db: Session = Depends(get_db)):
    studies = db.query(Study).offset(skip).limit(limit).all()
    return studies

@router.post("/", response_model=StudySchema)
def create_study(study: StudyCreate, db: Session = Depends(get_db)):
    db_study = Study(**study.model_dump(), id=f"ST-{uuid.uuid4().hex[:6].upper()}")
    db.add(db_study)
    db.commit()
    db.refresh(db_study)
    
    # Log activity
    activity = Activity(
        action_type="study_created",
        description=f"Study '{db_study.title}' (ID: {db_study.id}) created",
        user_name="User",
        related_entity_id=db_study.id,
        related_entity_type="study"
    )
    db.add(activity)
    db.commit()
    
    return db_study

from app.file_service import delete_study_files

@router.delete("/{study_id}")
def delete_study(study_id: str, db: Session = Depends(get_db)):
    try:
        study = db.query(Study).filter(Study.id == study_id).first()
        if not study:
            raise HTTPException(status_code=404, detail="Study not found")
        
        study_title = study.title
        study_id_val = study.id
        
        # Delete associated files first
        delete_study_files(study_id)
        
        # Delete from DB (cascade will delete documents)
        db.delete(study)
        db.commit()
        
        # Log activity after successful deletion
        activity = Activity(
            action_type="study_deleted",
            description=f"Study '{study_title}' (ID: {study_id_val}) deleted",
            user_name="User",
            related_entity_id=study_id_val,
            related_entity_type="study"
        )
        db.add(activity)
        db.commit()
        
        return {"message": "Study deleted successfully"}
    except Exception as e:
        db.rollback()
        raise HTTPException(status_code=500, detail=f"Failed to delete study: {str(e)}")

@router.post("/{study_id}/upload")
def upload_study_protocol(study_id: str, file: UploadFile = File(...), db: Session = Depends(get_db)):
    study = db.query(Study).filter(Study.id == study_id).first()
    if not study:
        raise HTTPException(status_code=404, detail="Study not found")
    
    
    file_url = save_upload_file(file, study_id=study_id)
    
    study.file_url = file_url
    db.commit()
    db.refresh(study)
    return {"file_url": file_url}

from app.models import Document
from app.schemas import Document as DocumentSchema

@router.get("/{study_id}/documents", response_model=List[DocumentSchema])
def read_study_documents(study_id: str, db: Session = Depends(get_db)):
    study = db.query(Study).filter(Study.id == study_id).first()
    if not study:
        raise HTTPException(status_code=404, detail="Study not found")
    return study.documents

@router.post("/{study_id}/documents", response_model=DocumentSchema)
def upload_document(study_id: str, source: str = "Manual upload", file: UploadFile = File(...), db: Session = Depends(get_db)):
    study = db.query(Study).filter(Study.id == study_id).first()
    if not study:
        raise HTTPException(status_code=404, detail="Study not found")
    
    
    file_url = save_upload_file(file, study_id=study_id)
    
    file_type = file.filename.split('.')[-1].lower() if '.' in file.filename else 'unknown'
    
    db_document = Document(
        study_id=study_id,
        name=file.filename,
        type=file_type,
        source=source,
        file_url=file_url
    )
    db.add(db_document)
    db.commit()
    db.refresh(db_document)
    
    # Log activity
    activity = Activity(
        action_type="document_uploaded",
        description=f"Document '{file.filename}' uploaded to study '{study.title}'",
        user_name="User",
        related_entity_id=study.id,
        related_entity_type="document"
    )
    db.add(activity)
    db.commit()
    
    return db_document

@router.put("/documents/{document_id}", response_model=DocumentSchema)
def update_document(document_id: int, name: str, db: Session = Depends(get_db)):
    document = db.query(Document).filter(Document.id == document_id).first()
    if not document:
        raise HTTPException(status_code=404, detail="Document not found")
    
    document.name = name
    db.commit()
    db.refresh(document)
    return document


# ----------------- SITES ----------------- #
@router.get("/{study_id}/sites", response_model=List[SiteSchema])
def read_study_sites(study_id: str, db: Session = Depends(get_db)):
    study = db.query(Study).filter(Study.id == study_id).first()
    if not study:
        raise HTTPException(status_code=404, detail="Study not found")
    return study.sites

@router.post("/{study_id}/sites", response_model=SiteSchema)
def create_site(study_id: str, site: SiteCreate, db: Session = Depends(get_db)):
    study = db.query(Study).filter(Study.id == study_id).first()
    if not study:
        raise HTTPException(status_code=404, detail="Study not found")
    
    db_site = Site(**site.model_dump(), study_id=study_id)
    db.add(db_site)
    # Update study sites count
    study.sites_count = (study.sites_count or 0) + 1
    
    db.commit()
    db.refresh(db_site)
    return db_site

# ----------------- CONTACTS ----------------- #
@router.get("/{study_id}/contacts", response_model=List[ContactSchema])
def read_study_contacts(study_id: str, db: Session = Depends(get_db)):
    study = db.query(Study).filter(Study.id == study_id).first()
    if not study:
        raise HTTPException(status_code=404, detail="Study not found")
    return study.contacts

@router.post("/{study_id}/contacts", response_model=ContactSchema)
def create_contact(study_id: str, contact: StudyContactCreate, db: Session = Depends(get_db)):
    study = db.query(Study).filter(Study.id == study_id).first()
    if not study:
        raise HTTPException(status_code=404, detail="Study not found")
    
    db_contact = StudyContact(**contact.model_dump(), study_id=study_id)
    db.add(db_contact)
    db.commit()
    db.refresh(db_contact)
    return db_contact

# ----------------- VENDORS ----------------- #
@router.get("/{study_id}/vendors", response_model=List[VendorSchema])
def read_study_vendors(study_id: str, db: Session = Depends(get_db)):
    study = db.query(Study).filter(Study.id == study_id).first()
    if not study:
        raise HTTPException(status_code=404, detail="Study not found")
    return study.vendors

@router.post("/{study_id}/vendors", response_model=VendorSchema)
def create_vendor(study_id: str, vendor: VendorCreate, db: Session = Depends(get_db)):
    study = db.query(Study).filter(Study.id == study_id).first()
    if not study:
        raise HTTPException(status_code=404, detail="Study not found")
    
    db_vendor = Vendor(**vendor.model_dump(), study_id=study_id)
    db.add(db_vendor)
    db.commit()
    db.refresh(db_vendor)
    return db_vendor
