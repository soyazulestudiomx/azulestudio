// src/components/Common/Button.js
import React from 'react';

function Button({ children, onClick, type = 'primary', isFullWidth = false, isLink = false, className = '' }) {
  const buttonClasses = `button ${type}-button ${isFullWidth ? 'full-width-button' : ''} ${isLink ? 'button-link' : ''} ${className}`;

  if (isLink) {
    return (
      <a href="#" className={buttonClasses} onClick={onClick}>
        {children}
      </a>
    );
  }

  return (
    // Asegúrate de que el prop onClick se esté pasando al elemento <button> real
    <button className={buttonClasses} onClick={onClick}>
      {children}
    </button>
  );
}

export default Button;