// src/pages/UsersPage.js

import React, { useEffect, useState } from 'react';
import axios from 'axios';
import NotificationMessage from '../components/Common/NotificationMessage';
import Button from '../components/Common/Button';
import Card from '../components/Common/Card';
import Pagination from '../components/Common/Pagination';
import Modal from '../components/Common/Modal'; // Importa el componente Modal
import './UsersPage.css'; // Asegúrate de que este CSS existe y está bien enlazado


const USERS_API_URL = 'http://localhost:5001/api/users'; // URL de tu API de usuarios

function UsersPage() {
  const [users, setUsers] = useState([]);
  const [filteredUsers, setFilteredUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [showNotification, setShowNotification] = useState(false);
  const [notificationType, setNotificationType] = useState('');
  const [notificationMessage, setNotificationMessage] = useState('');

  // Estados para la paginación
  const [currentPage, setCurrentPage] = useState(1);
  const [usersPerPage] = useState(10); // O el número que desees

  // ESTADOS PARA EL MODAL DE AÑADIR USUARIO
  const [isAddUserModalOpen, setIsAddUserModalOpen] = useState(false);
  const [newUserData, setNewUserData] = useState({
    username: '', // Debe coincidir con el campo en tu esquema de backend
    email: '',
    password: '',
    role: 'visualizador', // Asegúrate de que coincida con un valor en el enum de tu backend (minúsculas)
    status: 'Activo', // Asegúrate de que coincida con un valor en el enum de tu backend
  });


  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await axios.get(USERS_API_URL);
        setUsers(response.data);
        setFilteredUsers(response.data);
        setLoading(false);
      } catch (err) {
        console.error("Error al cargar los usuarios:", err);
        setError("Error al cargar los usuarios. Por favor, inténtalo de nuevo más tarde.");
        setNotificationType('error');
        setNotificationMessage("Error al cargar los usuarios.");
        setShowNotification(true);
        setLoading(false);
      }
    };

    fetchUsers();
  }, []);

  useEffect(() => {
    const results = users.filter(user =>
      (user.username && user.username.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (user.email && user.email.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (user.role && user.role.toLowerCase().includes(searchTerm.toLowerCase()))
    );
    setFilteredUsers(results);
    setCurrentPage(1); // Resetear a la primera página en cada búsqueda
  }, [searchTerm, users]);


  const handleSearchChange = (event) => {
    setSearchTerm(event.target.value);
  };

  const handleAddUser = () => {
    // Abre el modal y resetea los datos del formulario si es necesario
    setNewUserData({ username: '', email: '', password: '', role: 'visualizador', status: 'Activo' }); // Resetea al abrir
    setIsAddUserModalOpen(true);
  };

  const handleEditUser = (userId) => {
    console.log("Editar usuario:", userId);
  };

  const handleDeleteUser = async (userId, username) => {
    if (window.confirm(`¿Estás seguro de que quieres eliminar al usuario "${username}"?`)) {
      try {
        await axios.delete(`${USERS_API_URL}/${userId}`);
        setUsers(users.filter(user => user._id !== userId));
        setNotificationType('success');
        setNotificationMessage(`Usuario "${username}" eliminado correctamente.`);
        setShowNotification(true);
        setTimeout(() => setShowNotification(false), 3000);
      } catch (err) {
        console.error("Error al eliminar el usuario:", err);
        setNotificationType('error');
        setNotificationMessage("Error al eliminar el usuario.");
        setShowNotification(true);
        setTimeout(() => setShowNotification(false), 3000);
      }
    }
  };

  // Lógica de paginación
  const indexOfLastUser = currentPage * usersPerPage;
  const indexOfFirstUser = indexOfLastUser - usersPerPage;
  const currentUsers = filteredUsers.slice(indexOfFirstUser, indexOfLastUser);

  const totalPages = Math.ceil(filteredUsers.length / usersPerPage);

  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  // MANEJO DE CAMBIOS EN EL FORMULARIO DEL MODAL
  const handleNewUserFormChange = (e) => {
    const { name, value } = e.target;
    setNewUserData(prevData => ({
      ...prevData,
      [name]: value
    }));
  };

  // MANEJO DE ENVÍO DEL FORMULARIO DEL MODAL
  const handleCreateUser = async (e) => {
    e.preventDefault(); // Evita que la página se recargue

        console.log("Datos del nuevo usuario a enviar:", newUserData); // <-- Añade esta línea


    try {
      const response = await axios.post(USERS_API_URL, newUserData);
      // Actualiza la lista de usuarios con el nuevo usuario
      setUsers(prevUsers => [...prevUsers, response.data]);
      // También actualiza los usuarios filtrados para que aparezca en la búsqueda si coincide
      setFilteredUsers(prevFilteredUsers => [...prevFilteredUsers, response.data]);
      setIsAddUserModalOpen(false); // Cierra el modal
      // Resetea el formulario para el próximo uso
      setNewUserData({ username: '', email: '', password: '', role: 'visualizador', status: 'Activo' });
      setNotificationType('success');
      setNotificationMessage(`Usuario "${response.data.username}" añadido correctamente.`);
      setShowNotification(true);
      setTimeout(() => setShowNotification(false), 3000);
    } catch (err) {
      console.error("Error al añadir usuario:", err);
      // Captura el mensaje de error del backend si está disponible
      const errorMessage = err.response && err.response.data && err.response.data.message
                           ? err.response.data.message
                           : "Error al añadir el usuario.";
      setNotificationType('error');
      setNotificationMessage(errorMessage);
      setShowNotification(true);
      setTimeout(() => setShowNotification(false), 5000); // Dar más tiempo para leer el error
    }
  };


  if (loading) {
    return (
      <div className="users-page-container">
        <h2>Cargando usuarios...</h2>
      </div>
    );
  }

  if (error) {
    return (
      <div className="users-page-container">
        <h2>{error}</h2>
      </div>
    );
  }

  return (
    <div className="users-page-container">
      {showNotification && (
        <NotificationMessage
          message={notificationMessage}
          type={notificationType}
          onClose={() => setShowNotification(false)}
        />
      )}

      <div className="users-header">
        <h1>Gestión de Usuarios</h1>
        <div className="user-actions">
          <input
            type="text"
            placeholder="Buscar usuarios..."
            value={searchTerm}
            onChange={handleSearchChange}
            className="search-input"
          />
          <Button className="add-user-button" onClick={handleAddUser}>Añadir Usuario</Button>
        </div>
      </div>

      <Card className="users-table-card">
        <div className="table-responsive">
          <table>
            <thead>
              <tr>
                <th>ID</th>
                <th>NOMBRE</th>
                <th>EMAIL</th>
                <th>ROL</th>
                <th>ESTADO</th>
                <th>ACCIONES</th>
              </tr>
            </thead>
            <tbody>
              {currentUsers.length > 0 ? (
                currentUsers.map(user => (
                  <tr key={user._id}>
                    <td>{user._id}</td>
                    <td>{user.username}</td>
                    <td>{user.email}</td>
                    <td>{user.role}</td>
                    <td className={`user-status-badge-container`}>
                      <span className={`user-status-badge user-status-${user.status ? user.status.toLowerCase() : 'unknown'}`}>
                        {user.status || 'Desconocido'}
                      </span>
                    </td>
                    <td>
                      <div className="action-buttons-group">
                        <Button isLink={true} className="action-link" onClick={() => handleEditUser(user._id)}>Editar</Button>
                        <span className="action-separator">|</span>
                        <Button isLink={true} className="action-link" onClick={() => handleDeleteUser(user._id, user.username)}>Eliminar</Button>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="6" className="no-users-message">No se encontraron usuarios que coincidan con la búsqueda.</td>
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
      </Card>

      {/* COMPONENTE MODAL PARA AÑADIR USUARIO */}
      <Modal
        isOpen={isAddUserModalOpen}
        onClose={() => setIsAddUserModalOpen(false)}
        title="Añadir Nuevo Usuario"
      >
        <form onSubmit={handleCreateUser}>
          <div className="form-group">
            <label htmlFor="username">Nombre de Usuario:</label>
            <input
              type="text"
              id="username"
              name="username" // <-- ¡VERIFICA ESTO! Debe ser 'username'
              value={newUserData.username}
              onChange={handleNewUserFormChange}
              required
            />
          </div>
          <div className="form-group">
            <label htmlFor="email">Email:</label>
            <input
              type="email"
              id="email"
              name="email" // <-- ¡VERIFICA ESTO! Debe ser 'email'
              value={newUserData.email}
              onChange={handleNewUserFormChange}
              required
            />
          </div>
          <div className="form-group">
            <label htmlFor="password">Contraseña:</label>
            <input
              type="password"
              id="password"
              name="password" // <-- ¡VERIFICA ESTO! Debe ser 'password'
              value={newUserData.password}
              onChange={handleNewUserFormChange}
              required
            />
          </div>
          <div className="form-group">
            <label htmlFor="role">Rol:</label>
            <select
              id="role"
              name="role" // <-- ¡VERIFICA ESTO! Debe ser 'role'
              value={newUserData.role}
              onChange={handleNewUserFormChange}
            >
              {/* Asegúrate de que estos valores coincidan EXACTAMENTE con el enum de tu backend (case-sensitive) */}
              <option value="visualizador">Visualizador</option>
              <option value="editor">Editor</option>
              <option value="fotografo">Fotógrafo</option>
              <option value="admin">Administrador</option>
              <option value="cliente">Cliente</option>
            </select>
          </div>
          <div className="form-group">
            <label htmlFor="status">Estado:</label>
            <select
              id="status"
              name="status" // <-- ¡VERIFICA ESTO! Debe ser 'status'
              value={newUserData.status}
              onChange={handleNewUserFormChange}
            >
              <option value="Activo">Activo</option>
              <option value="Inactivo">Inactivo</option>
            </select>
          </div>
          <div className="modal-actions">
            <Button type="submit">Crear Usuario</Button>
            <Button type="button" onClick={() => setIsAddUserModalOpen(false)} className="cancel-button">Cancelar</Button>
          </div>
        </form>
      </Modal>
    </div>
  );
}

export default UsersPage;