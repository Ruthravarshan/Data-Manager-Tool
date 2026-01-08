from app.database import SessionLocal, engine
from app.models import DataFile
from sqlalchemy import text
import pandas as pd
import os
import logging
from datetime import datetime

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

db = SessionLocal()

try:
    files = db.query(DataFile).all()
    logger.info(f"Total DataFiles found: {len(files)}")
    
    restored_count = 0
    
    for f in files:
        if not f.table_name:
            continue
            
        table_exists = False
        try:
            with db.begin_nested():
                db.execute(text(f'SELECT 1 from "{f.table_name}" LIMIT 1'))
                table_exists = True
        except:
            pass
            
        if not table_exists:
            logger.info(f"Restoring table {f.table_name} for file {f.filename}...")
            
            if f.file_path and os.path.exists(f.file_path):
                try:
                    df = None
                    if f.filename.lower().endswith('.csv'):
                        df = pd.read_csv(f.file_path)
                    elif f.filename.lower().endswith(('.xlsx', '.xls')):
                        df = pd.read_excel(f.file_path)
                    
                    if df is not None:
                        # Add metadata columns if they don't exist in source
                        if '_imported_at' not in df.columns:
                            df['_imported_at'] = datetime.utcnow()
                        if '_source_file' not in df.columns:
                            df['_source_file'] = f.filename
                            
                        # Write to DB
                        df.to_sql(f.table_name, engine, if_exists='replace', index=False)
                        restored_count += 1
                        logger.info(f"Successfully restored {f.table_name}")
                    else:
                        logger.error(f"Could not read data from {f.file_path}")
                except Exception as e:
                    logger.error(f"Failed to ingest {f.filename}: {e}")
            else:
                logger.error(f"Source file missing: {f.file_path}")

    logger.info(f"Restoration complete. Restored {restored_count} tables.")

except Exception as e:
    logger.error(f"Top level error: {e}")
finally:
    db.close()
