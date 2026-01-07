from sqlalchemy import create_engine, text
import os
from dotenv import load_dotenv

load_dotenv()
DATABASE_URL = os.getenv("DATABASE_URL", "postgresql://user:postgres@localhost:5432/clinical_cosmos")
engine = create_engine(DATABASE_URL)

def upgrade():
    with engine.connect() as conn:
        try:
            conn.execute(text("ALTER TABLE data_files ADD COLUMN protocol_id VARCHAR"))
            conn.execute(text("CREATE INDEX ix_data_files_protocol_id ON data_files (protocol_id)"))
            conn.commit()
            print("Successfully added protocol_id column")
        except Exception as e:
            print(f"Error (might already exist): {e}")

if __name__ == "__main__":
    upgrade()
