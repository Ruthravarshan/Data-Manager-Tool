from sqlalchemy import create_engine, text
import os
from dotenv import load_dotenv

load_dotenv()
DATABASE_URL = os.getenv("DATABASE_URL", "postgresql://user:postgres@localhost:5432/clinical_cosmos")
engine = create_engine(DATABASE_URL)

def reset_table():
    print(f"Connecting to {DATABASE_URL}")
    with engine.connect() as conn:
        print("Dropping table integration_schedules...")
        conn.execute(text("DROP TABLE IF EXISTS integration_schedules CASCADE"))
        
        print("Creating table integration_schedules...")
        sql = """
        CREATE TABLE integration_schedules (
            id SERIAL PRIMARY KEY,
            integration_id INTEGER REFERENCES integrations(id),
            schedule_type VARCHAR,
            schedule_config VARCHAR,
            schedule_expression VARCHAR,
            last_run TIMESTAMP,
            next_run TIMESTAMP,
            status VARCHAR DEFAULT 'Active',
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        );
        """
        conn.execute(text(sql))
        conn.commit()
        print("Table recreated successfully.")

if __name__ == "__main__":
    reset_table()
