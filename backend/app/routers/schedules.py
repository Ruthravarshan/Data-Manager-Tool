from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List
from datetime import datetime, timedelta
import json
from .. import models, schemas, database

router = APIRouter(
    prefix="/api/schedules",
    tags=["schedules"],
    responses={404: {"description": "Not found"}},
)

def get_db():
    db = database.SessionLocal()
    try:
        yield db
    finally:
        db.close()

def calculate_next_run(schedule_type: str, schedule_config: str, last_run: datetime = None) -> datetime:
    """
    Calculate next run time based on schedule type and config.
    This is a basic implementation. Custom logic can be expanded.
    """
    now = datetime.now()
    base_time = last_run if last_run else now
    
    # Safely parse config
    try:
        config = json.loads(schedule_config) if schedule_config else {}
    except:
        config = {}

    if schedule_type.lower() == "manual":
        return None

    if schedule_type.lower() == "hourly":
        return base_time + timedelta(hours=1)
    
    if schedule_type.lower() == "daily":
        # Check if specific time is provided in config e.g. {"time": "14:00"}
        target_time = config.get("time")
        if target_time:
            try:
                h, m = map(int, target_time.split(":"))
                # Create a candidate run time for TODAY at the target time
                candidate = now.replace(hour=h, minute=m, second=0, microsecond=0)
                
                # If the candidate time has already passed today, schedule for TOMORROW
                if candidate <= now:
                    candidate += timedelta(days=1)
                
                return candidate
            except:
                pass
        return base_time + timedelta(days=1)
    
    if schedule_type.lower() == "weekly":
        return base_time + timedelta(weeks=1)

    if schedule_type.lower() == "monthly":
        # Naive implementation: add 30 days
        return base_time + timedelta(days=30)
    
    if schedule_type.lower() == "custom":
        # E.g. {"repeat_every": 2, "unit": "hours"}
        repeat = int(config.get("repeat_every", 1))
        unit = config.get("unit", "hours")
        if unit == "minutes":
            return base_time + timedelta(minutes=repeat)
        if unit == "hours":
            return base_time + timedelta(hours=repeat)
        if unit == "days":
            return base_time + timedelta(days=repeat)

    return base_time + timedelta(days=1) # Default fallback

@router.post("/", response_model=schemas.IntegrationSchedule)
def create_schedule(schedule: schemas.IntegrationScheduleCreate, db: Session = Depends(get_db)):
    # Check if integration exists
    integration = db.query(models.IntegrationSource).filter(models.IntegrationSource.id == schedule.integration_id).first()
    if not integration:
        raise HTTPException(status_code=404, detail="Integration not found")

    next_run = calculate_next_run(schedule.schedule_type, schedule.schedule_config)
    
    db_schedule = models.IntegrationSchedule(
        integration_id=schedule.integration_id,
        schedule_type=schedule.schedule_type,
        schedule_config=schedule.schedule_config,
        next_run=next_run,
        status="Active"
    )
    try:
        db.add(db_schedule)
        db.commit()
        db.refresh(db_schedule)
    except Exception as e:
        print(f"Error creating schedule: {e}")
        import traceback
        traceback.print_exc()
        raise HTTPException(status_code=500, detail=str(e))
    return db_schedule

@router.get("/", response_model=List[schemas.IntegrationSchedule])
def list_schedules(db: Session = Depends(get_db)):
    return db.query(models.IntegrationSchedule).all()

@router.delete("/{id}", response_model=schemas.IntegrationSchedule)
def delete_schedule(id: int, db: Session = Depends(get_db)):
    schedule = db.query(models.IntegrationSchedule).filter(models.IntegrationSchedule.id == id).first()
    if not schedule:
        raise HTTPException(status_code=404, detail="Schedule not found")
    
    schedule_schema = schemas.IntegrationSchedule.from_orm(schedule)
    db.delete(schedule)
    db.commit()
    return schedule_schema

@router.post("/{id}/pause", response_model=schemas.IntegrationSchedule)
def toggle_pause(id: int, db: Session = Depends(get_db)):
    schedule = db.query(models.IntegrationSchedule).filter(models.IntegrationSchedule.id == id).first()
    if not schedule:
        raise HTTPException(status_code=404, detail="Schedule not found")
    
    if schedule.status == "Paused":
        schedule.status = "Active"
    else:
        schedule.status = "Paused"
    
    db.commit()
    db.refresh(schedule)
    return schedule

@router.post("/{id}/refresh", response_model=schemas.IntegrationSchedule)
def refresh_schedule(id: int, db: Session = Depends(get_db)):
    schedule = db.query(models.IntegrationSchedule).filter(models.IntegrationSchedule.id == id).first()
    if not schedule:
        raise HTTPException(status_code=404, detail="Schedule not found")
    
    # Check if we should actually run logic here or just update metadata
    # For now, just update last_run and next_run
    now = datetime.now()
    schedule.last_run = now
    
    # IMPORTANT: Manual refresh should NOT update next_run for future schedules
    # It only updates the last_run timestamp to show it was executed now.
    # schedule.next_run = calculate_next_run(schedule.schedule_type, schedule.schedule_config, last_run=now)
    
    # Sync with Integration Source
    if schedule.integration:
        schedule.integration.last_sync = now

    db.commit()
    db.refresh(schedule)
    return schedule

@router.put("/{id}", response_model=schemas.IntegrationSchedule)
def update_schedule(id: int, schedule: schemas.IntegrationScheduleUpdate, db: Session = Depends(get_db)):
    db_schedule = db.query(models.IntegrationSchedule).filter(models.IntegrationSchedule.id == id).first()
    if not db_schedule:
        raise HTTPException(status_code=404, detail="Schedule not found")

    # Update fields
    if schedule.schedule_type is not None:
        db_schedule.schedule_type = schedule.schedule_type
    if schedule.schedule_config is not None:
        db_schedule.schedule_config = schedule.schedule_config
    if schedule.status is not None:
        db_schedule.status = schedule.status
    
    # Recalculate next_run immediately based on new config
    # We pass last_run as None to force calculation from 'now' respecting the new time
    db_schedule.next_run = calculate_next_run(db_schedule.schedule_type, db_schedule.schedule_config)

    db.commit()
    db.refresh(db_schedule)
    return db_schedule
