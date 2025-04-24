import requests
import random
from datetime import datetime, timedelta

# API Configuration
API_URL = 'http://45.64.100.26:88/API-Lumen/public/inbound-stuffs'
ACCESS_TOKEN = 'eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJpc3MiOiJodHRwOi8vNDUuNjQuMTAwLjI2Ojg4L0FQSS1MdW1lbi9wdWJsaWMvbG9naW4iLCJpYXQiOjE3NDU0NjI3MDMsImV4cCI6MTc0NTQ2NjMwMywibmJmIjoxNzQ1NDYyNzAzLCJqdGkiOiI2eHdZR0tUY0U4UXZwZzBLIiwic3ViIjoiOWU2MzljMjctZTIxMS00ZGVjLWJjNmUtMWEzZDAzMjA0NzczIiwicHJ2IjoiMjNiZDVjODk0OWY2MDBhZGIzOWU3MDFjNDAwODcyZGI3YTU5NzZmNyJ9.GXBS6hHoPowkujVojwCodmlCV0mfT-QsrAoQmfwK5GI'  # Replace with your actual token

# Get list of stuffs first
STUFFS_URL = 'http://45.64.100.26:88/API-Lumen/public/stuffs'

headers = {
    'Authorization': f'Bearer {ACCESS_TOKEN}',
    'Content-Type': 'application/json'
}

# Get existing stuffs
try:
    response = requests.get(STUFFS_URL, headers=headers)
    stuffs = response.json()['data']
    print(f"✅ Found {len(stuffs)} stuffs")
except Exception as e:
    print("❌ Failed to fetch stuffs:", str(e))
    exit(1)

# Generate random dates within last 30 days
def random_date():
    end = datetime.now()
    start = end - timedelta(days=30)
    delta = end - start
    random_days = random.randrange(delta.days)
    return start + timedelta(days=random_days)

# Generate inbound data
bulk_data = []
for _ in range(100):  # Generate 100 inbound records
    stuff = random.choice(stuffs)
    
    inbound_data = {
        'stuff_id': stuff['id'],
        'total': random.randint(1, 20),
        'created_at': random_date().strftime('%Y-%m-%d %H:%M:%S')
    }
    bulk_data.append(inbound_data)

# Send inbound data
success_count = 0
fail_count = 0

for data in bulk_data:
    try:
        # Create form-data
        files = {
            'proof_file': ('dummy.png', open('dummy.png', 'rb'), 'image/png')
        } if random.random() > 0.3 else None  # 70% chance to have proof file
        
        form_data = {
            'stuff_id': (None, str(data['stuff_id'])),
            'total': (None, str(data['total'])),
        }

        response = requests.post(
            API_URL,
            headers={'Authorization': f'Bearer {ACCESS_TOKEN}'},
            data=form_data,
            files=files
        )

        if response.status_code in [200, 201]:
            success_count += 1
            print(f"✅ Added inbound for {stuff['name']}: {data['total']} items")
        else:
            fail_count += 1
            print(f"❌ Failed to add inbound for {stuff['name']}: {response.text}")
            
    except Exception as e:
        fail_count += 1
        print(f"❌ Error adding inbound for {stuff['name']}: {str(e)}")

print(f"\nSummary:")
print(f"✅ Successfully added: {success_count}")
print(f"❌ Failed: {fail_count}")