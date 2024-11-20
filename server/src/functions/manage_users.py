from flask import request, jsonify, Blueprint, session
from werkzeug.security import generate_password_hash, check_password_hash
from src.models import User, Profile, db, Company, Achievements, UserAchievements
import traceback
import datetime

def signup():
    print('Signup request received')
    data = request.get_json()
    print(f'Request data: {data}')
    if not data:
        print('No data provided in request')
        return jsonify({'error': 'No data provided'}), 400    

    is_company = 'companyName' in data and 'cif' in data

    if is_company:
        required_fields = ['companyName', 'cif', 'password', 'email']
    else:
        required_fields = ['username', 'password', 'fullname', 'email']

    if not all(field in data for field in required_fields):
        print(f'Missing fields in request data: {data}')
        return jsonify({'error': 'Missing fields in request data'}), 400

    if is_company:
        existing_company = Company.query.filter((Company.email == data['email']) | (Company.cif == data.get('cif'))).first()
        if existing_company:
            return jsonify({'error': 'Email or CIF already exists'}), 409
    else:
        existing_user = User.query.filter((User.username == data['username']) | (User.email == data['email'])).first()
        if existing_user:
            return jsonify({'error': 'Username or email already exists'}), 409

    
    try:
        hashed_password = generate_password_hash(data['password'], method='pbkdf2:sha256')
        if is_company:
            new_company = Company(
                company_name=data['companyName'],
                email=data['email'],
                password=hashed_password,
                cif=data['cif']
            )
            db.session.add(new_company)
            db.session.flush()
            db.session.commit()
            print(f'New company: {new_company}')

            

            return jsonify({'message': 'Company created successfully', 'company_id': new_company.id}), 201
        else:
            new_user = User(
                username=data['username'],
                password=hashed_password,
                full_name=data['fullname'],
                email=data['email']
            )
            db.session.add(new_user)
            db.session.flush()
            db.session.commit() 
            

            
            return jsonify({'message': 'User created successfully', 'user_id': new_user.id}), 201
    except Exception as e:
        db.session.rollback()
        print(traceback.format_exc())
        return jsonify({'error': 'Internal server error'}), 500


def login():
    data = request.get_json()
    if not data:
        return jsonify({'error': 'No data provided'}), 400

    username = data.get('username')
    cif = data.get('cif')
    email = data.get('email')
    password = data.get('password')
    is_company = data.get('isCompany', False)

    if not password:
        return jsonify({'error': 'Password is required'}), 400

    try:
        if is_company:
            # Login para empresas
            company = Company.query.filter(
                (Company.cif == cif) | (Company.email == email)
            ).first()
            if company and check_password_hash(company.password, password):
                session.clear()
                session["company_id"] = company.id
                session.modified = True
                print(f'Company {company.company_name} logged in')
                return jsonify({'message': 'Login successful (Company)', 'company_id': company.id}), 200
            else:
                return jsonify({"message": "Invalid CIF, email or password"}), 401
        else:
            # Login para usuarios
            user = User.query.filter_by(username=username).first()
            if user and check_password_hash(user.password, password):
                session["user_id"] = user.id
                session.modified = True
                print(f'User {user.username} logged in')
                session.clear()
                session["user_id"] = user.id
                session.modified = True
                
                update_login_achievements(user.id)
                
                return jsonify({'message': 'Login successful (User)', 'user_id': user.id}), 200
            else:
                return jsonify({"message": "Invalid username, email or password"}), 401

    except Exception as e:
        print(traceback.format_exc())
        return jsonify({'error': 'Internal server error'}), 500


def update_login_achievements(user_id):
    # Obtener todos los logros de la categoría 'login'
    login_achievements = Achievements.query.filter_by(category='login').all()

    if not login_achievements:
        return  # Si no hay logros en esta categoría, salir de la función

    today = datetime.date.today()

    for achievement in login_achievements:
        # Buscar si el usuario ya tiene progreso en este logro
        user_achievement = UserAchievements.query.filter_by(user_id=user_id, achievement_id=achievement.id).first()

        # Crear un nuevo registro si no existe
        if not user_achievement:
            user_achievement = UserAchievements(
                user_id=user_id,
                achievement_id=achievement.id,
                date=datetime.datetime.now(),
                progress=1 if achievement.target > 1 else achievement.target  # Incrementa solo si no es un logro único
            )
            db.session.add(user_achievement)
        else:
            # Verificar si el último progreso fue hoy
            if user_achievement.date.date() < today:
                user_achievement.progress += 1
                user_achievement.date = datetime.datetime.now()

                # Capar el progreso al target
                if user_achievement.progress > achievement.target:
                    user_achievement.progress = achievement.target

        db.session.commit()