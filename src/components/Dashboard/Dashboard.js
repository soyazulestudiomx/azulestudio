// src/components/Dashboard/Dashboard.js
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import './Dashboard.css';
import SummaryCard from '../Common/SummaryCard';
import Button from '../Common/Button';
import Card from '../Common/Card';
import SessionItem from '../Common/SessionItem';
import AlertItem from '../Common/AlertItem';

// Asume que tienes un archivo de configuración para tu URL base de la API
// Por ejemplo: src/config.js o directamente aquí si es simple
const API_BASE_URL = 'http://localhost:5001/api'; // ¡Asegúrate de que esta URL sea correcta para tu backend!

function Dashboard() {
  const navigate = useNavigate();

  // Estados existentes para datos fijos/futuros dinámicos
  const [totalArticulos, setTotalArticulos] = useState(75);
  const [articulosDisponibles, setArticulosDisponibles] = useState(60);
  const [articulosEnUso, setArticulosEnUso] = useState(15);
  const [alertasActivas, setAlertasActivas] = useState(2);
  const [alertasImportantes, setAlertasImportantes] = useState([
    { id: 1, type: 'warning', message: 'Cámara Nikon D850 necesita mantenimiento' },
    { id: 2, type: 'danger', message: 'Baterías LP-E6N bajas (3 unidades)' },
  ]);

  // --- NUEVOS ESTADOS para las próximas sesiones ---
  const [upcomingEvents, setUpcomingEvents] = useState([]); // ¡Aquí guardaremos los datos reales!
  const [loadingUpcomingEvents, setLoadingUpcomingEvents] = useState(true);
  const [upcomingEventsError, setUpcomingEventsError] = useState(null);

  // --- useEffect para cargar las próximas sesiones ---
  useEffect(() => {
    const fetchUpcomingEvents = async () => {
      try {
        setLoadingUpcomingEvents(true);
        setUpcomingEventsError(null);
        // Hacemos la llamada a la API con los nuevos parámetros
        // limit=3 para mostrar solo 3 en el dashboard
        const response = await axios.get(`${API_BASE_URL}/events?upcoming=true&limit=3`);
        setUpcomingEvents(response.data);
      } catch (err) {
        console.error('Error fetching upcoming events:', err);
        setUpcomingEventsError('No se pudieron cargar las próximas sesiones. Intenta de nuevo más tarde.');
      } finally {
        setLoadingUpcomingEvents(false);
      }
    };

    fetchUpcomingEvents();
  }, []); // El array vacío significa que se ejecuta solo una vez al montar el componente

  // --- FUNCIONES DE NAVEGACIÓN (adaptadas para Eventos reales) ---

  const handleViewSessionDetails = (eventId) => {
    // ¡Ahora navegamos a la página de detalles del evento real!
    navigate(`/events/${eventId}`); // ESTA RUTA DEBE ESTAR DEFINIDA EN TU App.js
  };

  // Función de ayuda para formatear la fecha y hora de los eventos de la API
  const formatEventDateTime = (dateString) => {
    if (!dateString) return 'N/A';
    const date = new Date(dateString);
    // Puedes personalizar el formato según tus preferencias
    return date.toLocaleDateString('es-ES', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      timeZone: 'America/Mexico_City' // O la zona horaria que necesites
    });
  };
    // Función de ayuda para formatear la fecha
    const formatEventDate = (dateString) => {
      if (!dateString) return 'N/A';
      const date = new Date(dateString);
      return date.toLocaleDateString('es-ES', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
      });
    };

  // Funciones existentes de navegación
  const handleManageInventory = () => {
    navigate('/inventario');
  };

  const handleViewInventory = () => {
    navigate('/inventario');
  };

  const handleNewSession = () => {
    navigate('/calendario');
  };

  const handleManageUsers = () => {
    navigate('/usuarios');
  };

  const handleViewFullCalendar = () => {
    navigate('/calendario');
  };


  return (
    <div className="dashboard-grid">
      <div className="summary-cards">
        <SummaryCard
          title="Total de Artículos"
          value={totalArticulos}
          detail={`${articulosDisponibles} disponibles, ${articulosEnUso} en uso`}
          iconClass="fas fa-box"
          cardType="articles"
        />
        <SummaryCard
          title="Próximas Sesiones"
          // Ahora muestra el número de eventos reales cargados
          value={upcomingEvents.length}
          detail="Sesiones programadas" // El detalle puede cambiar
          iconClass="fas fa-calendar-alt"
          cardType="sessions"
        />
        <SummaryCard
          title="Alertas Activas"
          value={alertasActivas}
          detail="requieren atención inmediata"
          iconClass="fas fa-exclamation-triangle"
          cardType="danger"
        />
      </div>

      <Card className="full-width-card quick-access-card">
        <div className="card-header">
          <h3>Accesos Rápidos</h3>
          <p className="card-subtitle">Funciones principales a tu alcance.</p>
        </div>
        <div className="quick-access-buttons">
          <Button type="primary" onClick={handleViewInventory}>Ver Inventario</Button>
          <Button type="success" onClick={handleNewSession}>Nueva Sesión</Button>
          <Button type="primary" onClick={handleManageUsers}>Gestionar Usuarios</Button>
        </div>
      </Card>

      <Card className="full-width-card">
        <div className="card-header">
          <h3>Próximas Sesiones</h3>
          <p className="card-subtitle">Un vistazo rápido a tus compromisos.</p>
        </div>
        <div className="session-list">
          {loadingUpcomingEvents && <p>Cargando próximas sesiones...</p>}
          {upcomingEventsError && <p className="error-message">{upcomingEventsError}</p>}
          {!loadingUpcomingEvents && !upcomingEventsError && upcomingEvents.length === 0 && (
            <p>No hay próximas sesiones programadas.</p>
          )}
          {!loadingUpcomingEvents && !upcomingEventsError && upcomingEvents.length > 0 && (
            // Mapea los eventos reales obtenidos de la API
            <>
              {upcomingEvents.map(event => (
                <SessionItem
                  key={event._id} // Usa _id de MongoDB
                  title={event.title}
                  // Asegúrate de pasar la fecha y hora formateadas correctamente
                  date={formatEventDate(event.start)}
                  time={formatEventDateTime(event.start).split(', ')[1]} // Extrae solo la hora si la necesitas separada
                  onDetailsClick={() => handleViewSessionDetails(event._id)} // Pasa el _id real
                />
              ))}
            </>
          )}
        </div>
        <Button type="primary" isFullWidth={true} onClick={handleViewFullCalendar}>Ver Calendario Completo</Button>
      </Card>

      <Card className="full-width-card alerts-card">
        <div className="card-header">
          <h3>Alertas Importantes</h3>
          <p className="card-subtitle">Artículos que necesitan tu atención.</p>
        </div>
        <div className="alert-list">
          {alertasImportantes.map(alert => (
            <AlertItem
              key={alert.id}
              type={alert.type}
              message={alert.message}
            />
          ))}
        </div>
        <Button type="secondary" onClick={handleManageInventory}>Gestionar Inventario</Button>
      </Card>
    </div>
  );
}

export default Dashboard;