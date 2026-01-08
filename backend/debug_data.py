from app.database import SessionLocal
from app.models import DataFile
from sqlalchemy import text
import os

db = SessionLocal()

try:
    files = db.query(DataFile).all()
    print(f"Total DataFiles found: {len(files)}")
    
    missing_tables = 0
    missing_files = 0

    for f in files:
        if not f.table_name:
            continue
            
        file_exists = os.path.exists(f.file_path) if f.file_path else False
        table_exists = False
        
        try:
            with db.begin_nested():
                db.execute(text(f'SELECT 1 from "{f.table_name}" LIMIT 1'))
                table_exists = True
        except:
            pass
            
        if not table_exists:
            missing_tables += 1
            print(f"ID: {f.id}, Table: {f.table_name} MISSING. File: {f.file_path} (Exists: {file_exists})")
            if not file_exists:
                missing_files += 1

    print(f"Summary: Missing Tables: {missing_tables}, Missing Source Files: {missing_files}")

except Exception as e:
    print(f"Top level error: {e}")
finally:
    db.close()
