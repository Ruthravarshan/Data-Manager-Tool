from fastapi import APIRouter, Depends
from typing import List
from sqlalchemy.orm import Session
from app.schemas import Metric
from app.database import get_db
from app import models

router = APIRouter(prefix="/api/dashboard", tags=["dashboard"])

@router.get("/metrics", response_model=List[Metric])
def get_metrics(db: Session = Depends(get_db)):
    metrics = db.query(models.Metric).all()
    # Return metrics if they exist, otherwise return empty list
    # (Though populate_db should have seeded them)
    return metrics
