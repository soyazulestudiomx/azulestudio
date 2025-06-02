// src/data/userData.js

const LOCAL_STORAGE_USER_KEY = 'photoStockUsers'; // Clave única para localStorage

// Datos iniciales para cuando el localStorage de usuarios esté vacío
const initialUsersData = [
  { id: 1, name: 'Alice Smith', email: 'alice.s@example.com', role: 'Administrador', status: 'Activo' },
  { id: 2, name: 'Bob Johnson', email: 'bob.j@example.com', role: 'Editor', status: 'Activo' },
  { id: 3, name: 'Charlie Brown', email: 'charlie.b@example.com', role: 'Visualizador', status: 'Inactivo' },
  { id: 4, name: 'Diana Prince', email: 'diana.p@example.com', role: 'Editor', status: 'Activo' },
  { id: 5, name: 'Eve Adams', email: 'eve.a@example.com', role: 'Visualizador', status: 'Activo' },
  { id: 6, name: 'Frank White', email: 'frank.w@example.com', role: 'Administrador', status: 'Activo' },
  { id: 7, name: 'Grace Lee', email: 'grace.l@example.com', role: 'Editor', status: 'Inactivo' },
];

// Función para cargar los usuarios desde localStorage o los datos iniciales
const loadUsers = () => {
  try {
    const storedUsers = localStorage.getItem(LOCAL_STORAGE_USER_KEY);
    if (storedUsers) {
      return JSON.parse(storedUsers);
    }
  } catch (error) {
    console.error("Error loading users from localStorage:", error);
  }
  // Si no hay datos en localStorage o hay un error, se inicializa
  localStorage.setItem(LOCAL_STORAGE_USER_KEY, JSON.stringify(initialUsersData));
  return initialUsersData;
};

// Variable para mantener el estado actual de los usuarios en memoria
let currentUsers = loadUsers();

// Función auxiliar para guardar los usuarios en localStorage
const saveUsers = () => {
  localStorage.setItem(LOCAL_STORAGE_USER_KEY, JSON.stringify(currentUsers));
};

export const getUsersData = () => {
  return [...currentUsers]; // Devuelve una copia para evitar mutaciones directas
};

export const addUser = (newUser) => {
  const newId = currentUsers.length > 0
    ? Math.max(...currentUsers.map(user => user.id)) + 1
    : 1;

  const userToAdd = { ...newUser, id: newId };
  currentUsers.push(userToAdd);
  saveUsers();
  return userToAdd;
};

export const updateUser = (updatedUser) => {
  const index = currentUsers.findIndex(user => user.id === updatedUser.id);
  if (index !== -1) {
    currentUsers[index] = { ...currentUsers[index], ...updatedUser };
    saveUsers();
    return currentUsers[index];
  }
  return null;
};

export const deleteUser = (idToDelete) => {
  const initialLength = currentUsers.length;
  currentUsers = currentUsers.filter(user => user.id !== idToDelete);
  if (currentUsers.length < initialLength) {
    saveUsers();
    return true;
  }
  return false;
};

export const getUserById = (id) => {
  return currentUsers.find(user => user.id === parseInt(id));
};