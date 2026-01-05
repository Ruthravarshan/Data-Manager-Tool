from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List
from app.database import get_db
from app.models import Activity
from app.schemas import Activity as ActivitySchema, ActivityCreate
from datetime import datetime, timedelta

router = APIRouter(prefix="/api/activities", tags=["activities"])

@router.post("/", response_model=ActivitySchema)
def log_activity(activity: ActivityCreate, db: Session = Depends(get_db)):
    """Log a user activity"""
    db_activity = Activity(**activity.dict())
    db.add(db_activity)
    db.commit()
    db.refresh(db_activity)
    return db_activity

@router.get("/recent", response_model=List[ActivitySchema])
def get_recent_activities(limit: int = 10, db: Session = Depends(get_db)):
    """Get recent activities (default last 10)"""
    activities = db.query(Activity).order_by(Activity.timestamp.desc()).limit(limit).all()
    return activities

@router.get("/", response_model=List[ActivitySchema])
def get_all_activities(skip: int = 0, limit: int = 100, db: Session = Depends(get_db)):
    """Get all activities with pagination"""
    activities = db.query(Activity).order_by(Activity.timestamp.desc()).offset(skip).limit(limit).all()
    return activities
