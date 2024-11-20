import React from 'react';
import { useNavigate } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faHome, faUser, faCalendar, faSignOutAlt, faTrophy } from '@fortawesome/free-solid-svg-icons';
import './Sidebar.css';

function Sidebar() {
    const navigate = useNavigate();

    const checkUserStatus = async () => {
        try {
            const response = await fetch('http://127.0.0.1:5000/home', {
                method: 'GET',
                credentials: 'include',
            });

            if (response.ok) {
                const data = await response.json();
                console.log(data);
                if (data.message === 'Company logged in') {
                    navigate('/company');
                } else {
                    navigate('/home'); // Redirigir a la página de inicio si no es empresa
                }
            } else {
                console.error('Error al verificar el estado de usuario:', response.statusText);
            }
        } catch (error) {
            console.error('Error al conectar con la API:', error);
        }
    };

    const handleLogout = async () => {
        try {
            const response = await fetch('http://127.0.0.1:5000/logout', {
                method: 'GET',
                credentials: 'include', // Asegura que las cookies de sesión se envíen
            });

            if (response.ok) {
                console.log('Logout successful');
                navigate('/'); // Redirigir a la página de inicio de sesión
            } else {
                console.error('Error during logout:', response.statusText);
                alert('Error al cerrar sesión. Inténtalo de nuevo.');
            }
        } catch (error) {
            console.error('Error al conectar con la API de logout:', error);
        }
    };

    return (
        <div className="sidebar">
            <div className="sidebar-logo">
                <img src="/Planner_black.png" alt="Planner Logo" className="planner-logo" />
            </div>
            <nav className="sidebar-nav">
                <a
                    href="#"
                    className="sidebar-item"
                    onClick={(e) => {
                        e.preventDefault(); // Prevenir la navegación predeterminada
                        checkUserStatus(); // Llamar a la función solo al hacer clic
                    }}
                >
                    <FontAwesomeIcon icon={faHome} />
                    <span>Inicio</span>
                </a>

                <a href="/calendar" className="sidebar-item">
                    <FontAwesomeIcon icon={faCalendar} />
                    <span>Calendario</span>
                </a>
                <a href="/achievements" className="sidebar-item">
                    <FontAwesomeIcon icon={faTrophy} />
                    <span>Logros</span>
                </a>

                <a href="/profile" className="sidebar-item">
                    <FontAwesomeIcon icon={faUser} />
                    <span>Perfil</span>
                </a>

                <a
                    href="#"
                    className="sidebar-item logout-item"
                    onClick={(e) => {
                        e.preventDefault(); // Prevenir navegación predeterminada
                        handleLogout(); // Llamar a la función de logout
                    }}
                >
                    <FontAwesomeIcon icon={faSignOutAlt} />
                    <span>Cerrar Sesión</span>
                </a>

                <footer className="sidebar-footer">
                    <p>&copy; 2024 Planner. Todos los derechos reservados.</p>
                </footer>
            </nav>
        </div>
    );
}

export default Sidebar;
