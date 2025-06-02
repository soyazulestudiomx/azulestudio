// src/components/Common/NotificationMessage.js
import React, { useEffect, useState } from 'react';
import './NotificationMessage.css';

function NotificationMessage({ message, type, duration = 3000, onClose }) {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    if (message) {
      setIsVisible(true);
      const timer = setTimeout(() => {
        setIsVisible(false);
        if (onClose) {
          onClose();
        }
      }, duration);

      return () => clearTimeout(timer);
    } else {
      setIsVisible(false);
    }
  }, [message, duration, onClose]);

  if (!isVisible) {
    return null;
  }

  return (
    <div className={`notification-message notification-${type}`}>
      <p>{message}</p>
      <button className="close-btn" onClick={() => { setIsVisible(false); if (onClose) onClose(); }}>
        &times;
      </button>
    </div>
  );
}

export default NotificationMessage;