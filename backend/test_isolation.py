import requests
import json
import time
from datetime import datetime

BASE_URL = "http://localhost:8000/api"

def test_isolation_and_stability():
    print("--- Starting Isolation and Stability Test ---")
    
    # 1. Create Schedule A (Daily 10:00)
    print("Creating Schedule A (Daily 10:00)...")
    integ_id = 11 # Assuming existing
    data_a = {
        "integration_id": integ_id,
        "schedule_type": "Daily",
        "schedule_config": json.dumps({"time": "10:00"})
    }
    r_a = requests.post(f"{BASE_URL}/schedules/", json=data_a)
    if r_a.status_code != 200:
        # Try creating integration if failing
        print("Integration probably missing, using first available or creating new integration...")
        # ... (simplified for brevity, assuming integ 11 or similar exists from previous runs)
        # Actually let's fetch one
        integrations = requests.get(f"{BASE_URL}/integrations/").json()
        if not integrations:
             # Create one
             requests.post(f"{BASE_URL}/integrations/", json={"name":"Test","folder_path":"C:/tmp"})
             integrations = requests.get(f"{BASE_URL}/integrations/").json()
        
        integ_id = integrations[0]['id']
        data_a['integration_id'] = integ_id
        r_a = requests.post(f"{BASE_URL}/schedules/", json=data_a)
        
    sched_a = r_a.json()
    print(f"Schedule A Created: ID {sched_a['id']}, Next Run: {sched_a['next_run']}")

    # 2. Create Schedule B (Daily 12:00)
    print("Creating Schedule B (Daily 12:00)...")
    data_b = {
        "integration_id": integ_id,
        "schedule_type": "Daily",
        "schedule_config": json.dumps({"time": "12:00"})
    }
    r_b = requests.post(f"{BASE_URL}/schedules/", json=data_b)
    sched_b = r_b.json()
    print(f"Schedule B Created: ID {sched_b['id']}, Next Run: {sched_b['next_run']}")

    # 3. Refresh Schedule A
    print(f"Refreshing Schedule A (ID {sched_a['id']})...")
    time.sleep(1) # Ensure time diff
    r_ref = requests.post(f"{BASE_URL}/schedules/{sched_a['id']}/refresh")
    sched_a_ref = r_ref.json()
    print(f"Schedule A Refreshed. Last Run: {sched_a_ref['last_run']}")

    # 4. Check Schedule B
    print(f"Checking Schedule B (ID {sched_b['id']})...")
    r_check = requests.get(f"{BASE_URL}/schedules/")
    all_schedules = r_check.json()
    
    actual_b = next(s for s in all_schedules if s['id'] == sched_b['id'])
    print(f"Schedule B Last Run: {actual_b['last_run']}")
    
    if actual_b['last_run'] is None:
        print("SUCCESS: Schedule B was NOT affected.")
    else:
        print("FAILURE: Schedule B WAS affected (Last Run changed)!")

    # 5. Check Next Run Stability for A
    # logic assumes Daily 10:00. Backend creates today 10:00 (UTC implied). 
    # If now > 10:00, next is tomorrow.
    # The 'time' part should be 10:00:00 exactly.
    next_run_str = sched_a_ref['next_run']
    print(f"Schedule A Next Run after refresh: {next_run_str}")
    if "10:00:00" in next_run_str:
         print("SUCCESS: Schedule A Next Run maintained 10:00 time.")
    else:
         print("FAILURE: Schedule A Next Run drifted from 10:00!")

    # Cleanup
    requests.delete(f"{BASE_URL}/schedules/{sched_a['id']}")
    requests.delete(f"{BASE_URL}/schedules/{sched_b['id']}")

if __name__ == "__main__":
    test_isolation_and_stability()
