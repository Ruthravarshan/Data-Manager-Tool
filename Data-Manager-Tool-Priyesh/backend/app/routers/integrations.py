from fastapi import APIRouter, Depends, Query
from sqlalchemy.orm import Session
from typing import List, Optional
from app.database import get_db
from app.models import IntegrationSource
from app.schemas import Integration, IntegrationCreate, IntegrationUpdate

router = APIRouter(prefix="/api/integrations", tags=["integrations"])

@router.get("/", response_model=List[Integration])
def read_integrations(
    type_filter: Optional[str] = Query(None),
    status_filter: Optional[str] = Query(None),
    db: Session = Depends(get_db)
):
    """Get all integrations with optional filtering by type and status"""
    query = db.query(IntegrationSource)
    
    if type_filter and type_filter != "All Types":
        query = query.filter(IntegrationSource.type == type_filter)
    
    if status_filter and status_filter != "All Statuses":
        query = query.filter(IntegrationSource.status == status_filter)
    
    return query.all()

@router.get("/filters/types", response_model=List[str])
def get_integration_types(db: Session = Depends(get_db)):
    """Get list of all unique integration types"""
    types = db.query(IntegrationSource.type).distinct().all()
    return [t[0] for t in types if t[0]]

@router.get("/filters/statuses", response_model=List[str])
def get_integration_statuses(db: Session = Depends(get_db)):
    """Get list of all unique integration statuses"""
    statuses = db.query(IntegrationSource.status).distinct().all()
    return [s[0] for s in statuses if s[0]]

@router.get("/filters/protocols", response_model=List[str])
def get_protocol_ids(db: Session = Depends(get_db)):
    """Get list of all unique protocol IDs"""
    protocols = db.query(IntegrationSource.protocol_id).distinct().all()
    return sorted([p[0] for p in protocols if p[0]])

@router.post("/", response_model=Integration)
def create_integration(integration: IntegrationCreate, db: Session = Depends(get_db)):
    """Create a new integration"""
    db_integration = IntegrationSource(**integration.dict())
    db.add(db_integration)
    db.commit()
    db.refresh(db_integration)
    return db_integration

@router.get("/{integration_id}", response_model=Integration)
def read_integration(integration_id: int, db: Session = Depends(get_db)):
    """Get a specific integration by ID"""
    integration = db.query(IntegrationSource).filter(IntegrationSource.id == integration_id).first()
    if not integration:
        raise Exception("Integration not found")
    return integration

@router.put("/{integration_id}", response_model=Integration)
def update_integration(
    integration_id: int, 
    integration: IntegrationUpdate, 
    db: Session = Depends(get_db)
):
    """Update an integration"""
    db_integration = db.query(IntegrationSource).filter(IntegrationSource.id == integration_id).first()
    if not db_integration:
        raise Exception("Integration not found")
    
    update_data = integration.dict(exclude_unset=True)
    for field, value in update_data.items():
        setattr(db_integration, field, value)
    
    db.commit()
    db.refresh(db_integration)
    return db_integration

@router.delete("/{integration_id}")
def delete_integration(integration_id: int, db: Session = Depends(get_db)):
    """Delete an integration"""
    db_integration = db.query(IntegrationSource).filter(IntegrationSource.id == integration_id).first()
    if not db_integration:
        raise Exception("Integration not found")
    
    db.delete(db_integration)
    db.commit()
    return {"message": "Integration deleted successfully"}
