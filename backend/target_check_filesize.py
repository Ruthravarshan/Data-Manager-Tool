from sqlalchemy import create_engine, inspect
import os
from dotenv import load_dotenv

load_dotenv()
DATABASE_URL = os.getenv("DATABASE_URL", "postgresql://user:postgres@localhost:5432/clinical_cosmos")
engine = create_engine(DATABASE_URL)

def target_check():
    insp = inspect(engine)
    columns = insp.get_columns('data_files')
    for col in columns:
        if col['name'] == 'file_size':
            print(f"TARGET_COLUMN: {col['name']} | TARGET_TYPE: {col['type']}")
            return
    print("TARGET_COLUMN: file_size | TARGET_TYPE: NOT FOUND")

if __name__ == "__main__":
    target_check()
