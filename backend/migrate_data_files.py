from sqlalchemy import create_engine, text
import os
from dotenv import load_dotenv

load_dotenv()
DATABASE_URL = os.getenv("DATABASE_URL", "postgresql://user:postgres@localhost:5432/clinical_cosmos")
engine = create_engine(DATABASE_URL)

def migrate_data_files():
    print(f"Connecting to {DATABASE_URL}")
    with engine.connect() as conn:
        print("Checking data_files table schema...")
        result = conn.execute(text("SELECT column_name FROM information_schema.columns WHERE table_name = 'data_files'"))
        columns = [row[0] for row in result]
        print(f"Existing columns: {columns}")
        
        if 'protocol_id' not in columns:
            print("Adding missing column 'protocol_id'...")
            conn.execute(text("ALTER TABLE data_files ADD COLUMN protocol_id VARCHAR"))
            conn.commit()
            print("Column 'protocol_id' added successfully.")
        else:
            print("Column 'protocol_id' already exists.")

        if 'record_count' not in columns:
            print("Adding missing column 'record_count'...")
            conn.execute(text("ALTER TABLE data_files ADD COLUMN record_count INTEGER DEFAULT 0"))
            conn.commit()
            print("Column 'record_count' added successfully.")
        else:
            print("Column 'record_count' already exists.")

if __name__ == "__main__":
    migrate_data_files()
