// src/components/Common/Card.js
import React from 'react';
// No necesitamos un CSS específico para Card.js si los estilos base están en Dashboard.css o App.css
// Si queremos estilos solo para la clase 'card', podemos extraerlos.
// Por ahora, asumiremos que '.card' ya está definido en Dashboard.css

function Card({ children, className }) {
  return (
    <div className={`card ${className || ''}`}>
      {children}
    </div>
  );
}

export default Card;