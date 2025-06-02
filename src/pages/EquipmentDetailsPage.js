// src/pages/EquipmentDetailsPage.js
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Card from '../components/Common/Card';
import Button from '../components/Common/Button';
import './EquipmentDetailsPage.css';

import { getInventoryData, deleteInventoryItem } from '../data/inventoryData';

function EquipmentDetailsPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [equipment, setEquipment] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    setLoading(true);
    setError(null);
    const foundEquipment = getInventoryData().find(item => item.id === parseInt(id));

    if (foundEquipment) {
      setEquipment(foundEquipment);
    } else {
      setError('Equipo no encontrado.');
    }
    setLoading(false);
  }, [id]);

  const handleEditClick = () => {
    navigate(`/inventario/editar/${equipment.id}`);
  };

  const handleDeleteClick = () => {
    if (window.confirm(`¿Estás seguro de que quieres eliminar "${equipment.name}"? Esta acción no se puede deshacer.`)) {
      deleteInventoryItem(equipment.id);
      alert(`Equipo "${equipment.name}" eliminado con éxito.`);
      navigate('/inventario');
    }
  };

  if (loading) {
    return (
      <div className="equipment-details-container">
        <Card className="equipment-details-card">
          <p>Cargando detalles del equipo...</p>
        </Card>
      </div>
    );
  }

  if (error) {
    return (
      <div className="equipment-details-container">
        <Card className="equipment-details-card">
          <p className="error-message">{error}</p>
          <Button onClick={() => navigate('/inventario')}>Volver al Inventario</Button>
        </Card>
      </div>
    );
  }

  if (!equipment) {
    return (
      <div className="equipment-details-container">
        <Card className="equipment-details-card">
          <p>No se ha seleccionado ningún equipo.</p>
          <Button onClick={() => navigate('/inventario')}>Volver al Inventario</Button>
        </Card>
      </div>
    );
  }

  return (
    <div className="equipment-details-container">
      <Card className="equipment-details-card">
        <div className="equipment-details-header">
          <div className="equipment-title-block">
            <h2>Detalles del Equipo</h2>
            <p>Información completa sobre el equipo seleccionado.</p>
          </div>
          <div className="equipment-header-actions">
            <Button type="secondary" className="small-button" onClick={handleEditClick}>Editar</Button>
            <Button type="danger" className="small-button" onClick={handleDeleteClick}>Eliminar Equipo</Button>
          </div>
        </div>

        <div className="equipment-main-info">
          <div className="equipment-image-wrapper">
            <img src={equipment.image} alt={equipment.name} className="equipment-image" />
          </div>
          <div className="equipment-basic-details">
            <h3>{equipment.name}</h3>
            <p className="equipment-model-sensor">Modelo: {equipment.model} | Categoría: {equipment.category}</p> {/* ¡Añadido Categoría! */}
            <Button type="primary" className="details-edit-button" onClick={handleEditClick}>Editar</Button>
          </div>
        </div>

        <div className="equipment-additional-info">
          <h4>Información Adicional</h4>
          <div className="info-grid">
            <div className="info-item">
              <span className="info-label">Número de Serie</span>
              <span className="info-value">{equipment.serialNumber}</span>
            </div>
            <div className="info-item">
              <span className="info-label">Estado</span>
              <span className={`info-value status-badge status-${equipment.status.toLowerCase().replace(/\s+/g, '-')}`}>
                {equipment.status}
              </span>
            </div>
            <div className="info-item">
              <span className="info-label">Ubicación</span>
              <span className="info-value">{equipment.location}</span>
            </div>
            {/* Opcional: mostrar la categoría si lo prefieres aquí */}
            {/* <div className="info-item">
              <span className="info-label">Categoría</span>
              <span className="info-value">{equipment.category}</span>
            </div> */}
          </div>
        </div>

        {equipment.description && (
            <div className="equipment-description-section">
                <h4>Descripción</h4>
                <p>{equipment.description}</p>
            </div>
        )}

        {equipment.additionalInfo && (
            <div className="equipment-description-section">
                <h4>Notas/Información Extra</h4>
                <p>{equipment.additionalInfo}</p>
            </div>
        )}

        <div className="equipment-details-footer">
          <Button type="danger" onClick={handleDeleteClick}>Eliminar Equipo</Button>
        </div>
      </Card>
    </div>
  );
}

export default EquipmentDetailsPage;