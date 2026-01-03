from sqlalchemy import create_engine, text
import os
from dotenv import load_dotenv

load_dotenv()
DATABASE_URL = os.getenv("DATABASE_URL", "postgresql://user:postgres@localhost:5432/clinical_cosmos")
engine = create_engine(DATABASE_URL)

def debug_schema():
    with engine.connect() as conn:
        print("--- Testing studies table schema ---")
        try:
            result = conn.execute(text("""
                SELECT column_name, data_type 
                FROM information_schema.columns 
                WHERE table_name = 'studies'
            """))
            columns = result.fetchall()
            if not columns:
                print("Table 'studies' not found!")
            else:
                for col in columns:
                    print(f"Column: {col[0]}, Type: {col[1]}")
        except Exception as e:
            print(f"Error: {e}")

if __name__ == "__main__":
    debug_schema()
