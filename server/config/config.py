import os
from dotenv import load_dotenv # se instala con `pip install python-dotenv`

load_dotenv() 

class Config:
    FLASK_ENV = os.getenv('FLASK_ENV')
    OPENAI_API_KEY = os.getenv('OPENAI_API_KEY')
    
    SQLALCHEMY_DATABASE_URI = (
        'mysql+pymysql://root:928630635@127.0.0.1/planner'
    )
    SQLALCHEMY_TRACK_MODIFICATIONS = False
    
class ProductionConfig(Config):
    DEBUG = False

class DevelopmentConfig(Config):
    DEBUG = True

class TestingConfig(Config):
    TESTING = True
    

