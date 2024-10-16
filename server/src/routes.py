from flask import session, request, jsonify, Blueprint
from werkzeug.security import generate_password_hash, check_password_hash
from src.models import User, db, Profile, Task
import traceback
from markupsafe import escape
import datetime
from src.audio import audio_recorder, speech2text

api = Blueprint('api', __name__)

@api.route('/', methods=['GET'])
def index():
    return jsonify({'response': 'Welcome to my API!'}), 200

@api.route('/users', methods=['GET'])
def get_users():
    users = User.query.all()
    return jsonify([user.username for user in users]), 200

@api.route('/signup', methods=['POST'])
def signup():
    print('Signup request received')
    data = request.get_json()
    print(f'Request data: {data}')
    if not data:
        print('No data provided in request')
        return jsonify({'error': 'No data provided'}), 400

    required_fields = ['username', 'password', 'fullname', 'email']
    if not all(field in data for field in required_fields):
        print(f'Missing fields in request data: {data}')
        return jsonify({'error': 'Missing fields in request data'}), 400

    # Check if username or email already exists
    existing_user = User.query.filter((User.username == data['username']) | (User.email == data['email'])).first()
    if existing_user:
        print(f'User already exists: {existing_user.username}')
        return jsonify({'error': 'Username or email already exists'}), 409

    print(f'Creating new user with data: {data}')
    
    try:
        hashed_password = generate_password_hash(data['password'], method='pbkdf2:sha256')
        new_user = User(
            username=data['username'],
            password=hashed_password,
            full_name=data['fullname'],
            email=data['email']
        )
        print(f'New user object created: {new_user}')
        db.session.add(new_user)
        db.session.flush()  # Flush to get the new user's ID

        print(f'New user created: {new_user.username}, ID: {new_user.id}')

        # Create a profile for the new user with default values
        new_profile = Profile(
            user_id=new_user.id,
            profile_photo='default.jpg',
            followers=0,
            following=0,
            posts=0,
            plans=0
        )
        db.session.add(new_profile)
        db.session.commit()

        print(f'New profile created for user: {new_user.username}, Profile ID: {new_profile.id}')

        return jsonify({'response': 'User and profile created successfully!', 'user_id': new_user.id}), 201
    except Exception as e:
        db.session.rollback()
        print(traceback.format_exc())  # Log the full traceback
        return jsonify({'error': 'Internal server error'}), 500

@api.route('/login', methods=['POST'])
def login():
    data = request.get_json()
    if not data:
        return jsonify({'error': 'No data provided'}), 400

    username = data.get('username')
    password = data.get('password')

    if not username or not password:
        return jsonify({'error': 'Username and password required'}), 400

    try:
        user = User.query.filter_by(username=username).first()
        if user and check_password_hash(user.password, password):
            session["username"] = user.username
            session["user_id"] = user.id
            session.modified = True

            print(f'User {user.username} logged in')
            print(f'Session data: {session}')

            return jsonify({'message': 'Login successful', 'user_id': user.id}), 200
        else:
            return jsonify({"message": "Invalid username or password"}), 401
    except Exception as e:
        print(traceback.format_exc())
        return jsonify({'error': 'Internal server error'}), 500



@api.route('/home', methods=['GET'])
def home():

    print('Home request received')
    print(f'Session data: {session}')
    session.modified = True

    if "username" in session:
        return "Welcome to the home page %s!" % escape(session["username"]) + f'{session}'
    else:
        return jsonify({"error": "User not logged in"}), 401

@api.route('/profile', methods=['POST'])
def profile():
    print('Profile request received')
    print(f'Session data: {session}')
    user_id = session.get("user_id")    
    print(f'User ID from session: {user_id}')

    # Verificar si el user_id existe en la sesión
    if not user_id:
        return jsonify({"error": "User not logged in"}), 401

    # Buscar al usuario en la base de datos usando el user_id
    user = User.query.get(user_id)
    
    # Si el usuario existe y tiene un perfil
    if user and user.profile:
        profile_data = {
            "username": user.username,
            "profile_photo": user.profile.profile_photo,
            "followers": user.profile.followers,
            "following": user.profile.following,
            "posts": user.profile.posts,
            "plans": user.profile.plans
        }
        return jsonify(profile_data)

    return jsonify({"error": "User not found"}), 404

