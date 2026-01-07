#!/usr/bin/env python
"""
Quick script to scan data_source folder and populate DataFile records in the database
"""
import os
import sys
sys.path.insert(0, os.path.join(os.path.dirname(__file__), 'backend'))

from app.database import SessionLocal, engine
from app.models import DataFile, IntegrationSource, Base
from app.file_classifier import scan_folder
from datetime import datetime

# Create tables if they don't exist
Base.metadata.create_all(bind=engine)

db = SessionLocal()

try:
    # Get or create a default integration source for testing
    integration = db.query(IntegrationSource).first()
    if not integration:
        integration = IntegrationSource(
            name="Local Data Source",
            type="local",
            protocol_id="PRO001",
            data_source_path="data_source"
        )
        db.add(integration)
        db.commit()
        print(f"Created integration: {integration.name}")
    else:
        print(f"Using existing integration: {integration.name}")
    
    # Scan the data_source folder
    data_source_path = os.path.join(os.path.dirname(__file__), "data_source")
    print(f"\nScanning data source folder: {data_source_path}")
    
    classified_files = scan_folder(data_source_path)
    print(f"Found {len(classified_files)} files to import")
    
    # Add files to database
    imported_count = 0
    for file_info in classified_files:
        # Check if file already exists
        existing = db.query(DataFile).filter(
            DataFile.filename == file_info.filename,
            DataFile.integration_id == integration.id
        ).first()
        
        if not existing:
            data_file = DataFile(
                filename=file_info.filename,
                prefix=file_info.prefix,
                section=file_info.section,
                file_path=file_info.file_path,
                file_size=file_info.file_size,
                timestamp=file_info.timestamp,
                status="Imported",
                integration_id=integration.id,
                created_at=datetime.utcnow()
            )
            db.add(data_file)
            imported_count += 1
            print(f"  ✓ {file_info.filename} → {file_info.section}")
    
    db.commit()
    print(f"\n✅ Imported {imported_count} new files to database")
    
    # Show summary
    sections = db.query(DataFile.section).distinct().all()
    print(f"\nAvailable sections: {', '.join([s[0] for s in sections if s[0]])}")
    
except Exception as e:
    print(f"❌ Error: {e}")
    db.rollback()
    import traceback
    traceback.print_exc()
finally:
    db.close()
