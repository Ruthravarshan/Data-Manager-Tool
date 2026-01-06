import traceback
from sqlalchemy.orm import Session
from app.database import SessionLocal, engine
from app.models import IntegrationSource, DataFile
from app.file_classifier import scan_folder_recursive
from datetime import datetime
import os

def debug_scan(integration_id):
    db = SessionLocal()
    try:
        # Get the integration
        integration = db.query(IntegrationSource).filter(IntegrationSource.id == integration_id).first()
        if not integration:
            print(f"Integration {integration_id} not found")
            return
        
        print(f"Integration found: {integration.name}, folder: {integration.folder_path}")
        
        if not integration.folder_path:
            print(f"Folder path not configured for integration {integration_id}")
            return
        
        # Check if folder exists
        if not os.path.exists(integration.folder_path):
            print(f"ERROR: Folder does not exist: {integration.folder_path}")
            # return
        
        # Scan folder
        print(f"Starting folder scan for: {integration.folder_path}")
        results, warnings = scan_folder_recursive(integration.folder_path)
        print(f"Scan completed. Found {len(results)} files. Warnings: {warnings}")
        
        # Clear existing files for this integration
        print("Clearing existing files...")
        db.query(DataFile).filter(DataFile.integration_id == integration_id).delete()
        db.commit()
        print("Cleared.")
        
        # Store results in database
        print("Storing results...")
        for result in results:
            data_file = DataFile(
                filename=result.filename,
                prefix=result.prefix,
                section=result.section,
                file_path=result.file_path if result.file_path else 
                          f"{integration.folder_path}/{result.filename}",
                file_size=str(result.file_size), # Model says String, result.file_size is int
                created_at=result.timestamp if isinstance(result.timestamp, datetime) else datetime.utcnow(),
                status=result.status,
                protocol_id=result.protocol_id,
                integration_id=integration_id,
                record_count=result.record_count
            )
            db.add(data_file)
        
        db.commit()
        print("Successfully saved to database")
        
        # Update integration's last_sync
        integration.last_sync = datetime.utcnow()
        db.commit()
        print("Updated last_sync")
        
    except Exception as e:
        print(f"EXCEPTION OCCURRED: {e}")
        traceback.print_exc()
        db.rollback()
    finally:
        db.close()

if __name__ == "__main__":
    # Test for both integrations found earlier
    print("--- Testing Integration 1 ---")
    debug_scan(1)
    # print("\n--- Testing Integration 2 ---")
    # debug_scan(2)
