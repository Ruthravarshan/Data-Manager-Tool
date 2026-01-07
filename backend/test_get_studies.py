import http.client
import json

def test_get():
    conn = http.client.HTTPConnection("127.0.0.1", 8000)
    conn.request("GET", "/api/studies/")
    res = conn.getresponse()
    data = res.read()
    print(f"Status: {res.status}")
    studies = json.loads(data.decode())
    print(f"Count: {len(studies)}")
    if studies:
        print("First study:", json.dumps(studies[0], indent=2))

if __name__ == "__main__":
    test_get()
