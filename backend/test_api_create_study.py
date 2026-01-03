import requests
import json
import uuid
from datetime import date

def test_api_create():
    url = "http://localhost:8000/api/studies/"
    payload = {
        "title": "API Test Study",
        "protocol_id": "API-PRO-" + uuid.uuid4().hex[:4],
        "phase": "Phase I",
        "status": "Planned",
        "start_date": str(date.today()),
        "end_date": None,
        "therapeutic_area": "Neurology",
        "indication": "Alzheimer's",
        "description": "Test via API",
        "sites_count": 5,
        "subjects_count": 100,
        "completion_percentage": 10
    }
    
    print(f"Sending POST to {url}...")
    try:
        response = requests.post(url, json=payload)
        print(f"Status Code: {response.status_code}")
        print("Response Content:")
        print(json.dumps(response.json(), indent=2))
    except Exception as e:
        print(f"Request failed: {e}")

if __name__ == "__main__":
    test_api_create()
