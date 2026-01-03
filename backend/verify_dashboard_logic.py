import requests
import time

# 1. Fetch Integrations to find the one we created (or any)
try:
    response = requests.get('http://localhost:8000/api/integrations/')
    integrations = response.json()
    print(f"Found {len(integrations)} integrations")
    
    target_id = None
    if integrations:
        # Pick the last one or one with folder path
        for integ in integrations:
            if integ.get('folder_path'):
                target_id = integ['id']
                print(f"Using integration ID: {target_id} ({integ['name']})")
                break
    
    if target_id:
        # 2. Trigger Scan
        print(f"Triggering scan for ID {target_id}...")
        scan_response = requests.post(f'http://localhost:8000/api/data-files/scan/{target_id}')
        if scan_response.status_code == 200:
            print("Scan successful!")
            res = scan_response.json()
            print(f"Files found: {res.get('total_files')}")
            
            # 3. Verify Record Count in response
            for f in res.get('files', []):
                print(f"File: {f['filename']}, Count: {f.get('record_count')}")
                if f.get('record_count') == 0:
                     print("WARNING: Record count is 0. Is it a CSV/Excel file?")
        else:
            print(f"Scan failed: {scan_response.text}")

        # 4. Verify Data Files API
        print("Checking Data Files API with Protocol Filter...")
        # Assuming the scanned file has 'TEST-001' protocol or we filter by what we have
        # Let's just list all and check one
        files_response = requests.get('http://localhost:8000/api/data-files/')
        files = files_response.json()
        if files:
            print(f"API returned {len(files)} files.")
            print(f"Sample: {files[0].get('filename')} - {files[0].get('record_count')} records")
            
    else:
        print("No suitable integration found to test.")

except Exception as e:
    print(f"Error: {e}")
