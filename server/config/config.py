import os
from dotenv import load_dotenv  # se instala con `pip install python-dotenv`

load_dotenv()

class Config:
    ENV = 'development'
    SQLALCHEMY_DATABASE_URI = (
        'mysql+pymysql://root:928630635@127.0.0.1/planner'
    )
    SQLALCHEMY_TRACK_MODIFICATIONS = False
    DEBUG = True  # Ensure debug mode is always on

class ProductionConfig(Config):
    pass  # Inherits DEBUG = True from Config

class DevelopmentConfig(Config):
    pass  # Inherits DEBUG = True from Config

class TestingConfig(Config):
    TESTING = True
    DEBUG = True  # Ensure debug mode is on for testing as well