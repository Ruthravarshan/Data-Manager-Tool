from sqlalchemy import create_engine, text
import os
from dotenv import load_dotenv

load_dotenv()
DATABASE_URL = os.getenv("DATABASE_URL", "postgresql://user:postgres@localhost:5432/clinical_cosmos")
engine = create_engine(DATABASE_URL)

def check_activities():
    with engine.connect() as conn:
        print("--- Recent Activities ---")
        result = conn.execute(text("SELECT action_type, description, timestamp FROM activities ORDER BY timestamp DESC LIMIT 10"))
        rows = result.fetchall()
        for row in rows:
            print(f"[{row.timestamp}] {row.action_type}: {row.description}")

if __name__ == "__main__":
    check_activities()
