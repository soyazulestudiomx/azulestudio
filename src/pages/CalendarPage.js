// src/pages/CalendarPage.js

import React, { useState, useEffect, useCallback } from 'react'; // Agregamos useCallback
import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import timeGridPlugin from '@fullcalendar/timegrid';
import interactionPlugin from '@fullcalendar/interaction';
import esLocale from '@fullcalendar/core/locales/es';
import axios from 'axios';

import '../styles/FullCalendarTheme.css';

import EventFormModal from '../components/Calendar/EventFormModal';
import Button from '../components/Common/Button';
import Notification from '../components/Common/Notification'; // Para notificaciones al usuario

// Base URL de tu API de eventos
const API_BASE_URL = 'http://localhost:5001/api'; // Ajusta si tu puerto es diferente

function CalendarPage() {
  const [events, setEvents] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [allEquipment, setAllEquipment] = useState([]);
  const [notification, setNotification] = useState(null);

  // --- Funciones para interactuar con la API ---

  // useCallback para memorizar las funciones de fetching y evitar recrearlas innecesariamente
  const fetchEvents = useCallback(async () => {
    try {
      const response = await axios.get(`${API_BASE_URL}/events`);
      // FullCalendar espera IDs como string, y `_id` de MongoDB ya es un string
      setEvents(response.data);
    } catch (error) {
      console.error('Error al obtener eventos del backend:', error);
      setNotification({ message: 'Error al cargar eventos del calendario.', type: 'error' });
      setEvents([]); // Limpiar eventos si hay un error
    }
  }, []); // Dependencias vacías, solo se crea una vez

  const fetchAllEquipment = useCallback(async () => {
    try {
      const response = await axios.get(`${API_BASE_URL}/equipment`); // Asegúrate de la URL correcta
      setAllEquipment(response.data);
    } catch (error) {
      console.error('Error al obtener equipos del backend:', error);
      setNotification({ message: 'Error al cargar equipos disponibles.', type: 'error' });
      setAllEquipment([]);
    }
  }, []);

  // --- useEffect para cargar datos al inicio ---
  useEffect(() => {
    fetchEvents();
    fetchAllEquipment();
  }, [fetchEvents, fetchAllEquipment]); // Dependencias para que se ejecute cuando estas funciones cambien (que no deberían)


  // --- Funciones del Modal y CRUD de Eventos ---

  const openModal = (eventInfo = null) => {
    if (eventInfo && eventInfo.event) { // Clic en un evento existente
      const fcEvent = eventInfo.event;
      setSelectedEvent({
        _id: fcEvent.id, // FullCalendar usa 'id' pero nuestro backend usa '_id'
        title: fcEvent.title,
        start: fcEvent.start ? fcEvent.start.toISOString() : new Date().toISOString(),
        end: fcEvent.end ? fcEvent.end.toISOString() : null,
        allDay: fcEvent.allDay,
        description: fcEvent.extendedProps.description || '',
        equipmentIds: fcEvent.extendedProps.equipmentIds || []
      });
    } else if (eventInfo && eventInfo.start) { // Selección de día/rango en el calendario
      const initialStartDate = new Date(eventInfo.startStr);
      let initialEndDate = new Date(eventInfo.endStr);

      // Si la selección fue un clic en un día (no un drag con hora) en month view
      // y FullCalendar nos dice que es allDay, ajustamos para que el modal permita horas.
      if (eventInfo.allDay && initialStartDate.toDateString() === initialEndDate.toDateString()) {
          // Si es un solo día completo, establece el fin 1 hora después del inicio por defecto
          initialEndDate = new Date(initialStartDate.getTime() + 60 * 60 * 1000);
      } else if (eventInfo.allDay && initialEndDate.getDate() === initialStartDate.getDate() + 1) {
          // Si es un rango de día completo que abarca el día siguiente (ej. 1 de jun a 2 de jun),
          // para el modal, lo hacemos un evento del mismo día con duración por defecto.
          initialEndDate = new Date(initialStartDate.getTime() + 60 * 60 * 1000); // 1 hora después
      }


      setSelectedEvent({
        title: '',
        description: '',
        start: initialStartDate.toISOString(), // Convertir a ISO string
        end: initialEndDate.toISOString(),     // Convertir a ISO string
        allDay: false, // Forzamos a false para que el selector de hora aparezca
        equipmentIds: []
      });
    } else { // Clic en "Añadir Nuevo Evento" (botón principal)
      setSelectedEvent(null); // Nuevo evento vacío
    }
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedEvent(null);
  };

  const handleDateSelect = (selectInfo) => {
    openModal(selectInfo);
  };

  const handleEventClick = (clickInfo) => {
    openModal(clickInfo);
  };

  const handleSaveEvent = async (eventData) => {
    try {
      let response;
      if (eventData._id) { // Actualizar evento existente
        response = await axios.patch(`${API_BASE_URL}/events/${eventData._id}`, eventData);
        setNotification({ message: 'Evento actualizado correctamente.', type: 'success' });
      } else { // Crear nuevo evento
        response = await axios.post(`${API_BASE_URL}/events`, eventData);
        setNotification({ message: 'Evento añadido correctamente.', type: 'success' });
      }
      fetchEvents(); // Recargar eventos del calendario para ver los cambios
      closeModal();
    } catch (error) {
      console.error('Error al guardar evento:', error);
      setNotification({ message: `Error al guardar evento: ${error.response?.data?.message || error.message}`, type: 'error' });
    }
  };

  const handleDeleteEvent = async (eventId) => {
    if (!window.confirm('¿Estás seguro de que quieres eliminar este evento?')) {
      return;
    }
    try {
      await axios.delete(`${API_BASE_URL}/events/${eventId}`);
      setNotification({ message: 'Evento eliminado correctamente.', type: 'success' });
      fetchEvents(); // Recargar eventos
      closeModal();
    } catch (error) {
      console.error('Error al eliminar evento:', error);
      setNotification({ message: `Error al eliminar evento: ${error.response?.data?.message || error.message}`, type: 'error' });
    }
  };

  // FullCalendar eventDrop y eventResize handlers
  const handleEventChange = async (changeInfo) => {
    const { event } = changeInfo;
    const updatedEvent = {
      _id: event.id, // FullCalendar usa 'id', nuestro backend '_id'
      title: event.title,
      start: event.start.toISOString(),
      // FullCalendar puede tener 'end' null si es un evento de día completo sin fin explícito
      end: event.end ? event.end.toISOString() : null,
      allDay: event.allDay,
      description: event.extendedProps.description,
      equipmentIds: event.extendedProps.equipmentIds || []
    };

    try {
      await axios.patch(`${API_BASE_URL}/events/${updatedEvent._id}`, updatedEvent);
      setNotification({ message: 'Evento actualizado (movido/redimensionado) correctamente.', type: 'success' });
      fetchEvents(); // Opcional: Si quieres refrescar para asegurar consistencia, si no, FullCalendar ya lo muestra
    } catch (error) {
      console.error('Error al actualizar evento (drag/resize):', error);
      setNotification({ message: `Error al actualizar evento: ${error.response?.data?.message || error.message}`, type: 'error' });
      changeInfo.revert(); // Revertir el cambio visual en el calendario si la API falla
    }
  };


  const renderEventContent = (eventInfo) => {
    return (
      <>
        <div className="fc-event-main-content">
          {eventInfo.timeText && !eventInfo.event.allDay && (
            <span className="fc-event-time">{eventInfo.timeText}</span>
          )}
          <span className="fc-event-title">{eventInfo.event.title}</span>
        </div>
      </>
    );
  };

  const handleCloseNotification = () => {
    setNotification(null);
  };


  return (
    <div className="calendar-page-container">
      {notification && (
        <Notification
          message={notification.message}
          type={notification.type}
          onClose={handleCloseNotification}
        />
      )}

      <div className="calendar-header">
        <h1>Calendario de Eventos</h1>
        <Button onClick={() => openModal(null)} className="button primary-button">
          Añadir Nuevo Evento
        </Button>
      </div>
      <FullCalendar
        plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin]}
        initialView="dayGridMonth"
        headerToolbar={{
          left: 'prev,next today',
          center: 'title',
          right: 'dayGridMonth,timeGridWeek,timeGridDay'
        }}
        editable={true} // Permite drag and drop, resize
        selectable={true} // Permite seleccionar rangos de fecha/hora
        selectMirror={true}
        dayMaxEvents={true}
        weekends={true}
        // Mapea los eventos de tu estado a un formato que FullCalendar entienda
        // Asegúrate de que _id de MongoDB se mapee a 'id' de FullCalendar
        events={events.map(event => ({
          id: event._id,
          title: event.title,
          start: event.start,
          end: event.end,
          allDay: event.allDay,
          extendedProps: { // Datos adicionales que FullCalendar guarda y puedes acceder
            description: event.description,
            equipmentIds: event.equipmentIds
          }
        }))}
        select={handleDateSelect}
        eventClick={handleEventClick}
        eventDrop={handleEventChange} // Usa la nueva función genérica para drag/drop
        eventResize={handleEventChange} // Usa la nueva función genérica para resize
        height={600}
        locale={esLocale}
        eventContent={renderEventContent}
      />

      {isModalOpen && (
        <EventFormModal
          onClose={closeModal}
          onSave={handleSaveEvent}
          // Pasa la función onDelete solo si selectedEvent existe y tiene un _id
          onDelete={selectedEvent && selectedEvent._id ? () => handleDeleteEvent(selectedEvent._id) : null}
          event={selectedEvent}
          allEquipment={allEquipment}
        />
      )}
    </div>
  );
}

export default CalendarPage;