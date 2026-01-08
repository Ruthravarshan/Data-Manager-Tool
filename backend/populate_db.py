import os
import glob
import pandas as pd
import hashlib
from sqlalchemy import create_engine, text
from dotenv import load_dotenv

# Load environment variables
load_dotenv()

DATABASE_URL = os.getenv("DATABASE_URL", "postgresql://user:postgres@localhost:5432/clinical_cosmos")
engine = create_engine(DATABASE_URL)

DATA_SOURCE_DIR = os.path.join(os.path.dirname(__file__), "data_source")

def get_file_hash(filepath):
    """Calculates MD5 hash of a file."""
    hasher = hashlib.md5()
    with open(filepath, 'rb') as f:
        buf = f.read()
        hasher.update(buf)
    return hasher.hexdigest()

def init_tracking_table():
    """Creates the tracking table if it doesn't exist."""
    with engine.connect() as conn:
        conn.execute(text("""
            CREATE TABLE IF NOT EXISTS _data_load_tracking (
                id SERIAL PRIMARY KEY,
                file_hash VARCHAR(32) UNIQUE,
                original_filename VARCHAR(255),
                table_name VARCHAR(63),
                load_timestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            )
        """))
        conn.commit()

def get_next_table_name(base_name):
    """Generates the next available table name (e.g., ae_sub1, ae_sub2)."""
    with engine.connect() as conn:
        # Check how many tables with this base name already exist in tracking
        # We query the tracking table to allow multiple runs to pick up where left off
        query = text("SELECT COUNT(*) FROM _data_load_tracking WHERE table_name LIKE :pattern")
        result = conn.execute(query, {"pattern": f"{base_name}_sub%"}).scalar()
        
        next_num = result + 1
        return f"{base_name}_sub{next_num}"

def init_metrics_table():
    """Seeds the metrics table with default 0/null values if empty."""
    with engine.connect() as conn:
        # Check if we have any metrics
        result = conn.execute(text("SELECT COUNT(*) FROM metrics")).scalar()
        if result == 0:
            print("Seeding metrics table with default values...")
            metrics_data = [
                {"key": "data_quality", "value": "0%", "label": "Overall data quality score", "trend": None},
                {"key": "operational", "value": "0%", "label": "Site operational efficiency", "trend": None},
                {"key": "safety", "value": "0%", "label": "Protocol safety adherence", "trend": None},
                {"key": "compliance", "value": "0%", "label": "Regulatory compliance score", "trend": None},
            ]
            
            for metric in metrics_data:
                conn.execute(text("""
                    INSERT INTO metrics (key, value, label, trend)
                    VALUES (:key, :value, :label, :trend)
                """), metric)
            conn.commit()
            print("Metrics seeded successfully.")
        else:
            print("Metrics table already populated. Skipping seed.")

def populate_db():
    print("Starting data population...")
    init_tracking_table()
    init_metrics_table()
    
    # Get all CSV files
    csv_files = glob.glob(os.path.join(DATA_SOURCE_DIR, "*.csv"))
    print(f"Found {len(csv_files)} CSV files.")
    
    processed_count = 0
    skipped_count = 0
    
    for filepath in csv_files:
        filename = os.path.basename(filepath)
        file_hash = get_file_hash(filepath)
        
        with engine.connect() as conn:
            # Check for duplicates
            result = conn.execute(text("SELECT table_name FROM _data_load_tracking WHERE file_hash = :hash"), {"hash": file_hash}).fetchone()
            if result:
                print(f"Skipping {filename}: Already loaded as {result[0]}")
                skipped_count += 1
                continue
        
        # Determine base name (e.g., ae_raw_... -> ae)
        # Strategy: splity by '_raw' if present, else just take name
        if "_raw" in filename:
            base_name = filename.split("_raw")[0]
        else:
            base_name = filename.split(".")[0].split("_")[0] # Check first part if no _raw
            
        # Clean up base name to be safe for SQL identifier?
        base_name = base_name.lower().replace("-", "_")
        
        table_name = get_next_table_name(base_name)
        
        try:
            print(f"Loading {filename} into {table_name}...")
            df = pd.read_csv(filepath)
            
            # Write to DB
            df.to_sql(table_name, engine, if_exists='fail', index=False)
            
            # Update tracking
            with engine.connect() as conn:
                conn.execute(text("""
                    INSERT INTO _data_load_tracking (file_hash, original_filename, table_name)
                    VALUES (:hash, :filename, :table)
                """), {"hash": file_hash, "filename": filename, "table": table_name})
                conn.commit()
                
            processed_count += 1
            print(f"Successfully loaded {table_name}")
            
        except Exception as e:
            print(f"Error loading {filename}: {e}")
            # If table was created but tracking failed, we might have an issue. 
            # But 'fail' in to_sql prevents partial overwrites.
            
    print(f"Finished. Processed: {processed_count}, Skipped: {skipped_count}")

if __name__ == "__main__":
    populate_db()
