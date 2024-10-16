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
    user_id = db.Column(db.Integer, db.ForeignKey('user.id'), nullable=False)
    title = db.Column(db.String(255), nullable=False)
    description = db.Column(db.Text, nullable=True)
    priority = db.Column(db.String(50), nullable=True)
    category = db.Column(db.String(100), nullable=True)
    start = db.Column(db.DateTime, nullable=False)
    end = db.Column(db.DateTime, nullable=False)
    allDay = db.Column(db.Boolean, default=False)
    reminder = db.Column(db.Integer, nullable=True)  # Reminder in minutes before the task
    completed = db.Column(db.Boolean, default=False)

    def to_dict(self):
        return {
            'id': self.id,
            'title': self.title,
            'description': self.description,
            'priority': self.priority,
            'category': self.category,
            'start': self.start.isoformat(),
            'end': self.end.isoformat(),
            'allDay': self.allDay,
            'reminder': self.reminder,  # Include reminder
            'completed': self.completed,
        }


