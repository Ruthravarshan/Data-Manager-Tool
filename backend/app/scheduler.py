import asyncio
import json
from datetime import datetime
from sqlalchemy.orm import Session
from . import models, database
from .routers.schedules import calculate_next_run

async def run_scheduler():
    print("Starting Background Scheduler...")
    while True:
        try:
            db = database.SessionLocal()
            now = datetime.now()
            
            # Find active schedules due for execution
            # We filter for schedules where next_run is present and in the past/present
            schedules = db.query(models.IntegrationSchedule).filter(
                models.IntegrationSchedule.status == "Active",
                models.IntegrationSchedule.next_run != None,
                models.IntegrationSchedule.next_run <= now
            ).all()

            for schedule in schedules:
                try:
                    print(f"Executing schedule {schedule.id} for Integration {schedule.integration_id}")
                    
                    # 1. Update last_run to NOW (execution time)
                    schedule.last_run = now
                    
                    # 2. Update next_run
                    # We pass 'now' as last_run to ensure calculation is based on this execution
                    new_next_run = calculate_next_run(schedule.schedule_type, schedule.schedule_config, last_run=now)
                    schedule.next_run = new_next_run
                    
                    # 3. Sync Integration Source last_sync
                    if schedule.integration:
                        schedule.integration.last_sync = now
                        # Also update status if needed, but keeping it simple for now
                    
                    db.commit()
                    print(f"Schedule {schedule.id} updated. Next run: {new_next_run}")
                    
                except Exception as inner_e:
                    print(f"Error processing schedule {schedule.id}: {inner_e}")
                    db.rollback()
            
            db.close()
        except Exception as e:
            print(f"Scheduler Loop Error: {e}")
            
        # Check every 60 seconds
        await asyncio.sleep(60)
