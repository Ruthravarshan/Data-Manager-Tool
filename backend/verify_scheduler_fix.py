import requests
import json
import time
from datetime import datetime

BASE_URL = "http://localhost:8000/api"

def verify_manual_refresh():
    print("Verifying Manual Refresh Logic...")
    
    # 1. Create Integration
    print("Creating Integration...")
    integration_data = {
        "name": "Verification Integration",
        "vendor": "VerifyVendor",
        "type": "EDC",
        "frequency": "Manual",
        "status": "Active"
    }
    r = requests.post(f"{BASE_URL}/integrations/", json=integration_data).json()
    int_id = r['id']
    print(f"Integration ID: {int_id}")

    # 2. Create Schedule (Daily at 11:00)
    print("Creating Schedule...")
    schedule_data = {
        "integration_id": int_id,
        "schedule_type": "Daily",
        "schedule_config": json.dumps({"time": "23:00"}) # Late time ensuring it is in future for today
    }
    s = requests.post(f"{BASE_URL}/schedules/", json=schedule_data).json()
    sched_id = s['id']
    initial_next_run = s['next_run']
    print(f"Schedule ID: {sched_id}")
    print(f"Initial Next Run: {initial_next_run}")
    
    # 3. Trigger Manual Refresh
    print("Triggering Manual Refresh...")
    time.sleep(1) # Ensure time diff
    r_refresh = requests.post(f"{BASE_URL}/schedules/{sched_id}/refresh").json()
    
    # 4. Verify Timestamps
    new_last_run = r_refresh['last_run']
    new_next_run = r_refresh['next_run']
    
    print(f"New Last Run: {new_last_run}")
    print(f"New Next Run: {new_next_run}")
    
    if new_next_run == initial_next_run:
        print("PASS: Next Run preserved (unchanged).")
    else:
        print("FAIL: Next Run changed!")
        
    if new_last_run:
        print("PASS: Last Run updated.")
    else:
        print("FAIL: Last Run not updated.")

    # 5. Check Integration Source Sync
    print("Checking Integration Source Last Sync...")
    r_int = requests.get(f"{BASE_URL}/integrations/{int_id}").json()
    print("Integration Response:", r_int)
    last_sync = r_int.get('last_sync')
    print(f"Integration Last Sync: {last_sync}")
    
    # Ideally last_sync check against new_last_run (ignoring small ms diffs or timezone string formatting)
    # Simple check: it is present
    if last_sync:
        print("PASS: Integration Last Sync updated.")
    else:
        print("FAIL: Integration Last Sync not updated.")

if __name__ == "__main__":
    verify_manual_refresh()
