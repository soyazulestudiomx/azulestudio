// src/App.js
import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

// Componentes de layout
import Sidebar from './components/Layout/Sidebar';
import Header from './components/Layout/Header';
import Button from './components/Common/Button'; // Asegúrate de que este componente exista

import './App.css'; // Tu archivo CSS global de la app

// Importa todas las páginas necesarias
import Dashboard from './components/Dashboard/Dashboard'; // Tu componente de Dashboard
import InventoryPage from './pages/InventoryPage';
import UsersPage from './pages/UsersPage';
import CalendarPage from './pages/CalendarPage';

// Páginas de formulario y detalle para INVENTARIO
import EquipmentDetailsPage from './pages/EquipmentDetailsPage'; // Para ver detalles de un equipo
import EquipmentFormPage from './pages/EquipmentFormPage'; // Para añadir/editar equipos

// ¡NUEVA IMPORTACIÓN PARA USUARIOS!
import UserFormPage from './pages/UserFormPage'; // Para añadir/editar usuarios

// ¡NUEVA IMPORTACIÓN PARA DETALLES DE EVENTOS!
import EventDetailsPage from './pages/EventDetailsPage'; // Importa la nueva página de detalles de eventos

function App() {
  const panelTituloPrincipal = "Panel de Control de FotoStock";
  const [currentUser, setCurrentUser] = useState("Carlos"); // Estado simulado de usuario logueado

  const handleLogout = () => {
    setCurrentUser(null);
    alert("Sesión cerrada. (Simulado)");
  };

  // Lógica de simulación de login/logout
  if (!currentUser) {
    return (
      <div style={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        minHeight: '100vh',
        backgroundColor: 'var(--color-light-gray)',
        flexDirection: 'column',
        gap: '20px'
      }}>
        <h1 style={{ color: 'var(--color-text-dark)' }}>Bienvenido a FotoStock</h1>
        <p style={{ color: 'var(--color-text-light)', fontSize: '1.2rem' }}>Por favor, inicia sesión para continuar.</p>
        <Button type="primary" onClick={() => setCurrentUser("Carlos")}>
            Iniciar Sesión (Simulado)
        </Button>
      </div>
    );
  }

  return (
    <Router>
      <div className="app-container">
        {/* Renderiza Sidebar solo si hay un usuario logueado */}
        {currentUser && <Sidebar />}

        <div className="main-content-area">
          {/* Renderiza Header solo si hay un usuario logueado */}
          {currentUser && (
            <Header
              panelTitle={panelTituloPrincipal}
              userName={currentUser}
              onLogout={handleLogout}
            />
          )}
          <main className="dashboard-content">
            <Routes>
              {/* Rutas principales */}
              <Route path="/" element={<Dashboard />} />

              {/* Rutas para Inventario de Equipo */}
              <Route path="/inventario" element={<InventoryPage />} />
              <Route path="/inventario/añadir" element={<EquipmentFormPage />} />
              <Route path="/inventario/editar/:id" element={<EquipmentFormPage />} />
              <Route path="/inventario/:id" element={<EquipmentDetailsPage />} /> {/* Ruta para ver detalles (si la tienes) */}

              {/* Rutas para Gestión de Usuarios */}
              <Route path="/usuarios" element={<UsersPage />} />
              <Route path="/usuarios/añadir" element={<UserFormPage />} />
              <Route path="/usuarios/editar/:id" element={<UserFormPage />} />

              {/* Rutas para Calendario / Eventos */}
              <Route path="/calendario" element={<CalendarPage />} />
              {/* ¡NUEVA RUTA para detalles de eventos! */}
              <Route path="/events/:id" element={<EventDetailsPage />} /> {/* Importante: El path es '/events' para evitar conflicto con '/calendario' si fueran la misma entidad principal. Dashboard usa '/events' */}

              {/* Ruta para 404 (Página no encontrada) */}
              <Route path="*" element={
                <div style={{ padding: '30px', fontSize: '1.5rem' }}>
                  <h2>404 - Página no encontrada</h2>
                  <p>La URL que intentaste acceder no existe.</p>
                </div>
              } />
            </Routes>
          </main>
        </div>
      </div>
    </Router>
  );
}

export default App;