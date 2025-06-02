// src/data/calendarData.js

const LOCAL_STORAGE_CALENDAR_KEY = 'photoStockCalendarEvents'; // Clave única para localStorage

// Datos iniciales de ejemplo para los eventos
const initialEventsData = [
  {
    id: 1,
    title: 'Sesión de Retrato - Cliente A',
    start: '2025-05-27T10:00:00', // Formato ISO 8601 para fecha y hora
    end: '2025-05-27T12:00:00',
    description: 'Sesión de retrato para el portafolio personal del cliente A.',
    equipmentIds: [1, 2], // IDs de equipo asociados (Cámara Canon EOS R5, Lente Canon RF 24-70mm)
  },
  {
    id: 2,
    title: 'Reunión de Equipo',
    start: '2025-05-28T14:30:00',
    end: '2025-05-28T15:30:00',
    description: 'Reunión semanal para planificar próximos proyectos.',
    equipmentIds: [], // Sin equipo asociado
  },
  {
    id: 3,
    title: 'Evento de Boda - Cliente B',
    start: '2025-06-15T09:00:00',
    end: '2025-06-15T18:00:00',
    description: 'Cobertura fotográfica de boda en salón El Lago.',
    equipmentIds: [1, 2, 3, 4], // Varios equipos
  },
];

// Función para cargar los eventos desde localStorage o los datos iniciales
const loadEvents = () => {
  try {
    const storedEvents = localStorage.getItem(LOCAL_STORAGE_CALENDAR_KEY);
    if (storedEvents) {
      return JSON.parse(storedEvents);
    }
  } catch (error) {
    console.error("Error loading calendar events from localStorage:", error);
  }
  localStorage.setItem(LOCAL_STORAGE_CALENDAR_KEY, JSON.stringify(initialEventsData));
  return initialEventsData;
};

// Variable para mantener el estado actual de los eventos en memoria
let currentEvents = loadEvents();

// Función auxiliar para guardar los eventos en localStorage
const saveEvents = () => {
  localStorage.setItem(LOCAL_STORAGE_CALENDAR_KEY, JSON.stringify(currentEvents));
};

export const getCalendarEvents = () => {
  return [...currentEvents];
};

export const addCalendarEvent = (newEvent) => {
  const newId = currentEvents.length > 0
    ? Math.max(...currentEvents.map(event => event.id)) + 1
    : 1;

  const eventToAdd = { ...newEvent, id: newId };
  currentEvents.push(eventToAdd);
  saveEvents();
  return eventToAdd;
};

export const updateCalendarEvent = (updatedEvent) => {
  const index = currentEvents.findIndex(event => event.id === updatedEvent.id);
  if (index !== -1) {
    currentEvents[index] = { ...currentEvents[index], ...updatedEvent };
    saveEvents();
    return currentEvents[index];
  }
  return null;
};

export const deleteCalendarEvent = (idToDelete) => {
  const initialLength = currentEvents.length;
  currentEvents = currentEvents.filter(event => event.id !== idToDelete);
  if (currentEvents.length < initialLength) {
    saveEvents();
    return true;
  }
  return false;
};

export const getCalendarEventById = (id) => {
  return currentEvents.find(event => event.id === parseInt(id));
};