from sqlalchemy import create_engine, text
import os
from dotenv import load_dotenv

load_dotenv()
DATABASE_URL = os.getenv("DATABASE_URL", "postgresql://user:postgres@localhost:5432/clinical_cosmos")
engine = create_engine(DATABASE_URL)

def verify():
    with engine.connect() as conn:
        result = conn.execute(text("SELECT id, filename, protocol_id, section, status FROM data_files WHERE protocol_id LIKE '%PRO-003%'"))
        rows = result.fetchall()
        print(f"--- Records found for PRO-003: {len(rows)} ---")
        for row in rows:
            print(f"ID: {row[0]} | File: {row[1]} | Protocol: '{row[2]}' | Section: '{row[3]}' | Status: {row[4]}")

if __name__ == "__main__":
    verify()
