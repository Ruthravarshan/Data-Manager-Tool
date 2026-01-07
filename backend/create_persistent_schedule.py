import requests
import json
import os

# Ensure we have the base URL
BASE_URL = "http://localhost:8000/api"

def create_sample_schedule():
    print("Creating a persistent sample schedule...")
    
    # 1. Get an existing integration or create one
    r = requests.get(f"{BASE_URL}/integrations/")
    integrations = r.json()
    
    if not integrations:
        print("No integrations found. Creating a dummy one...")
        integration_data = {
            "name": "Demo Integration",
            "vendor": "Demo Vendor",
            "type": "EDC",
            "frequency": "Manual",
            "status": "Active",
            "folder_path": "C:/Demo/Data"
        }
        r = requests.post(f"{BASE_URL}/integrations/", json=integration_data)
        if r.status_code != 200:
            print(f"Failed to create integration: {r.text}")
            return
        integration = r.json()
    else:
        integration = integrations[0]
        
    print(f"Linking schedule to Integration: {integration['name']} (ID: {integration['id']})")

    # 2. Create the schedule
    schedule_data = {
        "integration_id": integration['id'],
        "schedule_type": "Daily",
        "schedule_config": json.dumps({"time": "08:00"})
    }
    
    r = requests.post(f"{BASE_URL}/schedules/", json=schedule_data)
    if r.status_code == 200:
        schedule = r.json()
        print(f"SUCCESS! Schedule created with ID: {schedule['id']}")
        print(f"Table: integration_schedules")
        print(f"Columns: id, integration_id, schedule_type, next_run, status")
        print("-" * 30)
        print("You can now check pgAdmin.")
    else:
        print(f"Failed to create schedule: {r.text}")

if __name__ == "__main__":
    create_sample_schedule()
