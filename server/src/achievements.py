from src import create_app  # Import your Flask app factory function
from src.models import db, Achievements

def insert_achievements():
    with app.app_context():
        save_plan_achievements = [
            {
                "title": "Guarda 5 planes",
                "description": "Has guardado 5 planes.",
                "category": "save_plan",
                "medal": "bronce",
                "points": 10,
                "image": "path/to/bronce_image.png",
                "target": 5
            },
            {
                "title": "Guarda 10 planes",
                "description": "Has guardado 10 planes.",
                "category": "save_plan",
                "medal": "plata",
                "points": 25,
                "image": "path/to/plata_image.png",
                "target": 10
            },
            {
                "title": "Guarda 25 planes",
                "description": "Has guardado 25 planes.",
                "category": "save_plan",
                "medal": "oro",
                "points": 50,
                "image": "path/to/oro_image.png",
                "target": 25
            },
            {
                "title": "Inicia sesión 1 día",
                "description": "Has iniciado sesión por primera vez.",
                "category": "login",
                "medal": "bronce",
                "points": 5,
                "image": "path/to/bronce_image.png",
                "target": 1
            },
            {
                "title": "Inicia sesión 10 días",
                "description": "Has iniciado sesión durante 10 días.",
                "category": "login",
                "medal": "plata",
                "points": 15,
                "image": "path/to/plata_image.png",
                "target": 10
            },
            {
                "title": "Inicia sesión 25 días",
                "description": "Has iniciado sesión durante 25 días.",
                "category": "login",
                "medal": "oro",
                "points": 30,
                "image": "path/to/oro_image.png",
                "target": 25
            }
        ]

        for achievement in save_plan_achievements:
            new_achievement = Achievements(
                title=achievement["title"],
                description=achievement["description"],
                category=achievement["category"],
                medal=achievement["medal"],
                points=achievement["points"],
                image=achievement["image"],
                target=achievement["target"]
            )
            db.session.add(new_achievement)

        db.session.commit()
        print("Logros añadidos correctamente.")

if __name__ == "__main__":
    app = create_app()  # Create an instance of your Flask app
    with app.app_context():  # Push the application context
        insert_achievements()