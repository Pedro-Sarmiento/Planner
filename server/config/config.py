import os
from dotenv import load_dotenv

load_dotenv()

class Config:
    ENV = 'development'
    SQLALCHEMY_DATABASE_URI = (
        'mysql+pymysql://root:928630635@127.0.0.1/planner'
    )
    SQLALCHEMY_TRACK_MODIFICATIONS = False
    DEBUG = True  # Ensure debug mode is always on

# Here we should have a class for each environment
class ProductionConfig(Config):
    pass

class DevelopmentConfig(Config):
    pass

class TestingConfig(Config):
    TESTING = True
    DEBUG = True  