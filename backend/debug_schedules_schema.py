from sqlalchemy import create_engine, inspect
import os
from dotenv import load_dotenv

load_dotenv()
DATABASE_URL = os.getenv("DATABASE_URL", "postgresql://user:postgres@localhost:5432/clinical_cosmos")
engine = create_engine(DATABASE_URL)

def check_schema():
    inspector = inspect(engine)
    if "integration_schedules" in inspector.get_table_names():
        print("Table 'integration_schedules' exists.")
        columns = [c['name'] for c in inspector.get_columns("integration_schedules")]
        print(f"Columns: {columns}")
    else:
        print("Table 'integration_schedules' does NOT exist.")

if __name__ == "__main__":
    check_schema()
