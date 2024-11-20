import json
from pymongo import MongoClient

# Configuración de la conexión a MongoDB
client = MongoClient('mongodb+srv://admin:admin@cluster0.l9om0fc.mongodb.net/')  # Cambia esto si usas MongoDB Atlas
db = client['planner']  # Nombre de la base de datos
collection = db['plans']  # Nombre de la colección

# Cargar los datos desde el archivo JSON
with open('C:/Users/Pedro/Desktop/TFG/server/RAG/input/actividades.json', 'r', encoding='utf-8') as file:
    actividades = json.load(file)

# Insertar los datos en MongoDB
result = collection.insert_many(actividades)

# Confirmación
print(f"Se insertaron {len(result.inserted_ids)} actividades en la base de datos.")
