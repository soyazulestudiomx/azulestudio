// src/components/Common/SummaryCard.js
import React from 'react';
import Card from './Card';

// Mapeo de cardType a la clase CSS para el borde de color
const cardTypeClasses = {
  articles: 'articles-card',
  sessions: 'sessions-card',
  danger: 'danger-card'
};

function SummaryCard({ title, value, detail, iconClass, cardType }) {
  // Combina las clases existentes con la clase de tipo de tarjeta
  const extraCardClass = cardType ? cardTypeClasses[cardType] : '';

  return (
    <Card className={`summary-card ${extraCardClass}`}>
      <div className="card-header">
        <h3>{title}</h3>
        {/* Usa la clase de Font Awesome para el ícono */}
        <span className="icon">
          <i className={iconClass}></i>
        </span>
      </div>
      <p className="card-value">{value}</p>
      <p className="card-detail">{detail}</p>
    </Card>
  );
}

export default SummaryCard;