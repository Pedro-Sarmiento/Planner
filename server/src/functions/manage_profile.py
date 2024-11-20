from flask import session, jsonify
from src.models import User, Company, UserSavedPlans

def profile():
    if session.get("user_id"):
        is_company = False
        user_id = session.get("user_id")
        user = User.query.get(user_id)

    elif session.get("company_id"):
        is_company = True
        company_id = session.get("company_id")
        company = Company.query.get(company_id)
    else:
        return jsonify({"error": "User not logged in"}), 401

    if is_company:
        return jsonify({
            "username": company.company_name,
            "profile_photo": 'default.jpg',
        })
    else:
        saved_plans = UserSavedPlans.query.filter_by(user_id=user_id).all()

        profile_data = {
            "username": user.username,
            "profile_photo": user.profile.profile_photo if user.profile else None,
            "plans": len(saved_plans),
            "saved_plans": [
                {
                    "title": saved_plan.plan.title,
                    "description": saved_plan.plan.description,
                    "location": saved_plan.plan.location,
                    "budget": saved_plan.plan.budget,
                    "time_required": saved_plan.plan.time_required,
                    "season": saved_plan.plan.season,
                    "activity_type": saved_plan.plan.activity_type,
                    "target_audience": saved_plan.plan.target_audience
                }
                for saved_plan in saved_plans
            ]
        }

        return jsonify(profile_data)
