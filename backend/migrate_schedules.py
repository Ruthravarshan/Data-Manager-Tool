from sqlalchemy import create_engine, text
import os
from dotenv import load_dotenv

load_dotenv()
DATABASE_URL = os.getenv("DATABASE_URL", "postgresql://user:postgres@localhost:5432/clinical_cosmos")
engine = create_engine(DATABASE_URL)

def run_migration():
    # SQL to create the table
    sql = """
    CREATE TABLE IF NOT EXISTS integration_schedules (
        id SERIAL PRIMARY KEY,
        integration_id INTEGER REFERENCES integrations(id),
        schedule_type VARCHAR,
        schedule_config VARCHAR,
        last_run TIMESTAMP,
        next_run TIMESTAMP,
        status VARCHAR DEFAULT 'Active',
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    );
    """
    
    with engine.connect() as conn:
        print("Starting manual migration for schedules...")
        try:
            conn.execute(text(sql))
            conn.commit()
            print("Created integration_schedules table.")
        except Exception as e:
            print(f"FAILED: {e}")

if __name__ == "__main__":
    run_migration()
