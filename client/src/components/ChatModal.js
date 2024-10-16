import React, { useState } from 'react';
import './ChatModal.css'; // Asegúrate de tener el archivo CSS

const ChatModal = ({ onClose }) => {
  const [activeTab, setActiveTab] = useState('chat'); // Controls the active tab
  const [messages, setMessages] = useState([]); // Stores user and GPT messages
  const [input, setInput] = useState(''); // Controls user input for chat
  const [eventData, setEventData] = useState({ title: '', description: '', startDate: '', startTime: '', endDate: '', endTime: '', allDay: false, priority: 'Baja', category: 'General' }); // State for the task form

  const handleOverlayClick = (e) => {
    if (e.target.classList.contains('modalOverlay')) {
      onClose(); // Close modal
    }
  };

  // Function to handle sending a message
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

  // Function to handle task form submission
  const handleEventSubmit = (e) => {
    e.preventDefault();

    // Validate the form
    if (!eventData.title || (!eventData.startDate && !eventData.allDay) || (!eventData.endDate && !eventData.allDay)) {
      console.error('Datos del evento incompletos.');
      return;
    }

    const taskData = {
      title: eventData.title,
      description: eventData.description,  // Adding description to the task
      priority: eventData.priority,
      category: eventData.category,
      start: eventData.allDay ? eventData.startDate : `${eventData.startDate}T${eventData.startTime}`,
      end: eventData.allDay ? eventData.endDate : `${eventData.endDate}T${eventData.endTime}`,
      allDay: eventData.allDay,
      completed: false,
    };

    // Send the task data to the backend
    fetch('http://127.0.0.1:5000/tasks', {
      method: 'POST',
      credentials: 'include',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(taskData),
    })
      .then((response) => response.json())
      .then(() => {
        // Reset form state after submission
        setEventData({ title: '', description: '', startDate: '', startTime: '', endDate: '', endTime: '', allDay: false, priority: 'Baja', category: 'General' });
      })
      .catch((error) => {
        console.error('Error al añadir la tarea:', error);
      });
  };

  // Handle changes in the "All Day" checkbox
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

        {/* Tabs */}
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

        {/* Tab Content */}
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
                <label>Descripción</label>
                <textarea
                  placeholder="Descripción del Evento"
                  value={eventData.description}
                  onChange={(e) => setEventData({ ...eventData, description: e.target.value })}
                  className="inputField"
                />
                <label className="aa">
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
                  type="date"
                  placeholder="Fecha de inicio"
                  value={eventData.startDate}
                  onChange={(e) => setEventData({ ...eventData, startDate: e.target.value })}

                  className="inputField"
                />
                {!eventData.allDay && (
                  <>
                    <label>Hora de inicio</label>
                    <input
                      type="time"
                      value={eventData.startTime}
                      onChange={(e) => setEventData({ ...eventData, startTime: e.target.value })}
                      required
                      className="inputField"
                    />
                  </>
                )}
                <br />
                <br />
                <label>Fecha de fin</label>
                <input
                  type="date"
                  placeholder="Fecha de fin"
                  value={eventData.endDate}
                  onChange={(e) => setEventData({ ...eventData, endDate: e.target.value })}
                  className="inputField"
                />
                {!eventData.allDay && (
                  <>
                    <label>Hora de fin</label>
                    <input
                      type="time"
                      value={eventData.endTime}
                      onChange={(e) => setEventData({ ...eventData, endTime: e.target.value })}
                      required
                      className="inputField"
                    />
                  </>
                )}
                <br />
                <br />

                <label>Prioridad</label>
                <select
                  value={eventData.priority}
                  onChange={(e) => setEventData({ ...eventData, priority: e.target.value })}
                  className="inputField"
                >
                  <option value="Baja">Baja</option>
                  <option value="Media">Media</option>
                  <option value="Alta">Alta</option>
                </select>
                <br />
                <br />

                <label>Categoría</label>
                <select
                  value={eventData.category}
                  onChange={(e) => setEventData({ ...eventData, category: e.target.value })}
                  className="inputField"
                >
                  <option value="General">General</option>
                  <option value="Trabajo">Trabajo</option>
                  <option value="Personal">Personal</option>
                  <option value="Educación">Educación</option>
                </select>
                <br />
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
