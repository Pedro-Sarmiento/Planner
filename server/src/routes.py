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
from RAG.query import query_rag 
from src.models import User, db, Achievements, UserAchievements
from src.functions.manage_company import add_plan
from src.functions.save_plan import save_generated_plan
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
    if "company_id" in session:
        return jsonify({"message": "Company logged in"})
    elif "user_id" in session:
        return jsonify({"message": "User logged in"})
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


@api.route('/chat', methods=['POST'])
def chat():
    print('Chat request received')
    data = request.get_json()
    message = data.get('message')
    location = data.get('location')
    session.modified = True
    print(f'Session data: {session}')
    ai_response = query_rag(message, location)

    return jsonify({'response': ai_response})


@api.route('/plan', methods=['POST'])
def plan():
    print('Plan request received')
    data = request.get_json()
    
    
@api.route('/company/add_plan', methods=['POST'])
def company_add_plan():
    return add_plan()

@api.route('/logout', methods=['GET'])
def logout():
    session.clear()
    return jsonify({'message': 'Logged out successfully'}), 200


@api.route('/achievements', methods=['GET'])
def get_achievements():
    user_id = session.get('user_id')
    if not user_id:
        return jsonify({"error": "User not logged in"}), 401

    achievements = Achievements.query.all()
    user_achievements = UserAchievements.query.filter_by(user_id=user_id).all()

    achievements_data = []
    for achievement in achievements:
        progress = next((ua.progress for ua in user_achievements if ua.achievement_id == achievement.id), 0)
        achievements_data.append({
            "title": achievement.title,
            "description": achievement.description,
            "category": achievement.category,
            "points": achievement.points,
            "image": achievement.image,
            "target": achievement.target,
            "progress": progress
        })

    return jsonify(achievements_data)

@api.route('/save-generated-plan', methods=['POST'])
def save_generated_plan_endpoint():
    user_id = session.get('user_id')

    if not user_id:
        return jsonify({'error': 'User not logged in'}), 401

    
    data = request.json
    plan_data = data.get('plan_data')
    if not plan_data:
        return jsonify({'error': 'Plan data is missing'}), 400

    # Aquí puedes llamar a la función save_generated_plan para guardar el plan
    plan_id = save_generated_plan(user_id, plan_data)
    
    return jsonify({'message': 'Plan guardado exitosamente', 'plan_id': plan_id}), 200