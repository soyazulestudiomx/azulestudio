// src/pages/UserFormPage.js
import React, { useState, useEffect, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Card from '../components/Common/Card'; // Asumo que este componente existe
import Button from '../components/Common/Button';
import NotificationMessage from '../components/Common/NotificationMessage';
import './UserFormPage.css'; // Asegúrate de crear este archivo CSS

// Ya no necesitas importar funciones de userData si vas a usar la API
// import { getUserById, addUser, updateUser } from '../data/userData';

function UserFormPage() {
  const { id } = useParams(); // Obtiene el ID de la URL si existe (para edición)
  const navigate = useNavigate();

  const [user, setUser] = useState({
    name: '',
    email: '',
    role: 'Visualizador', // Valor por defecto
    status: 'Activo', // Valor por defecto
    password: '' // Añadir campo de contraseña para el registro inicial o cambio de contraseña
  });
  const [isEditing, setIsEditing] = useState(false);
  const [notification, setNotification] = useState(null);

  const USERS_API_URL = 'http://localhost:5001/api/users'; // URL de tu API de usuarios

  // Cargar datos del usuario si estamos en modo edición
  useEffect(() => {
    if (id) {
      setIsEditing(true);
      const fetchUser = async () => {
        try {
          const response = await fetch(`${USERS_API_URL}/${id}`);
          if (!response.ok) {
            if (response.status === 404) {
                setNotification({ message: 'Usuario no encontrado.', type: 'error' });
                // setTimeout(() => navigate('/usuarios'), 1500); // Redirigir si no existe
            }
            throw new Error(`HTTP error! status: ${response.status}`);
          }
          const data = await response.json();
          setUser({
            name: data.name || '',
            email: data.email || '',
            role: data.role || 'Visualizador',
            status: data.status || 'Activo',
            password: '' // No precargamos la contraseña por seguridad
          });
        } catch (error) {
          console.error("Error fetching user:", error);
          setNotification({ message: 'Error al cargar los datos del usuario.', type: 'error' });
        }
      };
      fetchUser();
    } else {
      setIsEditing(false);
      // Resetear formulario si no estamos editando (ej. si venimos de editar a añadir)
      setUser({ name: '', email: '', role: 'Visualizador', status: 'Activo', password: '' });
    }
  }, [id, navigate]); // Depende de 'id' y 'navigate'

  // Manejar cambios en los inputs del formulario
  const handleChange = useCallback((e) => {
    const { name, value } = e.target;
    setUser(prevUser => ({
      ...prevUser,
      [name]: value
    }));
  }, []);

  // Manejar el envío del formulario
  const handleSubmit = useCallback(async (e) => { // Añadir async aquí
    e.preventDefault();

    if (!user.name || !user.email || !user.role || !user.status) {
      setNotification({ message: 'Todos los campos obligatorios deben ser completados.', type: 'error' });
      return;
    }

    // Si es un nuevo usuario, la contraseña es obligatoria
    if (!isEditing && !user.password) {
        setNotification({ message: 'La contraseña es obligatoria para nuevos usuarios.', type: 'error' });
        return;
    }

    // Clonar el usuario para no modificar el estado directamente
    const userDataToSubmit = { ...user };

    // Si no estamos editando Y no hay contraseña, eliminarla del objeto (no deberíamos enviarla vacía)
    // Opcional: si la contraseña es vacía en edición, no enviarla para no cambiarla.
    if (isEditing && !userDataToSubmit.password) {
        delete userDataToSubmit.password; // No enviar campo de contraseña si está vacío en edición
    }

    try {
      let response;
      if (isEditing) {
        response = await fetch(`${USERS_API_URL}/${id}`, {
          method: 'PATCH', // Usar PATCH para actualizar parcialmente
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(userDataToSubmit),
        });
        if (!response.ok) throw new Error('Error al actualizar el usuario');
        setNotification({ message: `Usuario "${user.name}" actualizado correctamente.`, type: 'success' });
      } else {
        response = await fetch(USERS_API_URL, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(userDataToSubmit),
        });
        if (!response.ok) throw new Error('Error al añadir el usuario');
        setNotification({ message: `Usuario "${user.name}" añadido correctamente.`, type: 'success' });
        setUser({ name: '', email: '', role: 'Visualizador', status: 'Activo', password: '' }); // Limpiar formulario
      }
      setTimeout(() => {
        navigate('/usuarios');
      }, 1500);
    } catch (error) {
      console.error("Error saving user:", error);
      setNotification({ message: `Error al ${isEditing ? 'actualizar' : 'añadir'} el usuario: ${error.message}`, type: 'error' });
    }
  }, [user, isEditing, navigate, id]); // Añadir 'id' a las dependencias del useCallback

  // Función para cerrar la notificación
  const handleCloseNotification = useCallback(() => {
    setNotification(null);
  }, []);

  return (
    <div className="user-form-page-container">
      {notification && (
        <Notification
          message={notification.message}
          type={notification.type}
          onClose={handleCloseNotification}
        />
      )}
      <Card className="user-form-card">
        <h2>{isEditing ? 'Editar Usuario' : 'Añadir Nuevo Usuario'}</h2>
        <form onSubmit={handleSubmit} className="user-form">
          <div className="form-group">
            <label htmlFor="name">Nombre:</label>
            <input
              type="text"
              id="name"
              name="name"
              value={user.name}
              onChange={handleChange}
              placeholder="Nombre completo del usuario"
              required
            />
          </div>
          <div className="form-group">
            <label htmlFor="email">Email:</label>
            <input
              type="email"
              id="email"
              name="email"
              value={user.email}
              onChange={handleChange}
              placeholder="correo@ejemplo.com"
              required
            />
          </div>
          <div className="form-group">
            <label htmlFor="password">Contraseña {isEditing ? '(dejar vacío para no cambiar)' : '*'}:</label>
            <input
              type="password"
              id="password"
              name="password"
              value={user.password}
              onChange={handleChange}
              placeholder={isEditing ? "Dejar vacío para no cambiar" : "Contraseña del usuario"}
              required={!isEditing} // Contraseña requerida solo al añadir
            />
          </div>
          <div className="form-group">
            <label htmlFor="role">Rol:</label>
            <select
              id="role"
              name="role"
              value={user.role}
              onChange={handleChange}
              required
            >
              <option value="Administrador">Administrador</option>
              <option value="Editor">Editor</option>
              <option value="Visualizador">Visualizador</option>
            </select>
          </div>
          <div className="form-group">
            <label htmlFor="status">Estado:</label>
            <select
              id="status"
              name="status"
              value={user.status}
              onChange={handleChange}
              required
            >
              <option value="Activo">Activo</option>
              <option value="Inactivo">Inactivo</option>
            </select>
          </div>
          <div className="form-actions">
            <Button type="button" onClick={() => navigate('/usuarios')} className="secondary-button">Cancelar</Button> {/* Cambiado type a "button" */}
            <Button type="submit" className="primary-button"> {/* Cambiado type a "submit" */}
              {isEditing ? 'Guardar Cambios' : 'Añadir Usuario'}
            </Button>
          </div>
        </form>
      </Card>
    </div>
  );
}

export default UserFormPage;