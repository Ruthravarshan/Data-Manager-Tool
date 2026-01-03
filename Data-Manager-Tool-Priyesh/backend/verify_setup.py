"""
Verification script to check if the system is ready
"""
from app.database import SessionLocal
from app.models import IntegrationSource, DataFile, Study, Document, Metric

def verify_setup():
    """Verify all models and database setup"""
    db = SessionLocal()
    
    try:
        print("=" * 60)
        print("SYSTEM VERIFICATION CHECK")
        print("=" * 60)
        
        # Check tables
        integrations_count = db.query(IntegrationSource).count()
        data_files_count = db.query(DataFile).count()
        studies_count = db.query(Study).count()
        documents_count = db.query(Document).count()
        metrics_count = db.query(Metric).count()
        
        print(f"\n✓ Database Tables Status:")
        print(f"  - Integrations: {integrations_count} records")
        print(f"  - Data Files: {data_files_count} records")
        print(f"  - Studies: {studies_count} records")
        print(f"  - Documents: {documents_count} records")
        print(f"  - Metrics: {metrics_count} records")
        
        # Check IntegrationSource has folder_path
        if integrations_count > 0:
            integration = db.query(IntegrationSource).first()
            print(f"\n✓ Sample Integration:")
            print(f"  - Name: {integration.name}")
            print(f"  - Type: {integration.type}")
            print(f"  - Vendor: {integration.vendor}")
            print(f"  - Folder Path: {integration.folder_path}")
        
        print(f"\n✓ All Models Loaded Successfully")
        print(f"  - IntegrationSource model: ✓")
        print(f"  - DataFile model: ✓")
        print(f"  - Study model: ✓")
        print(f"  - Document model: ✓")
        print(f"  - Metric model: ✓")
        
        print(f"\n" + "=" * 60)
        print("VERIFICATION COMPLETE - System is ready!")
        print("=" * 60)
        print(f"\nNext Steps:")
        print(f"1. Start backend: uvicorn app.main:app --reload")
        print(f"2. Start frontend: npm run dev")
        print(f"3. Create integration with folder path in Data Integration tab")
        print(f"4. Click 'Scan Folder' to import Excel files")
        print(f"5. View classified files in Trial Data Management tab")
        
    except Exception as e:
        print(f"✗ Error during verification: {e}")
        raise
    finally:
        db.close()

if __name__ == "__main__":
    verify_setup()
