import os
from sqlalchemy import create_engine, text
from dotenv import load_dotenv

load_dotenv()
DATABASE_URL = os.getenv("DATABASE_URL", "postgresql://postgres:2664@localhost:5432/clinical_cosmos")
engine = create_engine(DATABASE_URL)

def verify():
    with engine.connect() as conn:
        print("# Verification Report\n")
        
        # Check Tracking Table
        print("## Tracking Table (_data_load_tracking)")
        result = conn.execute(text("SELECT count(*) FROM _data_load_tracking")).scalar()
        print(f"Total entries: {result}")
        print("Sample entries:")
        rows = conn.execute(text("SELECT original_filename, table_name, load_timestamp FROM _data_load_tracking LIMIT 5")).fetchall()
        for row in rows:
            print(f"- {row[0]} -> {row[1]} ({row[2]})")
            
        # Check Source Tables
        print("\n## Created Tables (Sample)")
        tables = conn.execute(text("SELECT table_name FROM _data_load_tracking")).fetchall()
        table_names = [r[0] for r in tables]
        
        for t in table_names[:5]:
            count = conn.execute(text(f"SELECT count(*) FROM {t}")).scalar()
            print(f"- {t}: {count} rows")

if __name__ == "__main__":
    verify()
