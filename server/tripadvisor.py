import requests

# Configuración de parámetros
api_key = 'AIzaSyAZ6NmKoFWDqS6AxS7uIEGpxGvXkgL2k6E'
location = '27.9202,-15.5476'  # Coordenadas de Gran Canaria
radius = 5000  # En metros
type_place = 'restaurant'

# URL de solicitud
url = f"https://maps.googleapis.com/maps/api/place/nearbysearch/json?location={location}&radius={radius}&type={type_place}&key={api_key}"

# Realizar la solicitud
response = requests.get(url)
places = response.json()

# Extraer y mostrar los nombres de los restaurantes
for place in places['results']:
    name = place['name']
    print(name)
