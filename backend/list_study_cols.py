from sqlalchemy import create_engine, text
import os
from dotenv import load_dotenv

load_dotenv()
DATABASE_URL = os.getenv("DATABASE_URL", "postgresql://user:postgres@localhost:5432/clinical_cosmos")
engine = create_engine(DATABASE_URL)

def list_cols():
    with engine.connect() as conn:
        result = conn.execute(text("""
            SELECT column_name 
            FROM information_schema.columns 
            WHERE table_name = 'studies'
        """))
        cols = [row[0] for row in result.fetchall()]
        print("COLUMNS: " + ", ".join(cols))

if __name__ == "__main__":
    list_cols()
