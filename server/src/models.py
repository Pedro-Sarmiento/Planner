from flask_sqlalchemy import SQLAlchemy

db = SQLAlchemy()

class User(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    username = db.Column(db.String(64), unique=True, nullable=False)
    full_name = db.Column(db.String(120), nullable=False)
    email = db.Column(db.String(120), unique=True, nullable=False)
    password = db.Column(db.String(255), nullable=False)
    profile = db.relationship('Profile', backref='user', uselist=False)
    admin = db.Column(db.Boolean, default=False)
    def __repr__(self):
        return f'<User {self.username}>'

class Company(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    company_name = db.Column(db.String(255), nullable=False, unique=True)
    email = db.Column(db.String(120), unique=True, nullable=False)
    password = db.Column(db.String(255), nullable=False)
    cif = db.Column(db.String(10), unique=True, nullable=False)
    
    def __repr__(self):
        return f'<Company {self.company_name}>'

class Profile(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey('user.id'), nullable=False)
    profile_photo = db.Column(db.String(200))
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
    reminder = db.Column(db.Integer, nullable=True)
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
            'reminder': self.reminder, 
            'completed': self.completed,
        }

class Plan(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    title = db.Column(db.String(255), nullable=False)
    description = db.Column(db.Text, nullable=True)
    location = db.Column(db.String(255), nullable=True)
    budget = db.Column(db.String(50), nullable=True)
    time_required = db.Column(db.String(255), nullable=True)
    season = db.Column(db.String(50), nullable=True)
    activity_type = db.Column(db.String(50), nullable=True)
    target_audience = db.Column(db.String(50), nullable=True)
    validated = db.Column(db.Boolean, default=False)
    company_id = db.Column(db.Integer, db.ForeignKey('company.id'), nullable=True)
    
    def to_dict(self):
        return {
            'id': self.id,
            'title': self.title,
            'description': self.description,

        }

class Playas(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    nombre = db.Column(db.String(255), nullable=False)
    isla = db.Column(db.String(255), nullable=False)
    imagen = db.Column(db.String(255), nullable=False)
    

class DetallesPlayas(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    playa_id = db.Column(db.Integer, db.ForeignKey('playas.id'), nullable=False)
    titulo = db.Column(db.String(255), nullable=False)
    descripcion = db.Column(db.Text, nullable=True)

    playa = db.relationship('Playas', backref=db.backref('detalles', lazy=True))
    
    
class Achievements(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    title = db.Column(db.String(255), nullable=False)
    description = db.Column(db.Text, nullable=True)
    category = db.Column(db.String(50), nullable=False)
    medal = db.Column(db.String(50), nullable=False)
    points = db.Column(db.Integer, nullable=False)
    image = db.Column(db.String(255), nullable=False)
    target = db.Column(db.Integer, nullable=False)  # Nuevo campo para el objetivo

class UserAchievements(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey('user.id'), nullable=False)
    achievement_id = db.Column(db.Integer, db.ForeignKey('achievements.id'), nullable=False)
    date = db.Column(db.DateTime, nullable=False)
    progress = db.Column(db.Integer, nullable=False)  # Nuevo campo para el progreso
    
    user = db.relationship('User', backref=db.backref('achievements', lazy=True))
    achievement = db.relationship('Achievements', backref=db.backref('users', lazy=True))
    

class UserSavedPlans(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey('user.id'), nullable=False)
    plan_id = db.Column(db.Integer, db.ForeignKey('plan.id'), nullable=True)
    
    user = db.relationship('User', backref=db.backref('plans', lazy=True))
    plan = db.relationship('Plan', backref=db.backref('users', lazy=True))