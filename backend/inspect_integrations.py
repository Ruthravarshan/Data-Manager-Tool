from sqlalchemy import create_engine, text
import os
from dotenv import load_dotenv

load_dotenv()
DATABASE_URL = os.getenv("DATABASE_URL", "postgresql://user:postgres@localhost:5432/clinical_cosmos")
engine = create_engine(DATABASE_URL)

def inspect_integrations():
    with engine.connect() as conn:
        print("--- Checking Integrations ---")
        result = conn.execute(text("SELECT id, name, vendor, status, last_sync, folder_path, protocol_id FROM integrations"))
        rows = result.fetchall()
        print(f"Total integrations: {len(rows)}")
        for row in rows:
            print(f"ID: {row.id}")
            print(f"  Name: {row.name}")
            print(f"  Vendor: {row.vendor}")
            print(f"  Status: {row.status}")
            print(f"  Last Sync: {row.last_sync}")
            print(f"  Folder: {row.folder_path}")
            print(f"  Protocol: {row.protocol_id}")
            print("-" * 20)

if __name__ == "__main__":
    inspect_integrations()
