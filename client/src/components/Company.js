import React, { useState, useEffect } from 'react';
import Sidebar from './sidebar';
import './Company.css'; // Importa el archivo CSS para estilos específicos

function Company() {



  const [planData, setPlanData] = useState({
    title: '',
    description: '',
    budget: '',
    duration: '',
    season: '',
    activityType: '',
    targetAudience: '',
    location: '', // Nuevo campo para la ubicación
  });



  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setPlanData({
      ...planData,
      [name]: value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (
      !planData.title ||
      !planData.description ||
      !planData.budget ||
      !planData.duration ||
      !planData.season ||
      !planData.activityType ||
      !planData.targetAudience ||
      !planData.location
    ) {
      alert('¡Todos los campos son obligatorios!');
      return;
    }

    try {
      const response = await fetch('http://127.0.0.1:5000/company/add_plan', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(planData),
        credentials: 'include',
      });

      if (response.ok) {
        alert('¡Plan añadido exitosamente!');
        setPlanData({
          title: '',
          description: '',
          budget: '',
          duration: '',
          season: '',
          activityType: '',
          targetAudience: '',
          location: '', // Resetea la ubicación
        });
      } else {
        const errorData = await response.json();
        console.error('Error al añadir el plan:', errorData.message);
        alert('Error: ' + errorData.message);
      }
    } catch (error) {
      console.error('Error de red:', error);
      alert('Ocurrió un error al enviar el plan.');
    }
  };

  return (
    <div className="company-page">
      <Sidebar />
      <div className="company-content">
        <h2>Añadir Plan</h2>
        <form onSubmit={handleSubmit} className="plan-form">
          <div className="form-group">
            <label htmlFor="title">Título</label>
            <input
              type="text"
              id="title"
              name="title"
              value={planData.title}
              onChange={handleInputChange}
              placeholder="Título del plan"
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="description">Descripción</label>
            <textarea
              id="description"
              name="description"
              value={planData.description}
              onChange={handleInputChange}
              placeholder="Descripción del plan"
              required
            ></textarea>
          </div>
          <div className="form-group">
            <label htmlFor="location">Ubicación</label>
            <input
              type="text"
              id="location"
              name="location"
              value={planData.location}
              onChange={handleInputChange}
              placeholder="Ubicación (e.g., Las Palmas, Maspalomas)"
              required
            />
          </div>
          <div className="form-group">
            <label htmlFor="budget">Presupuesto Estimado</label>
            <input
              type="text"
              id="budget"
              name="budget"
              value={planData.budget}
              onChange={handleInputChange}
              placeholder="Presupuesto estimado"
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="duration">Tiempo Requerido</label>
            <input
              type="text"
              id="duration"
              name="duration"
              value={planData.duration}
              onChange={handleInputChange}
              placeholder="Duración (e.g., 2 horas, medio día)"
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="season">Temporada Recomendada</label>
            <input
              type="text"
              id="season"
              name="season"
              value={planData.season}
              onChange={handleInputChange}
              placeholder="Temporada (e.g., verano, invierno)"
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="activityType">Tipo de Actividad</label>
            <input
              type="text"
              id="activityType"
              name="activityType"
              value={planData.activityType}
              onChange={handleInputChange}
              placeholder="Tipo de actividad (e.g., senderismo, cultura)"
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="targetAudience">Público Objetivo</label>
            <input
              type="text"
              id="targetAudience"
              name="targetAudience"
              value={planData.targetAudience}
              onChange={handleInputChange}
              placeholder="Público objetivo (e.g., familias, parejas)"
              required
            />
          </div>



          <button type="submit" className="submit-button">
            Añadir Plan
          </button>
        </form>
      </div>
    </div>
  );
}

export default Company;
