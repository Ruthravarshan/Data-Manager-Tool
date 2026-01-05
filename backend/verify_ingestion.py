import os
import shutil
from fastapi.testclient import TestClient
from app.main import app
from app.database import get_db, engine, Base
from app.models import IntegrationSource, DataFile
import pandas as pd
from sqlalchemy.orm import Session
from datetime import datetime

# Setup
client = TestClient(app)

def setup_test_data():
    # Create a dummy Excel file
    test_dir = "backend/test_data_source"
    os.makedirs(test_dir, exist_ok=True)
    
    df = pd.DataFrame({
        'USUBJID': ['SUBJ001', 'SUBJ002'],
        'AGE': [25, 30],
        'SEX': ['M', 'F']
    })
    # Filename must match classifier pattern: prefix_raw_date.xlsx
    filename = "dm_raw_20250101.xlsx"
    file_path = os.path.join(test_dir, filename)
    df.to_excel(file_path, index=False)
    
    return test_dir, filename, file_path

def verify_ingestion():
    from sqlalchemy import inspect
    insp = inspect(engine)
    columns = [c['name'] for c in insp.get_columns('data_files')]
    print(f"Columns in data_files: {columns}", flush=True)
    if 'table_name' not in columns:
        print("CRITICAL: table_name column missing in DB!", flush=True)
        return

    print("Setting up test data...", flush=True)
    test_dir, filename, file_path = setup_test_data()
    abs_test_dir = os.path.abspath(test_dir)
    
    # Create Integration pointing to this folder
    # We need to manually insert into DB or use API
    # Let's use direct DB access for setup
    with Session(engine) as db:
        # cleanup
        db.query(DataFile).filter(DataFile.file_path.like(f"%{filename}%")).delete()
        db.query(IntegrationSource).filter(IntegrationSource.name == "TestIntegration").delete()
        db.commit()
        
        integration = IntegrationSource(
            name="TestIntegration",
            vendor="TestVendor",
            type="EDC",
            frequency="Daily",
            status="Active",
            folder_path=abs_test_dir
        )
        db.add(integration)
        db.commit()
        db.refresh(integration)
        integration_id = integration.id
        print(f"Created integration with ID: {integration_id}")

    try:
        # Debug routes
        print("Registered Routes:", flush=True)
        for route in app.routes:
            if hasattr(route, "path") and "scan" in route.path:
                methods = getattr(route, "methods", "None")
                print(f"{methods} {route.path}", flush=True)

        # Call Scan API directly via TestClient
        print(f"Calling Scan API: /api/data-files/scan/{integration_id}", flush=True)
        response = client.post(f"/api/data-files/scan/{integration_id}")
        
        if response.status_code != 200:
             print(f"FAILED Response: {response.status_code}", flush=True)
             print(f"Response Body: {response.text}", flush=True)
             
        assert response.status_code == 200, f"Scan failed: {response.text}"
        data = response.json()
        print(f"Scan response: {data}", flush=True)
        
        assert  data['imported_files'] >= 1
        
        # Verify DataFile in DB has table_name
        with Session(engine) as db:
            data_file = db.query(DataFile).filter(DataFile.integration_id == integration_id).first()
            assert data_file is not None
            print(f"Found DataFile: {data_file.filename}, Table: {data_file.table_name}")
            assert data_file.table_name is not None
            
            file_id = data_file.id
            table_name = data_file.table_name

        # Verify Data Retrieval API
        print("Calling Data Retrieval API...")
        response = client.get(f"/api/data-files/{file_id}/data")
        assert response.status_code == 200, f"Get Data failed: {response.text}"
        data_content = response.json()
        
        print("Retrieved Data:")
        print(data_content['columns'])
        print(data_content['rows'])
        
        assert len(data_content['rows']) == 2
        assert data_content['rows'][0]['USUBJID'] == 'SUBJ001'
        
        print("\nSUCCESS: Data ingestion and retrieval verified!")
        
    finally:
        # Cleanup
        if os.path.exists(test_dir):
            shutil.rmtree(test_dir)
            
if __name__ == "__main__":
    verify_ingestion()
