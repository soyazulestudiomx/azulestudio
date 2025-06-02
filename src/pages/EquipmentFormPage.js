// src/pages/EquipmentFormPage.js
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Card from '../components/Common/Card';
import Button from '../components/Common/Button';
import './EquipmentFormPage.css';

import { getInventoryData, addInventoryItem, updateInventoryItem } from '../data/inventoryData';

function EquipmentFormPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const isEditing = id && id !== 'new';

  const [formData, setFormData] = useState({
    name: '',
    quantity: 1,
    status: 'Disponible',
    image: '',
    model: '',
    serialNumber: '',
    location: '',
    description: '',
    additionalInfo: '',
    category: 'Cámara', // ¡NUEVO CAMPO: Categoría!
  });

  const [errors, setErrors] = useState({}); // ¡NUEVO ESTADO PARA ERRORES!

  useEffect(() => {
    if (isEditing) {
      const equipmentToEdit = getInventoryData().find(item => item.id === parseInt(id));
      if (equipmentToEdit) {
        setFormData(equipmentToEdit);
      } else {
        alert('Equipo no encontrado para editar.');
        navigate('/inventario');
      }
    } else {
      setFormData({
        name: '',
        quantity: 1,
        status: 'Disponible',
        image: '',
        model: '',
        serialNumber: '',
        location: '',
        description: '',
        additionalInfo: '',
        category: 'Cámara', // Valor por defecto para el nuevo campo
      });
    }
    setErrors({}); // Limpiar errores al cambiar de modo o ID
  }, [id, isEditing, navigate]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    // Limpiar el error para el campo actual al empezar a escribir
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  // Función de validación mejorada
  const validateForm = () => {
    let newErrors = {};
    let isValid = true;

    if (!formData.name.trim()) {
      newErrors.name = 'El nombre del equipo es obligatorio.';
      isValid = false;
    }
    if (formData.quantity <= 0) {
      newErrors.quantity = 'La cantidad debe ser al menos 1.';
      isValid = false;
    }
    if (!formData.status) {
        newErrors.status = 'El estado es obligatorio.';
        isValid = false;
    }
    if (formData.image && !/^(ftp|http|https):\/\/[^ "]+$/.test(formData.image)) {
        newErrors.image = 'Introduce una URL de imagen válida.';
        isValid = false;
    }

    setErrors(newErrors);
    return isValid;
  };


  const handleSubmit = (e) => {
    e.preventDefault();

    if (!validateForm()) {
      // Si la validación falla, no continuamos con el envío
      return;
    }

    const finalFormData = { ...formData, quantity: parseInt(formData.quantity) };

    if (isEditing) {
      updateInventoryItem(finalFormData);
      alert(`Equipo "${formData.name}" actualizado con éxito.`);
    } else {
      addInventoryItem(finalFormData);
      alert(`Equipo "${formData.name}" añadido con éxito.`);
    }
    navigate('/inventario');
  };

  const categories = ['Cámara', 'Lente', 'Iluminación', 'Audio', 'Estabilización', 'Accesorios', 'Otro'];

  return (
    <div className="equipment-form-container">
      <Card className="equipment-form-card">
        <div className="equipment-form-header">
          <h2>{isEditing ? 'Editar Equipo' : 'Añadir Nuevo Equipo'}</h2>
          <Button onClick={() => navigate('/inventario')} type="secondary">
            Cancelar
          </Button>
        </div>

        <form onSubmit={handleSubmit} className="equipment-form">
          <div className="form-grid">
            <div className="form-group">
              <label htmlFor="name">Nombre del Equipo <span className="required-star">*</span></label>
              <input
                type="text"
                id="name"
                name="name"
                value={formData.name}
                onChange={handleChange}
                className={errors.name ? 'input-error' : ''} // Clase para estilos de error
              />
              {errors.name && <p className="error-message">{errors.name}</p>} {/* Mensaje de error */}
            </div>
            <div className="form-group">
              <label htmlFor="model">Modelo</label>
              <input
                type="text"
                id="model"
                name="model"
                value={formData.model}
                onChange={handleChange}
              />
            </div>
            <div className="form-group">
              <label htmlFor="serialNumber">Número de Serie</label>
              <input
                type="text"
                id="serialNumber"
                name="serialNumber"
                value={formData.serialNumber}
                onChange={handleChange}
              />
            </div>
            <div className="form-group">
              <label htmlFor="quantity">Cantidad <span className="required-star">*</span></label>
              <input
                type="number"
                id="quantity"
                name="quantity"
                value={formData.quantity}
                onChange={handleChange}
                min="1"
                required // Aunque tenemos validación JS, es bueno mantenerlo para accesibilidad
                className={errors.quantity ? 'input-error' : ''}
              />
              {errors.quantity && <p className="error-message">{errors.quantity}</p>}
            </div>
            <div className="form-group">
              <label htmlFor="status">Estado <span className="required-star">*</span></label>
              <select
                id="status"
                name="status"
                value={formData.status}
                onChange={handleChange}
                required
                className={errors.status ? 'input-error' : ''}
              >
                <option value="">Selecciona un estado</option> {/* Opción por defecto */}
                <option value="Disponible">Disponible</option>
                <option value="En uso">En uso</option>
                <option value="En reparación">En reparación</option>
                <option value="Baja carga">Baja carga</option>
                <option value="Perdido">Perdido</option>
              </select>
              {errors.status && <p className="error-message">{errors.status}</p>}
            </div>
            <div className="form-group">
              <label htmlFor="location">Ubicación</label>
              <input
                type="text"
                id="location"
                name="location"
                value={formData.location}
                onChange={handleChange}
              />
            </div>
            {/* ¡NUEVO CAMPO DE CATEGORÍA! */}
            <div className="form-group">
              <label htmlFor="category">Categoría <span className="required-star">*</span></label>
              <select
                id="category"
                name="category"
                value={formData.category}
                onChange={handleChange}
                required
                className={errors.category ? 'input-error' : ''}
              >
                <option value="">Selecciona una categoría</option>
                {categories.map(cat => (
                  <option key={cat} value={cat}>{cat}</option>
                ))}
              </select>
              {errors.category && <p className="error-message">{errors.category}</p>}
            </div>

            <div className="form-group full-width">
              <label htmlFor="image">URL de la Imagen</label>
              <input
                type="url"
                id="image"
                name="image"
                value={formData.image}
                onChange={handleChange}
                className={errors.image ? 'input-error' : ''}
              />
              {errors.image && <p className="error-message">{errors.image}</p>}
              {formData.image && <img src={formData.image} alt="Vista previa" className="image-preview" />}
            </div>
            <div className="form-group full-width">
              <label htmlFor="description">Descripción</label>
              <textarea
                id="description"
                name="description"
                value={formData.description}
                onChange={handleChange}
                rows="4"
              ></textarea>
            </div>
            <div className="form-group full-width">
              <label htmlFor="additionalInfo">Información Adicional</label>
              <textarea
                id="additionalInfo"
                name="additionalInfo"
                value={formData.additionalInfo}
                onChange={handleChange}
                rows="3"
              ></textarea>
            </div>
          </div>

          <div className="form-actions">
            <Button type="primary" submit={true}>
              {isEditing ? 'Guardar Cambios' : 'Añadir Equipo'}
            </Button>
            <Button type="secondary" onClick={() => navigate('/inventario')}>
              Cancelar
            </Button>
          </div>
        </form>
      </Card>
    </div>
  );
}

export default EquipmentFormPage;