from src import create_app
from src.routes import api as api_blueprint
from config.config import Config
from src.models import db

app = create_app()

app.register_blueprint(api_blueprint)
app.debug=True
with app.app_context():
    db.create_all()
if __name__ == "__main__":
    app.run(host='0.0.0.0') 
    