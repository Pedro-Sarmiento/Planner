from flask import Flask
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

    load_dotenv()
    ENV = os.getenv('FLASK_ENV')

    if ENV == 'production':
        app.config.from_object(ProductionConfig)
    elif ENV == 'testing':
        app.config.from_object(TestingConfig)
    else:
        app.config.from_object(DevelopmentConfig)

    app.secret_key = os.environ.get('FLASK_SECRET_KEY', 'defaultsecretkey')

    app.config['SESSION_REDIS'] = redis.StrictRedis(host='127.0.0.1', port=6379)  
    app.config['SESSION_TYPE'] = 'redis' 
    app.config['SESSION_PERMANENT'] = True
    app.config['SESSION_USE_SIGNER'] = True
    app.config['SESSION_COOKIE_SECURE'] = True
    app.config['SESSION_COOKIE_HTTPONLY'] = True
    app.config['SESSION_COOKIE_SAMESITE'] = 'None'

    Session(app)

    db.init_app(app)

    return app


