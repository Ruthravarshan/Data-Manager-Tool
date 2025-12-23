from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List
from .. import models, schemas
from ..database import get_db
from datetime import datetime
import random

router = APIRouter(
    prefix="/api",
    tags=["data-manager"]
)

@router.get("/agents", response_model=List[schemas.Agent])
def read_agents(db: Session = Depends(get_db)):
    agents = db.query(models.Agent).all()
    return agents

@router.post("/agents/{agent_id}/refresh", response_model=schemas.Agent)
def refresh_agent(agent_id: int, db: Session = Depends(get_db)):
    agent = db.query(models.Agent).filter(models.Agent.id == agent_id).first()
    if not agent:
        raise HTTPException(status_code=404, detail="Agent not found")
    
    # Simulate processing
    agent.last_active = datetime.utcnow()
    # Randomly increment metrics for simulation
    new_records = random.randint(1, 100)
    agent.records_processed += new_records
    
    # Randomly find issues
    if agent.name == "DQ Processing":
        agent.issues_found += random.randint(0, 5)
        
    db.commit()
    db.refresh(agent)
    
    # Add a log entry
    log = models.ActivityLog(
        agent_name=agent.name,
        message=f"Processed {new_records} records.",
        level="info"
    )
    db.add(log)
    db.commit()
    
    return agent

@router.get("/activity-logs", response_model=List[schemas.ActivityLog])
def read_activity_logs(skip: int = 0, limit: int = 50, db: Session = Depends(get_db)):
    logs = db.query(models.ActivityLog).order_by(models.ActivityLog.timestamp.desc()).offset(skip).limit(limit).all()
    return logs

@router.get("/dq-issues", response_model=List[schemas.DataQualityIssue])
def read_dq_issues(db: Session = Depends(get_db)):
    issues = db.query(models.DataQualityIssue).all()
    return issues
