import requests

try:
    print("Testing API: http://127.0.0.1:8000/api/studies/")
    response = requests.get("http://127.0.0.1:8000/api/studies/")
    print(f"Status Code: {response.status_code}")
    print(f"Response: {response.text}")
except Exception as e:
    print(f"Error: {e}")
