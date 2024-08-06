import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faHome, faSearch, faEnvelope, faHeart, faUser } from '@fortawesome/free-solid-svg-icons';
import './Sidebar.css'; 


function Sidebar() {
    return (
        <div className="sidebar">
            <div className="sidebar-logo">
                <img src="/Planner_black.png" alt="Planner Logo" className="planner-logo" /> {/* Use your logo image */}
            </div>
            <nav className="sidebar-nav">
                <a href="/home" className="sidebar-item">
                    <FontAwesomeIcon icon={faHome} />
                    <span>Inicio</span>
                </a>

                <a href="/search" className="sidebar-item">
                    <FontAwesomeIcon icon={faSearch} />
                    <span>Búsqueda</span>
                </a>

                <a href="/messages" className="sidebar-item">
                    <FontAwesomeIcon icon={faEnvelope} />
                    <span>Mensajes</span>
                </a>

                <a href="/notifications" className="sidebar-item">
                    <FontAwesomeIcon icon={faHeart} />
                    <span>Notificaciones</span>
                </a>
 
                <a href="/profile" className="sidebar-item">
                    <FontAwesomeIcon icon={faUser} />
                    <span>Perfil</span>
                </a>
                <footer className="sidebar-footer">
                    <p>&copy; 2024 Planner. All rights reserved.</p>
                </footer>
            </nav>
        </div>
    );
}

export default Sidebar;