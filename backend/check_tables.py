from sqlalchemy import create_engine, text
import os
from dotenv import load_dotenv

load_dotenv()
DATABASE_URL = os.getenv("DATABASE_URL", "postgresql://user:postgres@localhost:5432/clinical_cosmos")
engine = create_engine(DATABASE_URL)

def check_tables():
    with engine.connect() as conn:
        result = conn.execute(text("SELECT table_name FROM information_schema.tables WHERE table_schema = 'public'"))
        tables = [row[0] for row in result.fetchall()]
        print("Tables in DB:", tables)
        
        required = ["studies", "activities", "documents", "integrations", "metrics"]
        missing = [t for t in required if t not in tables]
        if missing:
            print(f"MISSING TABLES: {missing}")
        else:
            print("All required tables exist.")

if __name__ == "__main__":
    check_tables()
