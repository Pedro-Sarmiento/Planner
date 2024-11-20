from src.models import db, Plan, UserSavedPlans


def save_generated_plan(user_id, plan_data):
    # Comprueba si el plan ya existe en la base de datos
    existing_plan = Plan.query.filter_by(title=plan_data['titulo'], company_id=2).first()

    if not existing_plan:
        # Crea una nueva entrada para el plan generado
        new_plan = Plan(
            title=plan_data['titulo'],
            description=plan_data.get('descripcion'),
            location=plan_data.get('ubicacion'),
            budget=plan_data.get('presupuesto_estimado'),
            time_required=plan_data.get('tiempo_requerido'),
            season=plan_data.get('temporada_recomendada'),
            activity_type=plan_data.get('tipo_actividad'),
            target_audience=plan_data.get('publico_objetivo'),
            validated=False,
            company_id=2
        )
        db.session.add(new_plan)
        db.session.commit()
    else:
        return existing_plan.id

    # Guarda el plan para el usuario
    saved_plan = UserSavedPlans(user_id=user_id, plan_id=new_plan.id)
    db.session.add(saved_plan)
    db.session.commit()

    return new_plan.id
