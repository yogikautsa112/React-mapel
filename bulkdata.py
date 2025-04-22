import requests
import random

# Ganti sama URL API lo
API_URL = 'http://45.64.100.26:88/API-Lumen/public/stuffs'

# Token dari localStorage lo
ACCESS_TOKEN = 'eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJpc3MiOiJodHRwOi8vNDUuNjQuMTAwLjI2Ojg4L0FQSS1MdW1lbi9wdWJsaWMvbG9naW4iLCJpYXQiOjE3NDUyODUwNTcsImV4cCI6MTc0NTI4ODY1NywibmJmIjoxNzQ1Mjg1MDU3LCJqdGkiOiJxUDdYcDNHQ0JKUEdCNWNQIiwic3ViIjoiOWU2MzljMjctZTIxMS00ZGVjLWJjNmUtMWEzZDAzMjA0NzczIiwicHJ2IjoiMjNiZDVjODk0OWY2MDBhZGIzOWU3MDFjNDAwODcyZGI3YTU5NzZmNyJ9.VMcLjw-y272UUr_UistFm96333Cig_Hzk5EGCU1tH6o'

# Data items and types
items = {
    'Lab': [
        'Keyboard', 'Mouse', 'Monitor', 'Proyektor', 'Speaker', 'Mikroskop', 
        'Laptop', 'Printer', 'Scanner', 'Headset', 'Webcam', 'Router',
        'Switch', 'Server', 'UPS', 'Kabel LAN', 'Access Point', 'Komputer',
        'Charger', 'Adaptor', 'Stabilizer', 'DVD Drive', 'Hard Disk', 'SSD'
    ],
    'Sarpras': [
        'Meja', 'Kursi', 'Lemari', 'Papan Tulis', 'Spidol', 'Penghapus',
        'AC', 'Kipas Angin', 'Lampu', 'Stop Kontak', 'Sapu', 'Pel',
        'Tempat Sampah', 'Rak', 'Loker', 'Cermin', 'Jam Dinding', 'Dispenser',
        'CCTV', 'Kunci', 'Gorden', 'Pintu', 'Jendela', 'Ventilasi'
    ],
    'HTL/KLN': [
        'Handuk', 'Sprei', 'Bantal', 'Guling', 'Selimut', 'Kasur',
        'Sabun', 'Shampo', 'Sikat Gigi', 'Pasta Gigi', 'Tissue', 'Sandal',
        'Hanger', 'Ember', 'Gayung', 'Sapu', 'Pel', 'Tempat Sampah',
        'Gelas', 'Piring', 'Sendok', 'Garpu', 'Teko', 'Dispenser'
    ]
}

# Generate 100 random items
bulk_data = []
for i in range(25):
    type = random.choice(['Lab', 'Sarpras', 'HTL/KLN'])
    item = random.choice(items[type])
    number = random.randint(1, 5)
    name = f"{item} {number}" if random.random() > 0.5 else item
    
    # Generate random stock numbers
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

# Header buat autentikasi
headers = {
    'Authorization': f'Bearer {ACCESS_TOKEN}',
    'Content-Type': 'application/json'
}

# Loop dan kirim satu per satu
for data in bulk_data:
    response = requests.post(API_URL, json=data, headers=headers)

    if response.status_code == 201 or response.status_code == 200:
        print(f"✅ Berhasil tambah: {data['name']} ({data['type']}) - Available: {data['stuff_stock']['total_available']}, Defect: {data['stuff_stock']['total_defec']}")
    else:
        print(f"❌ Gagal tambah: {data['name']} ({data['type']})")
        print("Respon:", response.text)
