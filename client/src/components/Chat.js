import React, { useState } from 'react';
import './Chat.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUser, faRobot } from '@fortawesome/free-solid-svg-icons';

function Chat() {
    const [messages, setMessages] = useState([]);
    const [input, setInput] = useState('');
    const [selectedCategory, setSelectedCategory] = useState('All');
    const [selectedBudget, setSelectedBudget] = useState('All');
    const [loading, setLoading] = useState(false); // Estado de carga

    const categories = ['Todos', 'Cultura', 'Deportes', 'Naturaleza', 'Gastronomía', 'Ocio', 'Familia', 'Aventura', 'Relax'];
    const budgets = ['Todos', 'Bajo', 'Medio', 'Alto'];

    const handleChangeLocation = () => {
        return new Promise((resolve, reject) => {
            navigator.geolocation.getCurrentPosition(
                (position) => {
                    const latitude = position.coords.latitude;
                    const longitude = position.coords.longitude;

                    const nominatimUrl = `https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}&zoom=18&addressdetails=1`;

                    fetch(nominatimUrl)
                        .then((response) => response.json())
                        .then((data) => {
                            const location = data.display_name;
                            resolve(location);
                        })
                        .catch((error) => reject(error));
                },
                (error) => reject(error)
            );
        });
    };

    const handleSend = async () => {
        if (input.trim() === '') return;

        // Mostrar mensaje ficticio de "generando..."

        setLoading(true);

        try {
            const location = await handleChangeLocation();

            const newMessage = { sender: 'user', text: input, location: location, category: selectedCategory, budget: selectedBudget };
            setMessages((prevMessages) => [...prevMessages, newMessage]);
            const loadingMessage = { sender: 'ai', text: 'Generando respuesta...', type: 'loading' };
            setMessages((prevMessages) => [...prevMessages, loadingMessage]);

            // Enviar mensaje al AI
            const response = await fetch('http://127.0.0.1:5000/chat', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ message: input, location: location, category: selectedCategory, budget: selectedBudget }),
                credentials: 'include',
            });

            const data = await response.json();
            let responseContent = data.response;

            try {
                if (typeof responseContent === 'string') {
                    responseContent = JSON.parse(responseContent);
                }
            } catch (error) {
                console.error('Failed to parse JSON:', error);
            }

            const isPlanResponse = Array.isArray(responseContent);

            // Remover mensaje ficticio
            setMessages((prevMessages) => prevMessages.filter((msg) => msg.type !== 'loading'));

            if (isPlanResponse) {
                const aiMessage = { sender: 'ai', text: responseContent, type: 'plans' };
                setMessages((prevMessages) => [...prevMessages, aiMessage]);
            } else {
                const aiMessage = { sender: 'ai', text: responseContent, type: 'text' };
                setMessages((prevMessages) => [...prevMessages, aiMessage]);
            }
        } catch (error) {
            console.error('Error:', error);
            // Remover mensaje ficticio si hay error
            setMessages((prevMessages) => prevMessages.filter((msg) => msg.type !== 'loading'));
        } finally {
            setLoading(false);
        }

        setInput('');
    };

    const renderPlans = (plans) => {
        return (
            <div>
                {plans.map((plan, index) => (
                    <div key={index} className="plan-container">
                        <h3>{plan.titulo}</h3>
                        <p><strong>Descripción:</strong> {plan.descripcion}</p>
                        <p><strong>Ubicación:</strong> {plan.ubicacion}</p>
                        <p><strong>Presupuesto estimado:</strong> {plan.presupuesto_estimado}</p>
                        <p><strong>Tiempo requerido:</strong> {plan.tiempo_requerido}</p>
                        <p><strong>Temporada recomendada:</strong> {plan.temporada_recomendada}</p>
                        <p><strong>Tipo de actividad:</strong> {plan.tipo_actividad}</p>
                        <p><strong>Público objetivo:</strong> {plan.publico_objetivo}</p>
                        <SaveButton plan={plan} onSave={handleSavePlan} />
                    </div>
                ))}
            </div>
        );
    };

    const handleSavePlan = async (plan) => {
        const payload = { plan_data: plan };

        try {
            const response = await fetch('http://127.0.0.1:5000/save-generated-plan', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload),
                credentials: 'include',
            });
            const data = await response.json();
            if (!response.ok) {
                alert(data.error || 'Hubo un problema al guardar el plan');
            }
        } catch (error) {
            console.error('Error:', error);
        }
    };

    const SaveButton = ({ plan, onSave }) => {
        const [isSaving, setIsSaving] = useState(false);

        const handleClick = async () => {
            setIsSaving(true);

            try {
                onSave(plan);
            } catch (error) {
                console.error('Error saving plan:', error);
            } finally {
                setIsSaving(false);
            }
        };

        return (
            <button
                onClick={handleClick}
                className={`save-plan-button ${isSaving ? 'saving' : ''}`}
                aria-label={`Guardar el plan: ${plan.titulo}`}
            >
                {isSaving ? 'Guardando...' : 'Guardar plan +'}
            </button>
        );
    };

    return (
        <div className="chat-container">
            <div className="chat-header">
                <h2>Usa la IA de Planner</h2>
            </div>
            <div className="filters">
                <label>
                    Categoría:
                    <select value={selectedCategory} onChange={(e) => setSelectedCategory(e.target.value)}>
                        {categories.map((category, index) => (
                            <option key={index} value={category}>{category}</option>
                        ))}
                    </select>
                </label>
                <label>
                    Presupuesto:
                    <select value={selectedBudget} onChange={(e) => setSelectedBudget(e.target.value)}>
                        {budgets.map((budget, index) => (
                            <option key={index} value={budget}>{budget}</option>
                        ))}
                    </select>
                </label>
            </div>
            <div className="chat-window">
                {messages.map((message, index) => (
                    <div key={index} className={`chat-message ${message.sender}`}>
                        <FontAwesomeIcon icon={message.sender === 'user' ? faUser : faRobot} className="chat-icon" />
                        {message.type === 'plans' ? (
                            renderPlans(message.text)
                        ) : (
                            <p>{message.text}</p>
                        )}
                    </div>
                ))}
            </div>
            <div className="chat-input">
                <input
                    type="text"
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    onKeyPress={(e) => {
                        if (e.key === 'Enter') handleSend();
                    }}
                    placeholder="Escribe tu mensaje..."
                    disabled={loading}
                />
                <button onClick={handleSend} disabled={loading}>
                    {loading ? 'Generando...' : 'Enviar'}
                </button>
            </div>
        </div>
    );
}

export default Chat;
