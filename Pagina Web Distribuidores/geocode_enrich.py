import json
import urllib.request
import urllib.parse
import os
import sys
import time

sys.stdout.reconfigure(encoding='utf-8')

API_KEY = "AIzaSyDshynl3ep5lD6GJ4Xhgy_cgxp7YZN3Eqg"

input_file = 'stores.json'
output_file = 'distribuidores-app/src/data/stores_geocoded.json'

with open(input_file, 'r', encoding='utf-8') as f:
    stores = json.load(f)

print(f"Mejorando datos y extrayendo Departamentos de {len(stores)} tiendas...")

for store in stores:
    address = store.get('address', '')
    original_city = store.get('city', '')
    query = f"{address}, {original_city}, Colombia"
    
    url = f"https://maps.googleapis.com/maps/api/geocode/json?address={urllib.parse.quote(query)}&key={API_KEY}"
    
    try:
        req = urllib.request.Request(url)
        with urllib.request.urlopen(req) as response:
            data = json.loads(response.read().decode('utf-8'))
            if data['status'] == 'OK':
                result = data['results'][0]
                location = result['geometry']['location']
                store['lat'] = location['lat']
                store['lng'] = location['lng']
                
                # Extraer Departamento y Municipio
                department = "Desconocido"
                municipality = "Desconocido"
                
                for component in result['address_components']:
                    types = component['types']
                    if 'administrative_area_level_1' in types:
                        department = component['long_name']
                    elif 'locality' in types or 'administrative_area_level_2' in types:
                        # Preferir locality, si no, admin_area_2 (a veces los municipios en Colombia son admin_area_2)
                        if municipality == "Desconocido" or 'locality' in types:
                            municipality = component['long_name']
                
                store['department'] = department
                store['municipality'] = municipality
                
                print(f"OK: {query} -> {municipality}, {department}")
            else:
                print(f"FAIL ({data['status']}): {query}")
                store['lat'] = None
                store['lng'] = None
                store['department'] = "Desconocido"
                store['municipality'] = original_city
    except Exception as e:
        print(f"Error procesando {query}: {e}")
        store['lat'] = None
        store['lng'] = None
        store['department'] = "Desconocido"
        store['municipality'] = original_city

os.makedirs(os.path.dirname(output_file), exist_ok=True)
with open(output_file, 'w', encoding='utf-8') as f:
    json.dump(stores, f, indent=4, ensure_ascii=False)

print(f"\nProceso terminado. Datos guardados en {output_file}")
