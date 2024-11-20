import jsonlines
from __init__ import create_app  # Import your Flask app factory function
from src.models import db, Playas, DetallesPlayas

def insert_playas():
    # Leer archivo JSONL e insertar en la base de datos
    with jsonlines.open('C:/Users/Pedro/Desktop/TFG/server/beaches_updated.jsonl') as reader:
        for obj in reader:
            # Crear instancia de Playas
            new_playa = Playas(
                nombre=obj['title'],
                isla=obj['island'],
                imagen=obj['image'],
            )
            db.session.add(new_playa)
            db.session.commit()  # Confirmar para obtener el ID

            # Insertar los detalles asociados
            for detail in obj['details']:
                new_detail = DetallesPlayas(
                    playa_id=new_playa.id,
                    titulo=detail['title'],
                    descripcion=detail['description']
                )
                db.session.add(new_detail)
            
            # Confirmar los detalles
            db.session.commit()

    print("Datos insertados correctamente.")

if __name__ == '__main__':
    app = create_app()  # Create an instance of your Flask app
    with app.app_context():  # Push the application context
        insert_playas()