import requests

try:
    print("Testing /api/agents...")
    response = requests.get("http://127.0.0.1:8000/api/agents", timeout=5)
    print(f"Status: {response.status_code}")
    print(f"Content: {response.text[:200]}...")
except Exception as e:
    print(f"Error: {e}")

try:
    print("Testing /")
    response = requests.get("http://127.0.0.1:8000/", timeout=5)
    print(f"Status: {response.status_code}")
    print(f"Content: {response.text}")
except Exception as e:
    print(f"Error: {e}")
