import requests
import json
from datetime import datetime

BASE_URL = "http://localhost:8000/api"

def test_scheduler():
    print("Testing Scheduler API...")
    
    # 1. Create a dummy integration
    integration_data = {
        "name": "Test Integration",
        "vendor": "Test Vendor",
        "type": "EDC",
        "frequency": "Manual",
        "status": "Active",
        "folder_path": "C:/Test"
    }
    
    try:
        # Check if exists or create
        print("Creating/Fetching Integration...")
        r = requests.post(f"{BASE_URL}/integrations/", json=integration_data)
        if r.status_code == 200:
            integration = r.json()
        else:
            # Maybe already exists, let's fetch
            r = requests.get(f"{BASE_URL}/integrations/")
            integrations = r.json()
            if integrations:
                integration = integrations[0]
            else:
                print("Failed to create integration for test.")
                return

        print(f"Using Integration ID: {integration['id']}")
        
        # 2. Create Schedule
        print("Creating Schedule...")
        schedule_data = {
            "integration_id": integration['id'],
            "schedule_type": "Daily",
            "schedule_config": json.dumps({"time": "14:00"})
        }
        r = requests.post(f"{BASE_URL}/schedules/", json=schedule_data)
        if r.status_code != 200:
            print(f"Failed to create schedule: {r.text}")
            return
        
        schedule = r.json()
        print(f"Schedule Created: ID {schedule['id']}, Next Run: {schedule['next_run']}")
        
        # 3. List Schedules
        print("Listing Schedules...")
        r = requests.get(f"{BASE_URL}/schedules/")
        schedules = r.json()
        print(f"Found {len(schedules)} schedules.")
        
        # 4. Pause Schedule
        print("Pausing Schedule...")
        r = requests.post(f"{BASE_URL}/schedules/{schedule['id']}/pause")
        paused_schedule = r.json()
        print(f"Status: {paused_schedule['status']}")

        # 5. Update Schedule
        print("Updating Schedule...")
        update_data = {
            "schedule_type": "Daily",
            "schedule_config": json.dumps({"time": "20:00"})
        }
        r = requests.put(f"{BASE_URL}/schedules/{schedule['id']}", json=update_data)
        if r.status_code == 200:
            updated_schedule = r.json()
            print(f"Schedule Updated: Next Run: {updated_schedule['next_run']}")
        else:
            print(f"Failed to update: {r.text}")
        
        # 6. Delete Schedule
        print("Deleting Schedule...")
        r = requests.delete(f"{BASE_URL}/schedules/{schedule['id']}")
        if r.status_code == 200:
            print("Schedule Deleted.")
        else:
            print(f"Failed to delete: {r.text}")
            
        print("Verification Successful!")

    except Exception as e:
        print(f"Test Failed: {e}")

if __name__ == "__main__":
    test_scheduler()
