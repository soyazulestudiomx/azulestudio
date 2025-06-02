// src/components/Layout/Header.js
import React from 'react';
import './Header.css'; // <<-- Debe ser el nombre exacto del archivo CSS

function Header() {
  return (
    <header className="header">
      <div className="header-content">
        <h1>Panel de Control de FotoStock</h1>
        <p>Bienvenido de nuevo. Aquí tienes un resumen de tu actividad.</p>
      </div>
    </header>
  );
}

export default Header;