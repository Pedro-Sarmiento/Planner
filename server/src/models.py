from flask_sqlalchemy import SQLAlchemy

db = SQLAlchemy()

class User(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    username = db.Column(db.String(64), unique=True, nullable=False)
    full_name = db.Column(db.String(120), nullable=False)
    email = db.Column(db.String(120), unique=True, nullable=False)
    password = db.Column(db.String(255), nullable=False)
    profile = db.relationship('Profile', backref='user', uselist=False)

    def __repr__(self):
        return f'<User {self.username}>'

class Profile(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey('user.id'), nullable=False)
    profile_photo = db.Column(db.String(200))
    followers = db.Column(db.Integer, default=0)
    following = db.Column(db.Integer, default=0)
    posts = db.Column(db.Integer, default=0)
    plans = db.Column(db.Integer, default=0)

    def __repr__(self):
        return f'<Profile {self.user_id}>'
    
class Task(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey('user.id'), nullable=False)  # Relación con la tabla User
    title = db.Column(db.String(255), nullable=False)  # Nombre de la tarea
    description = db.Column(db.Text, nullable=True)  # Descripción detallada de la tarea
    priority = db.Column(db.String(50), nullable=True)  # Prioridad de la tarea (baja, media, alta)
    category = db.Column(db.String(100), nullable=True)  # Categoría de la tarea (trabajo, personal, etc.)
    start = db.Column(db.DateTime, nullable=False)  # Fecha y hora de inicio de la tarea
    end = db.Column(db.DateTime, nullable=False)  # Fecha y hora de fin de la tarea
    allDay = db.Column(db.Boolean, default=False)  # Indica si la tarea es de todo el día o no
    completed = db.Column(db.Boolean, default=False)  # Estado de la tarea (completada o no)

    def to_dict(self):
        return {
            'id': self.id,
            'title': self.title,
            'description': self.description,  # Incluimos la descripción en la representación dict
            'priority': self.priority,  # Incluimos la prioridad en la representación dict
            'category': self.category,  # Incluimos la categoría en la representación dict
            'start': self.start.isoformat(),  # Fecha y hora en formato ISO
            'end': self.end.isoformat(),  # Fecha y hora en formato ISO
            'allDay': self.allDay,  # Incluimos el campo all_day en la representación dict
            'completed': self.completed
        }

