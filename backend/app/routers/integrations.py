from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.orm import Session
from typing import List, Optional
from app.database import get_db
from app.models import IntegrationSource
from app.schemas import Integration, IntegrationCreate, IntegrationUpdate
import logging

logger = logging.getLogger(__name__)
router = APIRouter(prefix="/api/integrations", tags=["integrations"])

@router.get("/", response_model=List[Integration])
def read_integrations(
    type_filter: Optional[str] = Query(None),
    status_filter: Optional[str] = Query(None),
    db: Session = Depends(get_db)
):
    query = db.query(IntegrationSource)
    if type_filter:
        query = query.filter(IntegrationSource.type == type_filter)
    if status_filter:
        query = query.filter(IntegrationSource.status == status_filter)
    return query.all()

@router.get("/{integration_id}", response_model=Integration)
def read_integration(integration_id: int, db: Session = Depends(get_db)):
    db_integration = db.query(IntegrationSource).filter(IntegrationSource.id == integration_id).first()
    if not db_integration:
        raise HTTPException(status_code=404, detail="Integration not found")
    return db_integration

@router.post("/", response_model=Integration)
def create_integration(integration: IntegrationCreate, db: Session = Depends(get_db)):
    db_integration = IntegrationSource(**integration.dict())
    db.add(db_integration)
    db.commit()
    db.refresh(db_integration)
    return db_integration

@router.put("/{integration_id}", response_model=Integration)
def update_integration(integration_id: int, integration: IntegrationUpdate, db: Session = Depends(get_db)):
    db_integration = db.query(IntegrationSource).filter(IntegrationSource.id == integration_id).first()
    if not db_integration:
        raise HTTPException(status_code=404, detail="Integration not found")
    
    update_data = integration.dict(exclude_unset=True)
    for key, value in update_data.items():
        setattr(db_integration, key, value)
    
    db.commit()
    db.refresh(db_integration)
    return db_integration

@router.delete("/{integration_id}")
def delete_integration(integration_id: int, db: Session = Depends(get_db)):
    db_integration = db.query(IntegrationSource).filter(IntegrationSource.id == integration_id).first()
    if not db_integration:
        raise HTTPException(status_code=404, detail="Integration not found")
    
    db.delete(db_integration)
    db.commit()
    return {"message": "Integration deleted"}

@router.get("/filters/types")
def get_integration_types(db: Session = Depends(get_db)):
    types = db.query(IntegrationSource.type).distinct().all()
    return [t[0] for t in types if t[0]]

@router.get("/filters/statuses")
def get_integration_statuses(db: Session = Depends(get_db)):
    statuses = db.query(IntegrationSource.status).distinct().all()
    return [s[0] for s in statuses if s[0]]

@router.get("/filters/protocols")
def get_integration_protocols(db: Session = Depends(get_db)):
    protocols = db.query(IntegrationSource.protocol_id).distinct().all()
    return [p[0] for p in protocols if p[0]]
