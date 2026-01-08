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

@router.get("/enrollment-trend")
def get_enrollment_trend(db: Session = Depends(get_db)):
    # Simulating 6 months of data
    return [
        {"month": "Jan", "actual": 45, "expected": 50},
        {"month": "Feb", "actual": 92, "expected": 100},
        {"month": "Mar", "actual": 148, "expected": 150},
        {"month": "Apr", "actual": 205, "expected": 200},
        {"month": "May", "actual": 260, "expected": 250},
        {"month": "Jun", "actual": 310, "expected": 300},
    ]

@router.get("/query-resolution")
def get_query_resolution(db: Session = Depends(get_db)):
    # Simulating data for pie/bar chart
    return {
        "resolved": 145,
        "open": 23,
        "pending": 12,
        "rate": 81 # Percentage
    }
