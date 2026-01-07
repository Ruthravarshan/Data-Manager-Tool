from sqlalchemy import create_engine, text
import os
from dotenv import load_dotenv

load_dotenv()
DATABASE_URL = os.getenv("DATABASE_URL", "postgresql://user:postgres@localhost:5432/clinical_cosmos")
engine = create_engine(DATABASE_URL)

def run_migration():
    migrations = [
        # Table: studies
        "ALTER TABLE studies ADD COLUMN IF NOT EXISTS created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP",
        "ALTER TABLE studies ADD COLUMN IF NOT EXISTS end_date DATE",
        "ALTER TABLE studies ADD COLUMN IF NOT EXISTS therapeutic_area VARCHAR",
        "ALTER TABLE studies ADD COLUMN IF NOT EXISTS indication VARCHAR",
        
        # Table: integrations
        "ALTER TABLE integrations ADD COLUMN IF NOT EXISTS protocol_id VARCHAR",
        "ALTER TABLE integrations ADD COLUMN IF NOT EXISTS folder_path VARCHAR",
        
        # Table: data_files (The table might be missing entirely or have wrong columns)
        "ALTER TABLE data_files ADD COLUMN IF NOT EXISTS prefix VARCHAR",
        "ALTER TABLE data_files ADD COLUMN IF NOT EXISTS file_size VARCHAR",
        "ALTER TABLE data_files ADD COLUMN IF NOT EXISTS timestamp VARCHAR",
        "ALTER TABLE data_files ADD COLUMN IF NOT EXISTS last_updated TIMESTAMP",
        "ALTER TABLE data_files ADD COLUMN IF NOT EXISTS created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP",
    ]
    
    with engine.connect() as conn:
        print("Starting manual migrations...")
        for sql in migrations:
            try:
                conn.execute(text(sql))
                conn.commit()
                print(f"✓ Executed: {sql[:50]}...")
            except Exception as e:
                print(f"SKIPPED/FAILED ({sql[:30]}): {e}")

if __name__ == "__main__":
    run_migration()
