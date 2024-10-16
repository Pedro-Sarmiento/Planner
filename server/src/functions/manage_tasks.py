from flask import session, request, jsonify, Blueprint
from src.models import Task, db
import datetime


def get_tasks():
    print('Get tasks request received')
    print(session)

    user_id = session.get('user_id')
    if not user_id:
        return jsonify({"error": "User not logged in"}), 401

    tasks = Task.query.filter_by(user_id=user_id).all()

    return jsonify([task.to_dict() for task in tasks])

def add_task():
    user_id = session.get('user_id')
    if not user_id:
        print('User not logged in')
        return jsonify({"error": "User not logged in"}), 401

    data = request.json
    if not data or 'title' not in data or 'start' not in data or 'end' not in data:
        return jsonify({"error": "Missing task data"}), 400

    try:
        start = datetime.datetime.fromisoformat(data['start'])
        end = datetime.datetime.fromisoformat(data['end'])

        if data.get('allDay', False):
            end += datetime.timedelta(seconds=1)

        new_task = Task(
            user_id=user_id, 
            title=data['title'],
            description=data.get('description', ''), 
            priority=data.get('priority', 'media'),  
            category=data.get('category', 'general'), 
            start=start,
            end=end,
            allDay=data.get('allDay', False),        
            completed=data.get('completed', False),
            reminder=data.get('reminder', None)       
        )
        db.session.add(new_task)
        db.session.commit()
        return jsonify(new_task.to_dict()), 201

    except Exception as e:
        db.session.rollback()
        print(f"Error creating task: {e}")
        return jsonify({"error": "An error occurred while creating the task"}), 500


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


        if data.get('allDay', task.all_day):
            end += datetime.timedelta(seconds=1)

        task.title = data['title']
        task.description = data.get('description', task.description)  
        task.priority = data.get('priority', task.priority)           
        task.category = data.get('category', task.category)          
        task.start = start                                           
        task.end = end                                               
        task.all_day = data.get('allDay', task.all_day)              
        task.completed = data.get('completed', task.completed)        
        task.reminder = data.get('reminder', task.reminder)           

        db.session.commit()
        return jsonify(task.to_dict()), 200

    except Exception as e:
        db.session.rollback()
        print(f"Error updating task: {e}")
        return jsonify({"error": "An error occurred while updating the task"}), 500

def delete_task(id):
    task = Task.query.get(id)
    if task is None:
        return jsonify({'message': 'Task not found'}), 404

    db.session.delete(task)
    db.session.commit()
    return jsonify({'message': 'Task deleted'}), 200