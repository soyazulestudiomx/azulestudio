// src/components/Layout/Sidebar.js
import React from 'react';
import './Sidebar.css'; // <<-- Debe ser el nombre exacto del archivo CSS

function Sidebar() {
  return (
    <aside className="sidebar">
      <div className="sidebar-header">
        <img src="/photostock-logo.png" alt="FotoStock Logo" className="logo" /> {/* Necesitamos un logo aquí */}
      </div>
      <nav className="sidebar-nav">
        <ul>
          <li className="active">
            <a href="#inicio">
              <span className="icon">🏠</span> {/* Icono de ejemplo */}
              Inicio
            </a>
          </li>
          <li>
            <a href="#inventario">
              <span className="icon">📦</span> {/* Icono de ejemplo */}
              Inventario
            </a>
          </li>
          <li>
            <a href="#usuarios">
              <span className="icon">👥</span> {/* Icono de ejemplo */}
              Usuarios
            </a>
          </li>
          <li>
            <a href="#calendario">
              <span className="icon">📅</span> {/* Icono de ejemplo */}
              Calendario
            </a>
          </li>
        </ul>
      </nav>
    </aside>
  );
}

export default Sidebar;