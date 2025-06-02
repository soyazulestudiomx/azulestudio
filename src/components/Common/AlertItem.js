// src/components/Common/AlertItem.js
import React from 'react';

function AlertItem({ type, message }) {
  return (
    <div className={`alert-item ${type}`}>
      <p>{message}</p>
    </div>
  );
}

export default AlertItem;