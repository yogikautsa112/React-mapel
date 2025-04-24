import requests
import random
import concurrent.futures
import time
from tqdm import tqdm
import json

API_URL = 'http://45.64.100.26:88/API-Lumen/public/stuffs'
ACCESS_TOKEN = 'eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJpc3MiOiJodHRwOi8vNDUuNjQuMTAwLjI2Ojg4L0FQSS1MdW1lbi9wdWJsaWMvbG9naW4iLCJpYXQiOjE3NDU0NjI3MDMsImV4cCI6MTc0NTQ2NjMwMywibmJmIjoxNzQ1NDYyNzAzLCJqdGkiOiI2eHdZR0tUY0U4UXZwZzBLIiwic3ViIjoiOWU2MzljMjctZTIxMS00ZGVjLWJjNmUtMWEzZDAzMjA0NzczIiwicHJ2IjoiMjNiZDVjODk0OWY2MDBhZGIzOWU3MDFjNDAwODcyZGI3YTU5NzZmNyJ9.GXBS6hHoPowkujVojwCodmlCV0mfT-QsrAoQmfwK5GI'

items = {
    'Lab': ['Keyboard', 'Mouse', 'Monitor', 'Proyektor', 'Speaker', 'Mikroskop', 
            'Laptop', 'Printer', 'Scanner', 'Headset', 'Webcam', 'Router',
            'Switch', 'Server', 'UPS', 'Kabel LAN', 'Access Point', 'Komputer',
            'Charger', 'Adaptor', 'Stabilizer', 'DVD Drive', 'Hard Disk', 'SSD'],
    'Sarpras': ['Meja', 'Kursi', 'Lemari', 'Papan Tulis', 'Spidol', 'Penghapus',
                'AC', 'Kipas Angin', 'Lampu', 'Stop Kontak', 'Sapu', 'Pel',
                'Tempat Sampah', 'Rak', 'Loker', 'Cermin', 'Jam Dinding', 'Dispenser',
                'CCTV', 'Kunci', 'Gorden', 'Pintu', 'Jendela', 'Ventilasi'],
    'HTL/KLN': ['Handuk', 'Sprei', 'Bantal', 'Guling', 'Selimut', 'Kasur',
                'Sabun', 'Shampo', 'Sikat Gigi', 'Pasta Gigi', 'Tissue', 'Sandal',
                'Hanger', 'Ember', 'Gayung', 'Sapu', 'Pel', 'Tempat Sampah',
                'Gelas', 'Piring', 'Sendok', 'Garpu', 'Teko', 'Dispenser']
}

headers = {
    'Authorization': f'Bearer {ACCESS_TOKEN}',
    'Content-Type': 'application/json'
}

bulk_data = []
for _ in range(5000):
    type = random.choice(list(items.keys()))
    item = random.choice(items[type])
    number = random.randint(1, 5)
    name = f"{item} {number}" if random.random() > 0.5 else item

    available = random.randint(5, 50)
    defect = random.randint(0, 5)

    bulk_data.append({
        'name': name,
        'type': type,
        'stuff_stock': {
            'total_available': available,
            'total_defec': defect
        }
    })

success_count = 0
fail_count = 0

def send_request(data):
    global success_count, fail_count
    try:
        time.sleep(random.uniform(0.005, 0.02))  # Random delay
        response = requests.post(API_URL, json=data, headers=headers, timeout=1)
        if response.status_code == 200:
            success_count += 1
        else:
            fail_count += 1
        return response.status_code
    except Exception as e:
        fail_count += 1
        return str(e)

with concurrent.futures.ThreadPoolExecutor(max_workers=100) as executor:
    results = list(tqdm(executor.map(send_request, bulk_data), total=len(bulk_data)))

# Summary
print(f"\n✅ Total Success: {success_count}")
print(f"❌ Total Failed: {fail_count}")
