// src/components/Layout/Header.js
import React from 'react';
import './Header.css';
import Button from '../Common/Button'; // Importa el componente Button

// Asegúrate de que `onLogout` esté desestructurado de las props
function Header({ panelTitle = "Panel de Control de FotoStock", userName = "usuario", onLogout }) {
  return (
    <header className="header">
      <div className="header-left">
        <h1 className="header-title">{panelTitle}</h1>
        <p className="header-welcome">Bienvenido de nuevo. Aquí tienes un resumen de tu actividad.</p>
      </div>
      <div className="header-right">
        <div className="search-bar">
          <input type="text" placeholder="Buscar..." className="search-input" />
          <i className="fas fa-search search-icon"></i>
        </div>
        {userName && (
          <div className="user-info">
            <span>Hola, {userName}!</span>
            <i className="fas fa-bell notification-icon"></i>
          </div>
        )}
        {/* Aquí es donde necesitamos revisar el onClick */}
        {userName && (
            <Button type="secondary" onClick={onLogout}> {/* <--- ESTA LÍNEA ES CLAVE */}
                Cerrar Sesión
            </Button>
        )}
      </div>
    </header>
  );
}

export default Header;