import React, { useState, useEffect } from 'react';
import { Calendar, momentLocalizer } from 'react-big-calendar';
import moment from 'moment';
import 'react-big-calendar/lib/css/react-big-calendar.css';
import './TaskCalendar.css';
import Sidebar from './sidebar';
import FloatingButton from './FloatingButton';
import TaskDetailsModal from './TaskDetailsModal';  // Importamos el modal que crearemos a continuación
import { toast, ToastContainer } from 'react-toastify';  // Import react-toastify
import 'react-toastify/dist/ReactToastify.css';  // Import CSS for toastify
import { faTruckMonster } from '@fortawesome/free-solid-svg-icons';

moment.updateLocale('en', {
  week: {
    dow: 1, // Establece el lunes como el primer día de la semana
  },
});
const localizer = momentLocalizer(moment);

const TaskCalendar = () => {
  const [events, setEvents] = useState([]);
  const [taskInput, setTaskInput] = useState('');
  const [description, setDescription] = useState('');
  const [startTime, setStartTime] = useState('');  // Nuevo estado para hora de inicio
  const [endTime, setEndTime] = useState('');      // Nuevo estado para hora de fin
  const [priority, setPriority] = useState('Baja');
  const [category, setCategory] = useState('General');
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [editingTask, setEditingTask] = useState(null);
  const [selectedTask, setSelectedTask] = useState(null);  // Estado para la tarea seleccionada en el modal
  const [isModalOpen, setIsModalOpen] = useState(false);   // Estado para controlar la visibilidad del modal
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [allDay, setAllDay] = useState(true); // Añadir estado para el checkbox
  const [reminder, setReminder] = useState(10); // Default to 10 minutes reminder


  useEffect(() => {
    fetch('http://127.0.0.1:5000/tasks', {
      method: 'GET',
      credentials: 'include',
    })
      .then((response) => response.json())
      .then((data) => {
        const tasksWithDates = data.map((task) => ({
          ...task,
          start: new Date(task.start),  // Convierte 'start' a un objeto Date
          end: new Date(task.end),      // Convierte 'end' a un objeto Date
          allDay: task.allDay || false,  // Asegurarse de que 'allDay' es un booleano
        }));
        setEvents(tasksWithDates);  // Establece los eventos en el calendario
        console.log('Tareas cargadas:', tasksWithDates);
      })
      .catch((error) => console.error('Error al cargar las tareas:', error));
  }, []);

  
  
// Añadir o editar una tarea (evento)
const addOrEditTask = () => {
  if (!taskInput || !startDate || !endDate) return;

  const taskData = {
    title: taskInput,
    description: description,
    priority: priority,
    category: category,
    start: allDay ? startDate : `${startDate}T${startTime}`,  // Incluye la hora si no es "All Day"
    end: allDay ? endDate : `${endDate}T${endTime}`,          // Incluye la hora si no es "All Day"
    allDay: allDay,  // Usar el valor del checkbox
    reminder: reminder,  // Add reminder time
    completed: false,
  };

  if (editingTask) {
    // Editar tarea existente en el backend
    fetch(`http://127.0.0.1:5000/tasks/${editingTask.id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(taskData),
    })
      .then((response) => response.json())
      .then((updatedTask) => {
        setEvents((prevEvents) =>
          prevEvents.map((event) =>
            event.id === editingTask.id ? updatedTask : event
          )
        );
        setEditingTask(null);
      })
      .catch((error) => console.error('Error al editar la tarea:', error));
  } else {
    // Añadir nueva tarea en el backend
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
        setEvents([...events, newTask]);

      })
      .catch((error) => console.error('Error al añadir la tarea:', error));
  }

  // Reset fields after adding or editing task
  setTaskInput('');
  setDescription('');
  setPriority('Baja');
  setCategory('General');
  setAllDay(true);
  setStartDate('');
  setEndDate('');
  setEndTime('');
  setReminder(10);  // Reset reminder time
  setStartTime('');
};

  // Maneja la selección de una fecha en el calendario
  const handleDateSelect = (slotInfo) => {
    setTaskInput('');
    setDescription('');
    setPriority('Baja');
    setCategory('General');
    setAllDay(faTruckMonster);
    setStartDate('');
    setEndDate('');
    setReminder(10);  // Default reminder time
    setSelectedDate(slotInfo.start);
    setEditingTask(null); // Cancelar edición cuando se selecciona otra fecha
  };

  // Maneja el clic en un evento del calendario para abrir el modal
  const handleEventSelect = (event) => {
    setSelectedTask(event);
    setIsModalOpen(true);
  };

  // Cerrar el modal
  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedTask(null);
  };

  // Eliminar una tarea del backend y del estado
  const deleteTask = (taskId) => {
    fetch(`http://127.0.0.1:5000/tasks/${taskId}`, { method: 'DELETE' })
      .then(() => {
        setEvents(events.filter((event) => event.id !== taskId));
        closeModal();  // Cerrar el modal tras eliminar
      })
      .catch((error) => console.error('Error al eliminar la tarea:', error));
  };

  // Editar una tarea
  const editTask = (task) => {
    setTaskInput(task.title);
    setDescription(task.description || '');
    setPriority(task.priority || 'Baja');
    setCategory(task.category || 'General');
    setAllDay(task.allday || true);
    setStartDate(task.startDate || '');
    setEndDate(task.endDate || '');
    setStartTime(task.start ? moment(task.start).format('HH:mm') : '');
    setEndTime(task.end ? moment(task.end).format('HH:mm') : '');
    setReminder(task.reminder || 10);  // Set reminder time
    setEditingTask(task);
    setSelectedDate(task.start);
    closeModal();  // Cerrar el modal cuando entremos en modo edición
  };

  const dayPropGetter = (date) => {
    const currentDate = moment(date).startOf('day');
    const selectedDateMoment = moment(selectedDate).startOf('day');
    if (currentDate.isSame(selectedDateMoment)) {
      return {
        style: {
          backgroundColor: '#ADD8E6', // Color diferente para el día seleccionado
        },
      };
    }
    return {};
  };

    // Event Prop Getter function for setting colors based on priority
    const eventPropGetter = (event) => {
      let backgroundColor = '';
      if (event.priority === 'Alta') {
        backgroundColor = 'red';
      } else if (event.priority === 'Media') {
        backgroundColor = 'orange';
      } else if (event.priority === 'Baja') {
        backgroundColor = 'green';
      }
  
      return { style: { backgroundColor } };
    };
    // Helper function to format reminder time
    const formatReminderTime = (minutes) => {
      if (minutes >= 1440) {
        const days = minutes / 1440;
        return days === 1 ? '1 día' : `${days} días`;
      } else if (minutes >= 60) {
        const hours = minutes / 60;
        return hours === 1 ? '1 hora' : `${hours} horas`;
      } else {
        return `${minutes} minutos`;
      }
    };


  useEffect(() => {
    events.forEach((event) => {
      const now = new Date();
      const eventStart = new Date(event.start);
      const timeUntilReminder = eventStart - now - event.reminder * 60000;  // Reminder time in milliseconds

      if (timeUntilReminder > 0) {
        setTimeout(() => {
          const formattedReminder = formatReminderTime(event.reminder);
          toast.info(`Recordatorio: La tarea "${event.title}" comienza en ${formattedReminder}.`, {
            position: "top-right",
            autoClose: 5000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
          });
        }, timeUntilReminder);
      }
    });
  }, [events]);
    
  return (
    <div>
      <Sidebar />
      <FloatingButton />
      <ToastContainer />
      <div className="task-calendar-container">
        <h2>Calendario de Tareas</h2>
  
        <Calendar
          localizer={localizer}
          events={events}
          startAccessor="start"
          endAccessor="end"
          allDayAccessor="allDay"
          showMultiDayTimes={true}   // Ensures that multi-day events show their time blocks

          selectable
          onSelectSlot={handleDateSelect}
          onSelectEvent={handleEventSelect}
          dayPropGetter={dayPropGetter}
          eventPropGetter={eventPropGetter}
          style={{ height: 500 }}
          messages={{
            next: 'Siguiente',
            previous: 'Anterior',
            today: 'Hoy',
            month: 'Mes',
            week: 'Semana',
            day: 'Día',
          }}
        />
  
        <div className="task-input-container">
          <h3>{selectedDate ? `Añadir tarea para el ${moment(selectedDate).format('LL')}` : 'Selecciona una fecha'}</h3>
  
          <input
            type="text"
            value={taskInput}
            onChange={(e) => setTaskInput(e.target.value)}
            placeholder="Escribe tu tarea..."
            className="task-input"
          />
          <br /><br />
          <input
            type="text"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Descripción"
            className="task-input"
          />
          <br /><br />
  
          <label>Fecha de inicio:</label>
          <input
            type="date"
            value={startDate}
            onChange={(e) => setStartDate(e.target.value)}
            className="task-input"
          />

          {!allDay && (  // Mostrar input de hora si no es "Todo el día"
            <>
              <br /><br />

              <label>Hora de inicio:</label>
              <input
                type="time"
                value={startTime}
                onChange={(e) => setStartTime(e.target.value)}
                className="task-input"
              />
            </>
          )}
          <br /><br />
  
          <label>Fecha final:</label>
          <br />
          <input
            type="date"
            value={endDate}
            onChange={(e) => setEndDate(e.target.value)}
            className="task-input"
          />
  
          {!allDay && (  // Mostrar input de hora si no es "Todo el día"
            <>
                    
              <br /><br />

              <label>Hora final:</label>
              <br />

              <input
                type="time"
                value={endTime}
                onChange={(e) => setEndTime(e.target.value)}
                className="task-input"
              />
            </>
          )}
          <br /><br />
  
          <label>Todo el día:</label>
          <input
            type="checkbox"
            checked={allDay}
            onChange={(e) => setAllDay(e.target.checked)}
          />
          <br /><br />
  
          <label>Prioridad:</label>
          <select value={priority} onChange={(e) => setPriority(e.target.value)}>
            <option value="Baja">Baja</option>
            <option value="Media">Media</option>
            <option value="Alta">Alta</option>
          </select>
          <br /><br />
  
          <label>Categoría:</label>
          <select value={category} onChange={(e) => setCategory(e.target.value)}>
            <option value="General">General</option>
            <option value="Trabajo">Trabajo</option>
            <option value="Personal">Personal</option>
            <option value="Educación">Educación</option>
          </select>
          <br /><br />

          <label>Recordatorio:</label>
          <select value={reminder} onChange={(e) => setReminder(Number(e.target.value))}>
            <option value={5}>5 minutos antes</option>
            <option value={10}>10 minutos antes</option>
            <option value={30}>30 minutos antes</option>
            <option value={60}>1 hora antes</option>
            <option value={1440}>1 día antes</option>
          </select>
          <br /><br />
  
          <button onClick={addOrEditTask} disabled={!startDate || !endDate} className="add-task-button">
            {editingTask ? 'Guardar cambios' : 'Añadir Tarea'}
          </button>
        </div>
      </div>
  
      {selectedTask && (
        <TaskDetailsModal
          task={selectedTask}
          onClose={closeModal}
          onEdit={editTask}
          onDelete={deleteTask}
        />
      )}
    </div>
  );
};

export default TaskCalendar;
