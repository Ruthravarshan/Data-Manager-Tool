import http.client
import json

def test_api():
    conn = http.client.HTTPConnection("localhost", 8000)
    payload = {
        "title": "HTTP Client Test",
        "protocol_id": "HC-PRO-1",
        "phase": "Phase I",
        "status": "Planned",
        "start_date": "2024-01-01",
        "sites_count": 0,
        "subjects_count": 0,
        "completion_percentage": 0
    }
    headers = {'Content-Type': 'application/json'}
    conn.request("POST", "/api/studies/", json.dumps(payload), headers)
    res = conn.getresponse()
    data = res.read()
    print(f"Status: {res.status}")
    print(f"Data: {data.decode()}")

if __name__ == "__main__":
    test_api()
