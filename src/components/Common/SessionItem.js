// src/components/Common/SessionItem.js
import React from 'react';
import './SessionItem.css'; // Asegúrate de tener estilos para esto

const SessionItem = ({ title, date, time, onDetailsClick }) => {
  return (
    <div className="session-item-container">
      <div className="session-item-info">
        <h4>{title}</h4>
        <p>{date} {time}</p>
      </div>
      <button onClick={onDetailsClick} className="button small-button">
        Ver Detalles
      </button>
    </div>
  );
};

export default SessionItem;