from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from typing import List
from app.database import get_db
from app.models import IntegrationSource
from app.schemas import Integration

router = APIRouter(prefix="/api/integrations", tags=["integrations"])

@router.get("/", response_model=List[Integration])
def read_integrations(db: Session = Depends(get_db)):
    integrations = db.query(IntegrationSource).all()
    return integrations
