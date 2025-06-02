// src/components/Inventory/InventoryFormModal.js
import React, { useState, useEffect } from 'react';
import './InventoryFormModal.css';
import Button from '../../components/Common/Button';
// import DateTimePicker from 'react-datetime-picker'; // YA NO NECESITAS ESTA IMPORTACIÓN
// import 'react-datetime-picker/dist/DateTimePicker.css'; // YA NO NECESITAS ESTA IMPORTACIÓN
// import 'react-calendar/dist/Calendar.css'; // YA NO NECESITAS ESTA IMPORTACIÓN
// import 'react-clock/dist/Clock.css'; // YA NO NECESITAS ESTA IMPORTACIÓN

// Las categorías y estados se pasan por props desde InventoryPage
function InventoryFormModal({ onClose, onSave, equipment, equipmentCategories, equipmentStatus }) {
  const [formData, setFormData] = useState({
    name: '',
    category: equipmentCategories[0] || 'Otro',
    status: equipmentStatus[0] || 'Disponible',
    quantity: 1,
    serialNumber: '',
    // purchaseDate: null, // ELIMINADO
    // lastMaintenanceDate: null, // ELIMINADO
    notes: '',
  });

  useEffect(() => {
    // Si se pasa un equipo, precargar el formulario para edición
    if (equipment) {
      setFormData({
        _id: equipment._id,
        name: equipment.name || '',
        category: equipment.category || equipmentCategories[0] || 'Otro',
        status: equipment.status || equipmentStatus[0] || 'Disponible',
        quantity: equipment.quantity || 1,
        serialNumber: equipment.serialNumber || '',
        // purchaseDate: equipment.purchaseDate ? new Date(equipment.purchaseDate) : null, // ELIMINADO
        // lastMaintenanceDate: equipment.lastMaintenanceDate ? new Date(equipment.lastMaintenanceDate) : null, // ELIMINADO
        notes: equipment.notes || '',
      });
    } else {
      // Limpiar el formulario si no hay equipo seleccionado (para añadir nuevo)
      setFormData({
        name: '',
        category: equipmentCategories[0] || 'Otro',
        status: equipmentStatus[0] || 'Disponible',
        quantity: 1,
        serialNumber: '',
        notes: '',
      });
    }
  }, [equipment, equipmentCategories, equipmentStatus]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  // const handleDateChange = (name, date) => { // YA NO NECESITAS ESTA FUNCIÓN
  //   setFormData(prev => ({ ...prev, [name]: date }));
  // };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave(formData);
  };

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <div className="modal-header">
          <h2>{equipment ? 'Editar Equipo' : 'Añadir Nuevo Equipo'}</h2>
          <Button onClick={onClose} className="button close-button">&times;</Button>
        </div>
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="name">Nombre:</label>
            <input
              type="text"
              id="name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="category">Categoría:</label>
            <select
              id="category"
              name="category"
              value={formData.category}
              onChange={handleChange}
              required
            >
              {equipmentCategories.map(cat => (
                <option key={cat} value={cat}>{cat}</option>
              ))}
            </select>
          </div>

          <div className="form-group">
            <label htmlFor="status">Estado:</label>
            <select
              id="status"
              name="status"
              value={formData.status}
              onChange={handleChange}
              required
            >
              {equipmentStatus.map(stat => (
                <option key={stat} value={stat}>{stat}</option>
              ))}
            </select>
          </div>

          <div className="form-group">
            <label htmlFor="quantity">Cantidad:</label>
            <input
              type="number"
              id="quantity"
              name="quantity"
              value={formData.quantity}
              onChange={handleChange}
              min="1"
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="serialNumber">Número de Serie (opcional):</label>
            <input
              type="text"
              id="serialNumber"
              name="serialNumber"
              value={formData.serialNumber}
              onChange={handleChange}
            />
          </div>

          {/* ESTOS CAMPOS SERÁN ELIMINADOS */}
          {/*
          <div className="form-group">
            <label htmlFor="purchaseDate">Fecha de Compra (opcional):</label>
            <DateTimePicker
              onChange={(date) => handleDateChange('purchaseDate', date)}
              value={formData.purchaseDate}
              id="purchaseDate"
              name="purchaseDate"
              clearIcon={null}
              format="dd/MM/yyyy"
            />
          </div>

          <div className="form-group">
            <label htmlFor="lastMaintenanceDate">Último Mantenimiento (opcional):</label>
            <DateTimePicker
              onChange={(date) => handleDateChange('lastMaintenanceDate', date)}
              value={formData.lastMaintenanceDate}
              id="lastMaintenanceDate"
              name="lastMaintenanceDate"
              clearIcon={null}
              format="dd/MM/yyyy"
            />
          </div>
          */}

          <div className="form-group">
            <label htmlFor="notes">Notas (opcional):</label>
            <textarea
              id="notes"
              name="notes"
              value={formData.notes}
              onChange={handleChange}
            ></textarea>
          </div>

          <div className="modal-actions">
            <Button type="button" onClick={onClose} className="secondary-button">
              Cancelar
            </Button>
            <Button type="submit" className="primary-button">
              {equipment ? 'Guardar Cambios' : 'Añadir Equipo'}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default InventoryFormModal;