import json
import urllib.request
import urllib.parse
import os
import sys

# Forzar salida en utf-8 para que no falle el print en Windows
sys.stdout.reconfigure(encoding='utf-8')

API_KEY = "AIzaSyDshynl3ep5lD6GJ4Xhgy_cgxp7YZN3Eqg"

input_file = 'stores.json'
output_file = 'distribuidores-app/src/data/stores_geocoded.json'

with open(input_file, 'r', encoding='utf-8') as f:
    stores = json.load(f)

print(f"Geocodificando {len(stores)} tiendas...")

for store in stores:
    address = store.get('address', '')
    city = store.get('city', '')
    query = f"{address}, {city}, Colombia"
    
    url = f"https://maps.googleapis.com/maps/api/geocode/json?address={urllib.parse.quote(query)}&key={API_KEY}"
    
    try:
        req = urllib.request.Request(url)
        with urllib.request.urlopen(req) as response:
            data = json.loads(response.read().decode('utf-8'))
            if data['status'] == 'OK':
                location = data['results'][0]['geometry']['location']
                store['lat'] = location['lat']
                store['lng'] = location['lng']
                print(f"OK: {query} -> ({store['lat']}, {store['lng']})")
            else:
                print(f"FAIL ({data['status']}): {query}")
                store['lat'] = None
                store['lng'] = None
    except Exception as e:
        print(f"Error procesando {query}: {e}")
        store['lat'] = None
        store['lng'] = None

os.makedirs(os.path.dirname(output_file), exist_ok=True)
with open(output_file, 'w', encoding='utf-8') as f:
    json.dump(stores, f, indent=4, ensure_ascii=False)

print(f"\nProceso terminado. Datos guardados en {output_file}")
