from flask import Flask
from config.config import Config, ProductionConfig, DevelopmentConfig, TestingConfig
from config.logger import conf_logging # si hiciste el punto 3.2
import os
from src.models import db
from flask_cors import CORS

conf_logging() # si hiciste el punto 3.2

def create_app(config_class=Config):
    app = Flask(__name__)
    CORS(app) 

    
    app.config.from_object(Config)
    db.init_app(app)

    if Config.FLASK_ENV == 'development':
        app.config.from_object(DevelopmentConfig)

    elif Config.FLASK_ENV == 'production':
        app.config.from_object(ProductionConfig)

    else:
        app.config.from_object(TestingConfig) # it'd be testing


    return app




