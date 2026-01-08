from sqlalchemy import create_engine, text
from dotenv import load_dotenv
import os

load_dotenv()

DATABASE_URL = os.getenv("DATABASE_URL", "postgresql://user:postgres@localhost:5433/clinical_cosmos")
engine = create_engine(DATABASE_URL)

def upgrade():
    with engine.connect() as conn:
        try:
            conn.execute(text("ALTER TABLE data_files ADD COLUMN table_name VARCHAR"))
            conn.commit()
            print("Added table_name column to data_files")
        except Exception as e:
            print(f"Error (column might already exist): {e}")
            
if __name__ == "__main__":
    upgrade()
