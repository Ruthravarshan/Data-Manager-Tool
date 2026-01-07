from sqlalchemy import create_engine, text
import os
import uuid
from datetime import date
from dotenv import load_dotenv

load_dotenv()
DATABASE_URL = os.getenv("DATABASE_URL", "postgresql://user:postgres@localhost:5432/clinical_cosmos")
engine = create_engine(DATABASE_URL)

def test_insert():
    with engine.connect() as conn:
        print("--- Testing study insertion directly ---")
        try:
            # Attempt to insert a basic study with all common fields
            conn.execute(text("""
                INSERT INTO studies (
                    id, title, protocol_id, phase, status, 
                    sites_count, subjects_count, start_date, 
                    description, completion_percentage, 
                    therapeutic_area, indication
                ) VALUES (
                    :id, :title, :protocol_id, :phase, :status, 
                    :sites_count, :subjects_count, :start_date, 
                    :description, :completion_percentage, 
                    :therapeutic_area, :indication
                )
            """), {
                "id": "ST-TEST-" + uuid.uuid4().hex[:4],
                "title": "Test Study",
                "protocol_id": "PRO-TEST",
                "phase": "Phase 1",
                "status": "Active",
                "sites_count": 0,
                "subjects_count": 0,
                "start_date": date.today(),
                "description": "Test",
                "completion_percentage": 0,
                "therapeutic_area": "Test TA",
                "indication": "Test Indication"
            })
            conn.commit()
            print("✓ Successfully inserted study")
        except Exception as e:
            print(f"✗ Failed to insert study: {e}")

if __name__ == "__main__":
    test_insert()
