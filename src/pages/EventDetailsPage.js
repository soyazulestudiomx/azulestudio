// src/pages/EventDetailsPage.js
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom'; // useParams para obtener el ID de la URL
import axios from 'axios';
import '../styles/EventDetailsPage.css'; // Ajusta la ruta relativa
const API_BASE_URL = 'http://localhost:5001/api'; // ¡Asegúrate de que esta URL sea correcta para tu backend!

function EventDetailsPage() {
  const { id } = useParams(); // Obtiene el ID del evento de la URL (ej. /events/123)
  const navigate = useNavigate(); // Para volver al dashboard o calendario
  const [event, setEvent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchEventDetails = async () => {
      try {
        setLoading(true);
        setError(null);
        const response = await axios.get(`${API_BASE_URL}/events/${id}`);
        setEvent(response.data);
      } catch (err) {
        console.error('Error fetching event details:', err);
        setError('No se pudo cargar los detalles del evento.');
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchEventDetails();
    }
  }, [id]); // Se ejecuta cada vez que el ID en la URL cambia

  const formatDateTime = (dateString) => {
    if (!dateString) return 'N/A';
    const date = new Date(dateString);
    return date.toLocaleDateString('es-ES', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  if (loading) {
    return <div className="details-container"><p>Cargando detalles del evento...</p></div>;
  }

  if (error) {
    return <div className="details-container"><p className="error-message">{error}</p></div>;
  }

  if (!event) {
    return <div className="details-container"><p>Evento no encontrado.</p></div>;
  }

  return (
    <div className="details-container">
      <div className="details-header">
        <h1>Detalles de la Sesión: {event.title}</h1>
        <button onClick={() => navigate(-1)} className="button back-button">Volver</button> {/* Navega hacia atrás */}
      </div>

      <div className="details-card">
        <p><strong>Descripción:</strong> {event.description || 'No hay descripción.'}</p>
        <p><strong>Inicio:</strong> {formatDateTime(event.start)}</p>
        <p><strong>Fin:</strong> {event.end ? formatDateTime(event.end) : 'N/A'}</p>
        <p><strong>Día completo:</strong> {event.allDay ? 'Sí' : 'No'}</p>

        <h3>Equipos Asociados:</h3>
        {event.equipmentIds && event.equipmentIds.length > 0 ? (
          <ul className="equipment-list">
            {event.equipmentIds.map(equipment => (
              <li key={equipment._id}>{equipment.name}</li>
            ))}
          </ul>
        ) : (
          <p>No hay equipos asociados a esta sesión.</p>
        )}
      </div>

      {/* Opcional: Botones de acción como Editar o Eliminar */}
      <div className="details-actions">
        <button
          onClick={() => navigate(`/calendar?edit=${event._id}`)} // Puedes usar un query param para abrir el modal de edición
          className="button primary-button"
        >
          Editar Sesión
        </button>
        {/* Aquí podrías añadir un botón de eliminar con una confirmación */}
      </div>
    </div>
  );
}

export default EventDetailsPage;