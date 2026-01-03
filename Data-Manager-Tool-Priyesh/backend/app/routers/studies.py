from fastapi import APIRouter, Depends, HTTPException, File, UploadFile
from sqlalchemy.orm import Session
from typing import List
from app.database import get_db
from app.models import Study
from app.schemas import Study as StudySchema, StudyCreate
from app.file_service import save_upload_file
import uuid

router = APIRouter(prefix="/api/studies", tags=["studies"])

@router.get("/", response_model=List[StudySchema])
def read_studies(skip: int = 0, limit: int = 100, db: Session = Depends(get_db)):
    studies = db.query(Study).offset(skip).limit(limit).all()
    return studies

@router.post("/", response_model=StudySchema)
def create_study(study: StudyCreate, db: Session = Depends(get_db)):
    db_study = Study(**study.dict(), id=f"ST-{uuid.uuid4().hex[:6].upper()}")
    db.add(db_study)
    db.commit()
    db.refresh(db_study)
    return db_study

@router.post("/{study_id}/upload")
def upload_study_protocol(study_id: str, file: UploadFile = File(...), db: Session = Depends(get_db)):
    study = db.query(Study).filter(Study.id == study_id).first()
    if not study:
        raise HTTPException(status_code=404, detail="Study not found")
    
    
    file_url = save_upload_file(file)
    
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
    
    
    file_url = save_upload_file(file)
    
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
