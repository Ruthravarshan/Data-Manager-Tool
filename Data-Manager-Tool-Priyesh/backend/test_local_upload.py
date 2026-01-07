import requests
import os

API_BASE = "http://localhost:8000"

def test_upload():
    # 1. Get a study ID
    print("Fetching studies...")
    resp = requests.get(f"{API_BASE}/api/studies/")
    if resp.status_code != 200:
        print("Failed to fetch studies")
        return
    
    studies = resp.json()
    if not studies:
        print("No studies found")
        return
    
    study_id = studies[0]['id']
    print(f"Using Study ID: {study_id}")

    # 2. Create dummy file
    filename = "test_doc.pdf"
    with open(filename, "wb") as f:
        f.write(b"%PDF-1.4\nTest PDF content")
        
    # 3. Upload file
    print(f"Uploading {filename}...")
    with open(filename, "rb") as f:
        files = {'file': (filename, f, 'application/pdf')}
        upload_resp = requests.post(
            f"{API_BASE}/api/studies/{study_id}/documents", 
            files=files,
            params={"source": "Test Script"}
        )
    
    if upload_resp.status_code == 200:
        data = upload_resp.json()
        print("Upload successful!")
        print(f"Response: {data}")
        file_url = data['file_url']
        
        # 4. Verify URL is reachable
        print(f"Verifying URL access: {file_url}")
        file_resp = requests.get(file_url)
        if file_resp.status_code == 200:
            print("File is accessible via URL!")
        else:
            print(f"Failed to access file via URL: {file_resp.status_code}")
            
    else:
        print(f"Upload failed: {upload_resp.status_code}")
        print(upload_resp.text)

    # Cleanup
    if os.path.exists(filename):
        os.remove(filename)

if __name__ == "__main__":
    try:
        test_upload()
    except Exception as e:
        print(f"Test failed: {e}")
