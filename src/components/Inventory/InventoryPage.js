// src/pages/InventoryPage.js
import React, { useState, useEffect } from 'react';
import './InventoryPage.css'; // Asegúrate de que tu CSS para Inventario esté aquí
import Button from '../components/Common/Button';
import InventoryFormModal from '../components/Inventory/InventoryFormModal'; // Tu modal de formulario de inventario
import NotificationMessage from '../components/Common/NotificationMessage';
import Pagination from '../components/common/Pagination'; // Si tienes un componente de paginación

// Asegúrate de que estas constantes de categoría y estado estén disponibles
const EQUIPMENT_CATEGORIES = ['Cámara', 'Lente', 'Iluminación', 'Accesorios', 'Software', 'Otro'];
const EQUIPMENT_STATUS = ['Disponible', 'En Uso', 'En Reparación', 'Baja', 'Perdido'];

function InventoryPage() {
  const [inventory, setInventory] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedEquipment, setSelectedEquipment] = useState(null); // Para editar un equipo existente
  const [notification, setNotification] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterCategory, setFilterCategory] = useState('Todos');
  const [filterStatus, setFilterStatus] = useState('Todos');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5; // Cantidad de ítems por página

  const API_BASE_URL = 'http://localhost:5001/api/equipment'; // La URL de tu API de equipos

  // ---------------------------------------------------
  // LÓGICA DE FETCH DE DATOS (GET)
  // ---------------------------------------------------
  const fetchInventory = async () => {
    try {
      const response = await fetch(API_BASE_URL);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = await response.json();
      setInventory(data);
    } catch (error) {
      console.error("Error al obtener el inventario:", error);
      setNotification({ message: 'Error al cargar el inventario.', type: 'error' });
    }
  };

  useEffect(() => {
    fetchInventory(); // Carga el inventario al montar el componente
  }, []); // El array vacío asegura que se ejecute solo una vez al inicio

  // ---------------------------------------------------
  // LÓGICA DE FILTRADO Y BÚSQUEDA
  // ---------------------------------------------------
  const filteredInventory = inventory.filter(item => {
    const matchesSearch = item.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = filterCategory === 'Todos' || item.category === filterCategory;
    const matchesStatus = filterStatus === 'Todos' || item.status === filterStatus;
    return matchesSearch && matchesCategory && matchesStatus;
  });

  // ---------------------------------------------------
  // LÓGICA DE PAGINACIÓN
  // ---------------------------------------------------
  const totalPages = Math.ceil(filteredInventory.length / itemsPerPage);
  const paginatedInventory = filteredInventory.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  // ---------------------------------------------------
  // MANEJO DEL MODAL Y OPERACIONES CRUD
  // ---------------------------------------------------

  const handleAddOrUpdateEquipment = async (equipmentData) => {
    try {
      let response;
      if (equipmentData._id) {
        // Actualizar equipo existente
        response = await fetch(`${API_BASE_URL}/${equipmentData._id}`, {
          method: 'PATCH', // Usamos PATCH para actualizar parcialmente
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(equipmentData),
        });
        if (!response.ok) throw new Error('Error al actualizar equipo');
        setNotification({ message: 'Equipo actualizado correctamente.', type: 'success' });
      } else {
        // Añadir nuevo equipo
        response = await fetch(API_BASE_URL, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(equipmentData),
        });
        if (!response.ok) throw new Error('Error al añadir equipo');
        setNotification({ message: 'Equipo añadido correctamente.', type: 'success' });
      }
      setIsModalOpen(false);
      setSelectedEquipment(null); // Limpiar equipo seleccionado
      fetchInventory(); // Volver a cargar el inventario para ver los cambios
    } catch (error) {
      console.error("Error al guardar equipo:", error);
      setNotification({ message: `Error al guardar equipo: ${error.message}`, type: 'error' });
    }
  };

  const handleDeleteEquipment = async (id) => {
    if (window.confirm('¿Estás seguro de que quieres eliminar este equipo?')) {
      try {
        const response = await fetch(`${API_BASE_URL}/${id}`, {
          method: 'DELETE',
        });
        if (!response.ok) throw new Error('Error al eliminar equipo');
        setNotification({ message: 'Equipo eliminado correctamente.', type: 'success' });
        fetchInventory(); // Recargar inventario
      } catch (error) {
        console.error("Error al eliminar equipo:", error);
        setNotification({ message: `Error al eliminar equipo: ${error.message}`, type: 'error' });
      }
    }
  };

  const handleOpenAddModal = () => {
    setSelectedEquipment(null); // Asegura que el modal esté en modo "añadir"
    setIsModalOpen(true);
  };

  const handleOpenEditModal = (equipment) => {
    setSelectedEquipment(equipment); // Pasa el equipo para que el modal se precargue
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedEquipment(null); // Limpiar al cerrar
  };

  // ---------------------------------------------------
  // Lógica de Notificación
  // ---------------------------------------------------
  const handleCloseNotification = () => {
    setNotification(null);
  };

  return (
    <div className="inventory-page">
      <h1>Inventario de Equipo</h1>
      <p>Administra tu equipo fotográfico eficientemente.</p>

      {notification && (
        <Notification
          message={notification.message}
          type={notification.type}
          onClose={handleCloseNotification}
        />
      )}

      <div className="inventory-controls">
        <input
          type="text"
          placeholder="Buscar equipo..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="search-input"
        />
        <select
          value={filterCategory}
          onChange={(e) => setFilterCategory(e.target.value)}
          className="filter-select"
        >
          <option value="Todos">Todas las categorías</option>
          {EQUIPMENT_CATEGORIES.map(category => (
            <option key={category} value={category}>{category}</option>
          ))}
        </select>
        <select
          value={filterStatus}
          onChange={(e) => setFilterStatus(e.target.value)}
          className="filter-select"
        >
          <option value="Todos">Todos los estados</option>
          {EQUIPMENT_STATUS.map(status => (
            <option key={status} value={status}>{status}</option>
          ))}
        </select>
        <Button onClick={handleOpenAddModal} className="add-button">
          Añadir Equipo
        </Button>
      </div>

      <div className="inventory-table-container">
        <table className="inventory-table">
          <thead>
            <tr>
              <th>Nombre</th>
              <th>Cantidad</th>
              <th>Categoría</th>
              <th>Estado</th>
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {paginatedInventory.length > 0 ? (
              paginatedInventory.map(item => (
                <tr key={item._id}> {/* Usa item._id como key */}
                  <td>{item.name}</td>
                  <td>{item.quantity}</td>
                  <td>{item.category}</td>
                  <td>{item.status}</td>
                  <td className="actions-cell">
                    <Button
                      onClick={() => handleOpenEditModal(item)}
                      className="edit-button small-button"
                    >
                      Ver Detalle
                    </Button>
                    <Button
                      onClick={() => handleDeleteEquipment(item._id)}
                      className="delete-button small-button"
                    >
                      Eliminar
                    </Button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="5" className="no-results">No se encontraron equipos.</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      <Pagination
        currentPage={currentPage}
        totalPages={totalPages}
        onPageChange={handlePageChange}
      />

      {isModalOpen && (
        <InventoryFormModal
          onClose={handleCloseModal}
          onSave={handleAddOrUpdateEquipment}
          equipment={selectedEquipment} // Pasa el equipo seleccionado para edición
          equipmentCategories={EQUIPMENT_CATEGORIES} // Pasa las categorías
          equipmentStatus={EQUIPMENT_STATUS} // Pasa los estados
        />
      )}
    </div>
  );
}

export default InventoryPage;