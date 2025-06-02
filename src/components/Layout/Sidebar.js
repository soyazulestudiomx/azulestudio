// src/components/Layout/Sidebar.js
import React from 'react';
import { Link, useLocation } from 'react-router-dom'; // Importa Link y useLocation
import './Sidebar.css';

function Sidebar() {
  const location = useLocation(); // Hook para obtener la URL actual

  return (
    <aside className="sidebar">
      <div className="sidebar-header">
        <img src="/photostock-logo.png" alt="FotoStock Logo" className="logo" />
      </div>
      <nav className="sidebar-nav">
        <ul>
          {/* Usamos Link en lugar de a, y to en lugar de href */}
          {/* La clase 'active' se añade dinámicamente si la ruta actual coincide */}
          <li className={location.pathname === '/' ? 'active' : ''}>
            <Link to="/">
              <span className="icon"><i className="fas fa-home"></i></span>
              Inicio
            </Link>
          </li>
          <li className={location.pathname === '/inventario' ? 'active' : ''}>
            <Link to="/inventario">
              <span className="icon"><i className="fas fa-box"></i></span>
              Inventario
            </Link>
          </li>
          <li className={location.pathname === '/usuarios' ? 'active' : ''}>
            <Link to="/usuarios">
              <span className="icon"><i className="fas fa-users"></i></span>
              Usuarios
            </Link>
          </li>
          <li className={location.pathname === '/calendario' ? 'active' : ''}>
            <Link to="/calendario">
              <span className="icon"><i className="fas fa-calendar-alt"></i></span>
              Calendario
            </Link>
          </li>
        </ul>
      </nav>
    </aside>
  );
}

export default Sidebar;