# Ruta para obtener todas las tareas del usuario logueado
@api.route('/tasks', methods=['GET'])
def get_tasks():
    print('Get tasks request received')
    print(session)

    # Verificar si el usuario está logueado
    user_id = session.get('user_id')
    if not user_id:
        return jsonify({"error": "User not logged in"}), 401

    # Filtrar las tareas por el user_id
    tasks = Task.query.filter_by(user_id=user_id).all()

    # Devolver las tareas como JSON
    return jsonify([task.to_dict() for task in tasks])

@api.route('/tasks', methods=['POST'])
def add_task():
    user_id = session.get('user_id')
    if not user_id:
        print('User not logged in')
        return jsonify({"error": "User not logged in"}), 401

    # Obtener los datos de la tarea desde la solicitud
    data = request.json
    if not data or 'title' not in data or 'start' not in data or 'end' not in data:
        return jsonify({"error": "Missing task data"}), 400

    try:
        start = datetime.datetime.fromisoformat(data['start'])
        end = datetime.datetime.fromisoformat(data['end'])

        # Si es "Todo el día", agregar 1 segundo a la hora final
        if data.get('allDay', False):
            end += datetime.timedelta(seconds=1)

        new_task = Task(
            user_id=user_id,  # Obtener el user_id de la sesión
            title=data['title'],
            description=data.get('description', ''),  # Descripción opcional
            priority=data.get('priority', 'media'),   # Prioridad opcional, valor por defecto: 'media'
            category=data.get('category', 'general'), # Categoría opcional, valor por defecto: 'general'
            start=start,
            end=end,
            allDay=data.get('allDay', False),        # Campo all_day, valor por defecto: False
            completed=data.get('completed', False),
            reminder=data.get('reminder', None)       # Recordatorio opcional
# Estado opcional
        )
        db.session.add(new_task)
        db.session.commit()
        return jsonify(new_task.to_dict()), 201

    except Exception as e:
        db.session.rollback()
        print(f"Error creating task: {e}")
        return jsonify({"error": "An error occurred while creating the task"}), 500


@api.route('/tasks/<int:id>', methods=['PUT'])
def update_task(id):
    task = Task.query.get(id)
    if task is None:
        return jsonify({'message': 'Task not found'}), 404

    data = request.json
    if not data:
        return jsonify({"error": "No data provided"}), 400

    try:
        start = datetime.datetime.fromisoformat(data['start'])
        end = datetime.datetime.fromisoformat(data['end'])

        # Si es "Todo el día", agregar 1 segundo a la hora final
        if data.get('allDay', task.all_day):
            end += datetime.timedelta(seconds=1)

        # Actualizar los campos de la tarea
        task.title = data['title']
        task.description = data.get('description', task.description)  # Actualizar descripción
        task.priority = data.get('priority', task.priority)           # Actualizar prioridad
        task.category = data.get('category', task.category)           # Actualizar categoría
        task.start = start                                            # Actualizar fecha de inicio
        task.end = end                                                # Actualizar fecha de fin
        task.all_day = data.get('allDay', task.all_day)               # Actualizar campo all_day
        task.completed = data.get('completed', task.completed)        # Actualizar estado de completado
        task.reminder = data.get('reminder', task.reminder)           # Actualizar recordatorio

        db.session.commit()
        return jsonify(task.to_dict()), 200

    except Exception as e:
        db.session.rollback()
        print(f"Error updating task: {e}")
        return jsonify({"error": "An error occurred while updating the task"}), 500

# Ruta para eliminar una tarea
@api.route('/tasks/<int:id>', methods=['DELETE'])
def delete_task(id):
    task = Task.query.get(id)
    if task is None:
        return jsonify({'message': 'Task not found'}), 404

    db.session.delete(task)
    db.session.commit()
    return jsonify({'message': 'Task deleted'}), 200


@api.route("/audio", methods=['POST'])
def audio():
    data = request.get_json()
    language = data['language']
    str = audio_recorder()
    if str == "ERROR: Try again":
        return str
    else:
        transcription = speech2text(language)
        return transcription 
