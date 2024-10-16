from flask import session, request, jsonify, Blueprint
from werkzeug.security import generate_password_hash, check_password_hash
from src.models import User, db, Profile, Task
import traceback
from markupsafe import escape
import datetime
from src.audio import audio_recorder, speech2text
from src.functions.manage_users import signup as signup_user, login as login_user
from src.functions.manage_tasks import get_tasks, add_task, update_task, delete_task  # Import task functions
from src.functions.manage_profile import profile as profile_user

api = Blueprint('api', __name__)

@api.route('/signup', methods=['POST'])
def signup():
    return signup_user()
@api.route('/login', methods=['POST'])
def login():
    return login_user()

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
    return profile_user()

@api.route('/tasks', methods=['GET'])
def tasks_get():
    return get_tasks()

@api.route('/tasks', methods=['POST'])
def tasks_add():
    return add_task()

@api.route('/tasks/<int:id>', methods=['PUT'])
def tasks_update(id):
    return update_task(id)

@api.route('/tasks/<int:id>', methods=['DELETE'])
def tasks_delete(id):
    return delete_task(id)


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
