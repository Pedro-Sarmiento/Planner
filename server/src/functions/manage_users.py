from flask import request, jsonify, Blueprint, session
from werkzeug.security import generate_password_hash, check_password_hash
from src.models import User, Profile, db
import traceback

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