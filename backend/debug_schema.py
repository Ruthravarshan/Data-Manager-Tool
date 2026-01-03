from sqlalchemy import create_engine, inspect
import os
from dotenv import load_dotenv

load_dotenv()
DATABASE_URL = os.getenv("DATABASE_URL", "postgresql://user:postgres@localhost:5432/clinical_cosmos")
engine = create_engine(DATABASE_URL)

def inspect_schema():
    insp = inspect(engine)
    columns = insp.get_columns('data_files')
    col_names = [col['name'] for col in columns]
    if 'protocol_id' in col_names:
        print("PROTOCOL_ID_EXISTS: YES")
    else:
        print("PROTOCOL_ID_EXISTS: NO")
    
    print(f"All columns: {col_names}")

if __name__ == "__main__":
    inspect_schema()
