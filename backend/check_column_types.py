from sqlalchemy import create_engine, inspect
import os
from dotenv import load_dotenv

load_dotenv()
DATABASE_URL = os.getenv("DATABASE_URL", "postgresql://user:postgres@localhost:5432/clinical_cosmos")
engine = create_engine(DATABASE_URL)

def check_types():
    insp = inspect(engine)
    columns = insp.get_columns('data_files')
    print("--- FULL TYPE REPORT ---")
    for col in columns:
        print(f"COL: {col['name']} | TYPE: {col['type']}")
    print("--- END REPORT ---")

if __name__ == "__main__":
    check_types()
