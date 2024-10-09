import React, { useState } from 'react';
import './ChatModal.css'; // Asegúrate de tener el archivo CSS

const ChatModal = ({ onClose }) => {
  const [activeTab, setActiveTab] = useState('chat'); // Controla qué pestaña está activa
  const [messages, setMessages] = useState([]); // Para almacenar los mensajes del usuario y las respuestas de GPT
  const [input, setInput] = useState(''); // Para controlar la entrada de texto del usuario
  const [eventData, setEventData] = useState({ title: '', start: '', end: '', allDay: false }); // Estado para el formulario de eventos

  const handleOverlayClick = (e) => {
    if (e.target.classList.contains('modalOverlay')) {
      onClose(); // Cierra el modal
    }
  };

  // Función que se ejecuta al enviar un mensaje
  const handleSend = () => {
    if (input.trim() === '') return; 

    setMessages([...messages, { sender: 'user', text: input }]);

    setTimeout(() => {
      const response = `Respuesta de GPT a: ${input}`; 
      setMessages((prevMessages) => [
        ...prevMessages,
        { sender: 'gpt', text: response },
      ]);
    }, 1000);

    setInput('');
  };

  // Función para manejar el envío del formulario de eventos
  const handleEventSubmit = (e) => {
    e.preventDefault(); // Evitar que la página se recargue

    // Validar que los datos del formulario estén completos (puedes personalizar esta validación)
    if (!eventData.title || (!eventData.start && !eventData.allDay) || (!eventData.end && !eventData.allDay)) {
      console.error('Datos del evento incompletos.');
      return;
    }

    const taskData = {
      title: eventData.title,
      start: eventData.allDay ? 'Todo el día' : eventData.start,
      end: eventData.allDay ? 'Todo el día' : eventData.end,
      allDay: eventData.allDay,
    };

    // Añadir la nueva tarea al backend usando fetch
    fetch('http://127.0.0.1:5000/tasks', {
      method: 'POST',
      credentials: 'include',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(taskData),
    })
      .then((response) => response.json())
      .then((newTask) => {
        newTask.start = new Date(newTask.start);
        newTask.end = new Date(newTask.end);
        setEventData({ title: '', start: '', end: '', allDay: false });
      })
      .catch((error) => {
        console.error('Error al añadir la tarea:', error);
      });
  };

  // Manejador de cambios en el checkbox "Todo el día"
  const handleAllDayChange = (e) => {
    setEventData({ ...eventData, allDay: e.target.checked });
  };

  return (
    <div className="modalOverlay" onClick={handleOverlayClick}>
      <div className="modalContent">
        <div className="header">
          <span className="closeButton" onClick={onClose}>
            &times;
          </span>
        </div>

        {/* Pestañas */}
        <div className="tabs">
          <button
            className={activeTab === 'chat' ? 'active' : ''}
            onClick={() => setActiveTab('chat')}
          >
            Chat
          </button>
          <button
            className={activeTab === 'form' ? 'active' : ''}
            onClick={() => setActiveTab('form')}
          >
            Añadir Evento
          </button>
        </div>

        {/* Contenido de las pestañas */}
        <div className="tabContent">
          {activeTab === 'chat' && (
            <div className="chatSection">
              <div className="chatWindow">
                {messages.map((message, index) => (
                  <div
                    key={index}
                    className={message.sender === 'user' ? 'userMessage' : 'gptMessage'}
                  >
                    {message.text}
                  </div>
                ))}
              </div>

              <div className="inputContainer">
                <input
                  type="text"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  className="input"
                  placeholder="Escribe tu mensaje aquí..."
                  onKeyPress={(e) => {
                    if (e.key === 'Enter') handleSend();
                  }}
                />
                <button onClick={handleSend} className="sendButton">
                  Enviar
                </button>
              </div>
            </div>
          )}

          {activeTab === 'form' && (
            <div className="formSection">
  <h3>Añadir Evento</h3>
  <form onSubmit={handleEventSubmit}>
    <label>Título del Evento</label>
    <input
      type="text"
      placeholder="Título del Evento"
      value={eventData.title}
      onChange={(e) => setEventData({ ...eventData, title: e.target.value })}
      required
      className="inputField"
    />
    <label className='aa'>
      <input
        type="checkbox"
        checked={eventData.allDay}
        onChange={handleAllDayChange}
      />
      Todo el día
    </label>
    <br />
    <br />
    <label>Fecha de inicio</label>
    <input
      type="datetime-local"
      placeholder="Fecha de inicio"
      value={eventData.start}
      onChange={(e) => setEventData({ ...eventData, start: e.target.value })}
      required
      disabled={eventData.allDay} // Deshabilitar si es "Todo el día"
      className="inputField"
    />
    <label>Fecha de fin</label>
    <input
      type="datetime-local"
      placeholder="Fecha de fin"
      value={eventData.end}
      onChange={(e) => setEventData({ ...eventData, end: e.target.value })}
      required
      disabled={eventData.allDay} // Deshabilitar si es "Todo el día"
      className="inputField"
    />



    <br />


    <button type="submit" className="addEventButton">
      Añadir Evento
    </button>
  </form>
</div>

          )}
        </div>
      </div>
    </div>
  );
};

export default ChatModal;
