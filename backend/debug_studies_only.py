from sqlalchemy import create_engine, text
import os
from dotenv import load_dotenv

load_dotenv()
DATABASE_URL = os.getenv("DATABASE_URL", "postgresql://user:postgres@localhost:5432/clinical_cosmos")
engine = create_engine(DATABASE_URL)

def inspect_data():
    with engine.connect() as conn:
        print("--- Checking Studies ---")
        result = conn.execute(text("SELECT id, title, protocol_id FROM studies"))
        rows = result.fetchall()
        print(f"Total studies: {len(rows)}")
        for row in rows:
            print(f"ID: {row.id}, Title: {row.title}, Protocol: {row.protocol_id}")

if __name__ == "__main__":
    inspect_data()
