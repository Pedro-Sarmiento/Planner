from flask import session, jsonify
from src.models import User

def profile():
    print('Profile request received')
    print(f'Session data: {session}')
    user_id = session.get("user_id")    
    print(f'User ID from session: {user_id}')

    if not user_id:
        return jsonify({"error": "User not logged in"}), 401

    user = User.query.get(user_id)
    
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