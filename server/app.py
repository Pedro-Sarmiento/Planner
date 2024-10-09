from src import create_app
from src.routes import api as api_blueprint
from config.config import Config
from src.models import db

app = create_app()

# Registrar el blueprint
app.register_blueprint(api_blueprint)

# Crear las tablas en la base de datos
with app.app_context():
    db.create_all()

# Ejecutar la aplicación
if __name__ == "__main__":
    app.run() 
