import requests

url = "http://127.0.0.1:8005/api/horoscope/generate"
payload = {
    "name": "Gitika Sharma",
    "dob": "1995-12-05",
    "tob": "08:30",
    "pob": "New Delhi",
    "is_calculator": True
}

try:
    response = requests.post(url, json=payload)
    print("Status Code:", response.status_code)
    if response.status_code == 200:
        data = response.json()
        print("Response Keys:", list(data.keys()))
        print("Astrology Details:")
        for k, v in data["astrology_details"].items():
            print(f"  {k}: {v}")
        print("Life Report Preview:")
        for k, v in data["life_report"].items():
            print(f"  {k}: {str(v)[:100]}...")
    else:
        print("Error:", response.text)
except Exception as e:
    print("Failed to request:", e)
