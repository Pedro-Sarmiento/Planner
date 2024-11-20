from flask import request, jsonify, session 
from src.models import db, Plan 

def add_plan():
    try:
        data = request.get_json()
        print(f'Request data: {data}')
        
        # Validar campos requeridos
        required_fields = ['title', 'description', 'location', 'budget', 'duration', 'season', 'activityType', 'targetAudience']
        if not all(field in data for field in required_fields):
            print(f'Missing required fields: {data}')
            return jsonify({'error': 'Missing required fields'}), 400

        
        print(f'Session data: {session}')
        # Crear una instancia del modelo Plan
        new_plan = Plan(
            title=data['title'],
            description=data['description'],
            location=data['location'],
            budget=data['budget'],
            time_required=data['duration'],
            season=data['season'],
            activity_type=data['activityType'],
            target_audience=data['targetAudience'],
            company_id=session['company_id'],  
            
        )

        # Añadir el plan a la sesión de la base de datos
        db.session.add(new_plan)
        db.session.commit()  # Guardar los cambios en la base de datos

        return jsonify({'message': 'Plan added successfully', 'plan_id': new_plan.id}), 201
    except Exception as e:
        db.session.rollback()  # Revertir cambios en caso de error
        print(f'Error adding plan: {e}')
        return jsonify({'error': 'An error occurred while adding the plan'}), 500
