from flask import Flask, session
from flask_session import Session
from config.config import Config, ProductionConfig, DevelopmentConfig, TestingConfig
from config.logger import conf_logging 
import os
from src.models import db
from flask_cors import CORS
import redis
from dotenv import load_dotenv

conf_logging()

def create_app():
    app = Flask(__name__)
    CORS(app, supports_credentials=True, origins=["http://localhost:3000"])

    # Cargar configuración según el entorno
    load_dotenv()
    ENV = os.getenv('FLASK_ENV')

    if ENV == 'production':
        app.config.from_object(ProductionConfig)
    elif ENV == 'testing':
        app.config.from_object(TestingConfig)
    else:
        app.config.from_object(DevelopmentConfig)

    app.secret_key = os.environ.get('FLASK_SECRET_KEY', 'defaultsecretkey')
    # Configuración de Flask-Session para manejar sesiones en el servidor

    app.config['SESSION_REDIS'] = redis.StrictRedis(host='127.0.0.1', port=6379)  # Cambia según la configuración de tu Redis
    app.config['SESSION_TYPE'] = 'redis' # Puedes usar Redis, Memcached, etc.
    app.config['SESSION_PERMANENT'] = True  # Evitar que las sesiones duren indefinidamente
    app.config['SESSION_USE_SIGNER'] = True
    app.config['SESSION_COOKIE_SECURE'] = True  # Debe ser True si usas HTTPS
    app.config['SESSION_COOKIE_HTTPONLY'] = True  # Para proteger las cookies
    app.config['SESSION_COOKIE_SAMESITE'] = 'None'  # Cambia según sea necesario

    Session(app)

    # Inicializar la base de datos
    db.init_app(app)

    return app


