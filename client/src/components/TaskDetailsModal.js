import React from 'react';
import './TaskDetailsModal.css';

const TaskDetailsModal = ({ task, onClose, onEdit, onDelete }) => {
  return (
    <div className="modalOverlay" onClick={onClose}>
      <div className="modalContent" onClick={(e) => e.stopPropagation()}>
        <span className="closeButton" onClick={onClose}>&times;</span>
        <h3>Detalles de la Tarea</h3>
        <div className="task-details">
          <p><strong>Título:</strong> {task.title}</p>
          <p><strong>Descripción:</strong> {task.description}</p>
          <p><strong>Prioridad:</strong> {task.priority}</p>
          <p><strong>Categoría:</strong> {task.category}</p>
        </div>
        <div className="modalButtons">
          <button className="edit-button" onClick={() => onEdit(task)}>Editar</button>
          <button className="delete-button" onClick={() => onDelete(task.id)}>Eliminar</button>
        </div>
      </div>
    </div>
  );
};

export default TaskDetailsModal;
