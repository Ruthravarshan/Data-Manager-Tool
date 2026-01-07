import os
import glob
from sqlalchemy import create_engine, text
from sqlalchemy.orm import sessionmaker
from app.models import Base, IntegrationSource, DataFile, Study
from app.table_classifier import classify_table
from app.database import DATABASE_URL
from dotenv import load_dotenv
import hashlib
from datetime import datetime

# Load environment variables
load_dotenv()

engine = create_engine(DATABASE_URL)
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)
db = SessionLocal()

DATA_SOURCE_DIR = os.path.join(os.path.dirname(os.path.abspath(__file__)), "data_source")

def get_file_hash(filepath):
    """Calculates MD5 hash of a file."""
    hasher = hashlib.md5()
    with open(filepath, 'rb') as f:
        buf = f.read()
        hasher.update(buf)
    return hasher.hexdigest()

def sync_data_files():
    print("Syncing DataFile records...")

    # 1. Get a Default Study/Protocol FIRST
    protocol_id = "DT2-2024-PH3"
    study = db.query(Study).filter(Study.protocol_id == protocol_id).first()
    if not study:
        print(f"Warning: Protocol {protocol_id} not found. Using first available study.")
        study = db.query(Study).first()
        if study:
            protocol_id = study.protocol_id
            print(f"Using protocol: {protocol_id}")
        else:
            print("Error: No studies found. Cannot link data files.")
            return

    # 2. Get or Create Local Integration Source
    integration = db.query(IntegrationSource).filter(IntegrationSource.name == "Local Data Repository").first()
    if not integration:
        print("Creating 'Local Data Repository' integration...")
        integration = IntegrationSource(
            name="Local Data Repository",
            vendor="Internal",
            type="Local",
            frequency="Ad-hoc",
            status="Active",
            protocol_id=protocol_id
        )
        db.add(integration)
        db.commit()
        db.refresh(integration)
    else:
        print(f"Using existing integration: {integration.name}")
        if not integration.protocol_id:
            integration.protocol_id = protocol_id
            db.commit()

    # 3. Get Tracking Data Map (FileHash -> TableName)
    tracking_map = {}
    try:
        with engine.connect() as conn:
            result = conn.execute(text("SELECT file_hash, table_name FROM _data_load_tracking"))
            for row in result:
                tracking_map[row[0]] = row[1]
    except Exception as e:
        print(f"Warning: Could not read _data_load_tracking: {e}")

    # 4. Scan Files
    files = glob.glob(os.path.join(DATA_SOURCE_DIR, "*.*"))
    print(f"Found {len(files)} files in data_source.")

    count_added = 0
    count_updated = 0

    for filepath in files:
        filename = os.path.basename(filepath)
        if filename.startswith('.'): continue
        if not filename.lower().endswith(('.csv', '.xlsx', '.xls')): continue

        file_hash = get_file_hash(filepath)
        table_name = tracking_map.get(file_hash)

        # Classify
        prefix, domain, category, description = classify_table(filename)
        
        # Section name format usage: "AE (Adverse Events)" or just "AE" depending on frontend?
        # Frontend logic often splits by space.
        # table_classifier returns simple domain "Adverse Events".
        # We construct section as "AE (Adverse Events)" to match what might be expected or just "AE".
        # In data_files.py: domain = section.split()[0]
        # So "AE (Adverse Events)" -> domain="AE".
        
        if prefix and domain:
            section_name = f"{prefix.upper()} ({domain})"
        else:
            section_name = "Unclassified"

        # Check if DataFile exists
        data_file = db.query(DataFile).filter(DataFile.file_path == filepath).first()

        if data_file:
            # Update
            data_file.last_updated = datetime.now() # Mock update
            if table_name and data_file.table_name != table_name:
                data_file.table_name = table_name
                count_updated += 1
            # ensure integration link
            if data_file.integration_id != integration.id:
                 data_file.integration_id = integration.id
                 count_updated += 1
        else:
            # Create
            file_stats = os.stat(filepath)
            data_file = DataFile(
                filename=filename,
                file_path=filepath,
                file_size=file_stats.st_size,
                status="Active",
                integration_id=integration.id,
                section=section_name,
                table_name=table_name
            )
            db.add(data_file)
            count_added += 1

    db.commit()
    print(f"Sync complete. Added: {count_added}, Updated: {count_updated}")

if __name__ == "__main__":
    sync_data_files()
