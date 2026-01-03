from sqlalchemy import create_engine, text
import os
from dotenv import load_dotenv

load_dotenv()
DATABASE_URL = os.getenv("DATABASE_URL", "postgresql://user:postgres@localhost:5432/clinical_cosmos")
engine = create_engine(DATABASE_URL)

def check_datasource():
    with engine.connect() as conn:
        print("--- CONCISE CHECK ---")
        result = conn.execute(text("SELECT id, name, status, folder_path FROM integrations WHERE name = 'Data Source'"))
        for row in result:
            print(f"ID: {row[0]} | Status: {row[2]} | Path: {row[3]}")

if __name__ == "__main__":
    check_datasource()
