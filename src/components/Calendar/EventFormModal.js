import React, { useState, useEffect } from 'react';
import Button from '../Common/Button';
import Select from 'react-select'; // Para el multiselect de equipos
import DatePicker from 'react-datepicker'; // Importar DatePicker

// Importa los estilos de react-datepicker
import 'react-datepicker/dist/react-datepicker.css';
// Importa tus propios estilos para el modal
import '../../components/Calendar/EventFormModal.css';

function EventFormModal({ onClose, onSave, onDelete, event, allEquipment }) {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    start: new Date(), // Inicializar con un objeto Date
    end: new Date(),   // Inicializar con un objeto Date
    allDay: false,
    equipmentIds: [],
  });

  useEffect(() => {
    if (event) { // Si hay un evento pasado (modo edición)
      setFormData({
        _id: event._id,
        title: event.title,
        description: event.description || '',
        // Convertir strings de fecha/ISO a Date objects para react-datepicker
        start: event.start ? new Date(event.start) : new Date(),
        // Si event.end es null o no existe, establece un valor por defecto (ej. hora de inicio + 1h o null)
        end: event.end ? new Date(event.end) : null,
        allDay: event.allDay,
        equipmentIds: Array.isArray(event.equipmentIds) ? event.equipmentIds : [],
      });
    } else { // Si no hay evento (modo añadir nuevo)
      const now = new Date();
      const oneHourLater = new Date(now.getTime() + 60 * 60 * 1000); // Añadir 1 hora en milisegundos

      setFormData({
        title: '',
        description: '',
        start: now,
        end: oneHourLater, // Por defecto, fin es 1 hora después del inicio
        allDay: false,
        equipmentIds: [],
      });
    }
  }, [event]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));
  };

  // Función para manejar cambios en DatePicker (para start y end)
  const handleDateChange = (date, name) => {
    setFormData(prev => ({
      ...prev,
      [name]: date, // DatePicker ya devuelve un objeto Date
    }));
  };

  // Manejar cambio en la selección múltiple de equipos
  const handleEquipmentChange = (selectedOptions) => {
    setFormData(prev => ({
      ...prev,
      equipmentIds: selectedOptions ? selectedOptions.map(option => option.value) : [],
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const formattedData = {
      ...formData,
      // Convertir Date objects a ISO strings para tu backend/FullCalendar
      // FullCalendar es flexible, pero ISO strings son la mejor práctica.
      start: formData.start ? formData.start.toISOString() : null,
      end: formData.end ? formData.end.toISOString() : null,
    };
    onSave(formattedData);
  };

  // Opciones para react-select (equipos)
  const equipmentOptions = allEquipment.map(eq => ({
    value: eq._id,
    label: eq.name,
  }));

  // Asegura que `value` para `Select` sea un array de objetos { value, label }
  const selectedEquipmentValues = formData.equipmentIds
    .map(id => equipmentOptions.find(option => option.value === id))
    .filter(Boolean); // Filtrar posibles undefined si un ID no se encuentra (importante)

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <div className="modal-header">
          <h2>{event && event._id ? 'Editar Evento' : 'Añadir Nuevo Evento'}</h2>
          <Button onClick={onClose} className="button close-button">&times;</Button>
        </div>
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="title">Título</label>
            <input
              type="text"
              id="title"
              name="title"
              value={formData.title}
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="description">Descripción</label>
            <textarea
              id="description"
              name="description"
              value={formData.description}
              onChange={handleChange}
              rows="3"
            ></textarea>
          </div>

          <div className="form-group checkbox-group">
            <input
              type="checkbox"
              id="allDay"
              name="allDay"
              checked={formData.allDay}
              onChange={handleChange}
            />
            <label htmlFor="allDay">Día completo</label>
          </div>

          {/* DatePicker para Inicio */}
          <div className="form-group date-time-group">
            <label htmlFor="start-date">Inicio</label>
            <DatePicker
              selected={formData.start}
              onChange={(date) => handleDateChange(date, 'start')}
              showTimeSelect={!formData.allDay} // <-- CLAVE: Mostrar selector de tiempo si NO es día completo
              dateFormat={formData.allDay ? "yyyy/MM/dd" : "yyyy/MM/dd h:mm aa"} // Formato condicional
              timeFormat="h:mm aa" // Formato de la hora
              timeIntervals={15} // Intervalos de 15 minutos
              className="form-control"
              wrapperClassName="date-picker-wrapper"
              calendarClassName="custom-calendar" // Puedes añadir una clase para estilos adicionales
              // Opcional: minDate={new Date()} para no seleccionar fechas pasadas
            />
          </div>

          {/* DatePicker para Fin */}
          <div className="form-group date-time-group">
            <label htmlFor="end-date">Fin</label>
            <DatePicker
              selected={formData.end}
              onChange={(date) => handleDateChange(date, 'end')}
              showTimeSelect={!formData.allDay} // <-- CLAVE: Mostrar selector de tiempo si NO es día completo
              dateFormat={formData.allDay ? "yyyy/MM/dd" : "yyyy/MM/dd h:mm aa"} // Formato condicional
              timeFormat="h:mm aa"
              timeIntervals={15}
              minDate={formData.start} // La fecha de fin no puede ser anterior a la de inicio
              className="form-control"
              wrapperClassName="date-picker-wrapper"
              calendarClassName="custom-calendar"
            />
          </div>

          <div className="form-group">
            <label htmlFor="equipmentIds">Equipos</label>
            <Select
              id="equipmentIds"
              name="equipmentIds"
              options={equipmentOptions}
              value={selectedEquipmentValues}
              onChange={handleEquipmentChange}
              isMulti
              className="react-select-container"
              classNamePrefix="react-select"
              placeholder="Seleccionar equipos..."
              noOptionsMessage={() => "No hay equipos disponibles"} // Mensaje si no hay opciones
            />
          </div>

          <div className="modal-actions">
            {event && event._id ? (
              <>
                <Button onClick={() => onDelete(event._id)} className="button delete-button" type="button">
                  Eliminar Evento
                </Button>
                <Button onClick={onClose} className="button secondary-button" type="button">
                  Cancelar
                </Button>
                <Button type="submit" className="button primary-button">
                  Guardar Cambios
                </Button>
              </>
            ) : (
              <>
                <Button onClick={onClose} className="button secondary-button" type="button">
                  Cancelar
                </Button>
                <Button type="submit" className="button primary-button">
                  Añadir Evento
                </Button>
              </>
            )}
          </div>
        </form>
      </div>
    </div>
  );
}

export default EventFormModal;