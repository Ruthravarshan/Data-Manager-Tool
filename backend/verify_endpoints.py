import requests
import sys

BASE_URL = "http://localhost:8000/api"

def test_api():
    # 1. Get Studies
    print("Fetching studies...")
    res = requests.get(f"{BASE_URL}/studies/")
    if res.status_code != 200:
        print(f"Failed to fetch studies: {res.text}")
        sys.exit(1)
    
    studies = res.json()
    if not studies:
        print("No studies found. Creating a test study...")
        # Create a test study if none exist
        res = requests.post(f"{BASE_URL}/studies/", json={
            "title": "Test Study",
            "protocol_id": "TEST-001",
            "phase": "Phase 1",
            "status": "Planned"
        })
        if res.status_code != 200:
            print(f"Failed to create study: {res.text}")
            sys.exit(1)
        study = res.json()
    else:
        study = studies[0]
    
    study_id = study["id"]
    print(f"Using Study ID: {study_id}")

    # 2. Test Sites
    print("\nTesting Sites...")
    site_payload = {
        "site_id": "SITE-TEST-001",
        "name": "Test Site",
        "location": "Test Location",
        "status": "Active",
        "enrollment": "0/10",
        "pi_name": "Dr. Test"
    }
    res = requests.post(f"{BASE_URL}/studies/{study_id}/sites", json=site_payload)
    if res.status_code != 200:
        print(f"Failed to create site: {res.text}")
    else:
        print("Site created.")
        
    res = requests.get(f"{BASE_URL}/studies/{study_id}/sites")
    sites = res.json()
    print(f"Sites count: {len(sites)}")
    if not any(s["site_id"] == "SITE-TEST-001" for s in sites):
        print("Error: Created site not found in list")

    # 3. Test Contacts
    print("\nTesting Contacts...")
    contact_payload = {
        "name": "Test Contact",
        "role": "Monitor",
        "organization": "CRO",
        "email": "test@example.com",
        "phone": "123-456-7890",
        "availability": "50"
    }
    res = requests.post(f"{BASE_URL}/studies/{study_id}/contacts", json=contact_payload)
    if res.status_code != 200:
        print(f"Failed to create contact: {res.text}")
    else:
        print("Contact created.")

    res = requests.get(f"{BASE_URL}/studies/{study_id}/contacts")
    contacts = res.json()
    print(f"Contacts count: {len(contacts)}")

    # 4. Test Vendors
    print("\nTesting Vendors...")
    vendor_payload = {
        "name": "Test Vendor",
        "type": "Lab",
        "trial_role": "Central Lab",
        "contact_person": "Vendor Contact",
        "contact_email": "vendor@example.com",
        "status": "Active",
        "start_date": "2023-01-01",
        "end_date": "2024-01-01"
    }
    res = requests.post(f"{BASE_URL}/studies/{study_id}/vendors", json=vendor_payload)
    if res.status_code != 200:
        print(f"Failed to create vendor: {res.text}")
    else:
        print("Vendor created.")

    res = requests.get(f"{BASE_URL}/studies/{study_id}/vendors")
    vendors = res.json()
    print(f"Vendors count: {len(vendors)}")

    print("\nVerification Complete.")

if __name__ == "__main__":
    test_api()
