from sqlalchemy import create_engine, text
import os
from dotenv import load_dotenv

load_dotenv()
DATABASE_URL = os.getenv("DATABASE_URL", "postgresql://user:postgres@localhost:5432/clinical_cosmos")
engine = create_engine(DATABASE_URL)

def force_fix():
    sql = "ALTER TABLE data_files ALTER COLUMN file_size TYPE VARCHAR USING file_size::VARCHAR"
    with engine.connect() as conn:
        print(f"Executing: {sql}")
        conn.execute(text(sql))
        conn.commit()
        print("✓ Database column 'file_size' converted to VARCHAR")

if __name__ == "__main__":
    force_fix()
