from sqlalchemy import create_engine, text
import os
from dotenv import load_dotenv

load_dotenv()
DATABASE_URL = os.getenv("DATABASE_URL", "postgresql://user:postgres@localhost:5432/clinical_cosmos")
engine = create_engine(DATABASE_URL)

def check_specific():
    with engine.connect() as conn:
        for col in ["therapeutic_area", "indication", "phase", "status"]:
            try:
                conn.execute(text(f"SELECT {col} FROM studies LIMIT 1"))
                print(f"Column '{col}' exists.")
            except Exception:
                print(f"Column '{col}' MISSING.")

if __name__ == "__main__":
    check_specific()
