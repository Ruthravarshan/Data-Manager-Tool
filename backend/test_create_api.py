import requests
import json
from datetime import date

API_URL = "http://localhost:8000/api/studies/"

def test_create_study():
    payload = {
        "title": "API Test Study",
        "protocol_id": "API-TEST-001",
        "phase": "Phase I",
        "status": "Planned",
        "description": "Created via API test script",
        "start_date": str(date.today()),
        "sites_count": 5,
        "subjects_count": 50,
        "completion_percentage": 0,
        "therapeutic_area": "Neurology",
        "indication": "Migraine"
    }
    
    try:
        print(f"Sending POST request to {API_URL}...")
        response = requests.post(API_URL, json=payload)
        
        if response.status_code == 200:
            print("Success! Study created.")
            print(json.dumps(response.json(), indent=2))
        else:
            print(f"Failed with status {response.status_code}")
            print(response.text)
            
    except Exception as e:
        print(f"Error calling API: {e}")

if __name__ == "__main__":
    test_create_study()
