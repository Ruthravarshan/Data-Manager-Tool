from sqlalchemy import create_engine, text
import os
from dotenv import load_dotenv

load_dotenv()
DATABASE_URL = os.getenv("DATABASE_URL", "postgresql://user:postgres@localhost:5432/clinical_cosmos")
engine = create_engine(DATABASE_URL)

def upgrade():
    with engine.connect() as conn:
        try:
            conn.execute(text("ALTER TABLE data_files ADD COLUMN record_count INTEGER DEFAULT 0"))
            conn.commit()
            print("Successfully added record_count column")
        except Exception as e:
            print(f"Error (might already exist): {e}")

if __name__ == "__main__":
    upgrade()
