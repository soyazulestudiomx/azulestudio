// src/data/inventoryData.js

const LOCAL_STORAGE_KEY = 'photoStockInventory'; // Clave única para localStorage

// Datos iniciales para cuando el localStorage esté vacío
// Estos datos se cargarán solo la primera vez que se ejecute la aplicación
const initialInventoryData = [
  {
      id: 1,
      name: 'Cámara Canon EOS R5',
      quantity: 1,
      status: 'Disponible',
      image: 'https://images.unsplash.com/photo-1519638833923-0108605c3664?q=80&w=2940&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
      model: 'EOS R5',
      serialNumber: 'R5-00123456789',
      location: 'Estudio Principal',
      description: 'Cámara mirrorless de fotograma completo de alta resolución, ideal para fotografía profesional y video 8K.',
      additionalInfo: 'Incluye batería LP-E6NH y cargador.',
      category: 'Cámara',
  },
  {
      id: 2,
      name: 'Lente Canon RF 24-70mm',
      quantity: 1,
      status: 'En uso',
      image: 'https://images.unsplash.com/photo-1620601633519-c0c4516223b5?q=80&w=2940&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
      model: 'RF 24-70mm f/2.8L IS USM',
      serialNumber: 'RF2470-987654321',
      location: 'En Sesión (Exterior)',
      description: 'Lente zoom estándar profesional con apertura constante f/2.8 y estabilización de imagen, versátil para diversas situaciones.',
      additionalInfo: 'Filtro UV protector de 82mm incluido.',
      category: 'Lente',
  },
  {
      id: 3,
      name: 'Trípode Manfrotto 055',
      quantity: 3,
      status: 'Disponible',
      image: 'https://images.unsplash.com/photo-1616781280053-d1f893f4e240?q=80&w=2940&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
      model: 'Manfrotto 055XPRO3',
      serialNumber: 'M055-TRP-001',
      location: 'Almacén',
      description: 'Trípode robusto de aluminio con columna central de 90 grados, ideal para fotografía macro y de estudio.',
      additionalInfo: 'Incluye rótula de bola 327RC2.',
      category: 'Estabilización',
  },
  {
      id: 4,
      name: 'Flash Godox V860II',
      quantity: 2,
      status: 'En reparación',
      image: 'https://images.unsplash.com/photo-1596706037042-4f3b2e53e4b7?q=80&w=2940&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
      model: 'Godox V860II-C',
      serialNumber: 'GODOX-V860-R1',
      location: 'Servicio Técnico',
      description: 'Flash de cámara con batería de litio de alta capacidad y sistema inalámbrico 2.4G integrado.',
      additionalInfo: 'Requiere revisión del cabezal de flash.',
      category: 'Iluminación',
  },
  {
      id: 5,
      name: 'Batería Canon LP-E6NH',
      quantity: 5,
      status: 'Baja carga',
      image: 'https://via.placeholder.com/200x150/f0f0f0/333?text=Bater%C3%ADa',
      model: 'LP-E6NH',
      serialNumber: 'BATT-LP-E6NH-005',
      location: 'Cargando',
      description: 'Batería de iones de litio de alta capacidad para cámaras Canon EOS R5/R6.',
      additionalInfo: 'Se recomienda cargar completamente antes de usar.',
      category: 'Accesorios',
  },
];

// Función para cargar el inventario desde localStorage o los datos iniciales
const loadInventory = () => {
  try {
    const storedInventory = localStorage.getItem(LOCAL_STORAGE_KEY);
    if (storedInventory) {
      return JSON.parse(storedInventory);
    }
  } catch (error) {
    console.error("Error loading inventory from localStorage:", error);
    // En caso de error (ej. JSON corrupto), se retorna el inventario inicial
  }
  // Si no hay datos en localStorage o hay un error, se inicializa
  localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(initialInventoryData));
  return initialInventoryData;
};

// Variable para mantener el estado actual del inventario en memoria
let currentInventory = loadInventory();

// Función auxiliar para guardar el inventario en localStorage
const saveInventory = () => {
  localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(currentInventory));
};

export const getInventoryData = () => {
  return [...currentInventory]; // Devuelve una copia para evitar mutaciones directas
};

export const addInventoryItem = (newItem) => {
  // Genera un ID simple, asegurándose de que sea único y un número.
  // Si los IDs son números, buscar el máximo y sumar 1.
  const newId = currentInventory.length > 0
    ? Math.max(...currentInventory.map(item => item.id)) + 1
    : 1;

  const equipmentToAdd = { ...newItem, id: newId, quantity: parseInt(newItem.quantity) };
  currentInventory.push(equipmentToAdd);
  saveInventory(); // Guarda el inventario actualizado
  return equipmentToAdd; // Retorna el item añadido (útil para el feedback)
};

export const updateInventoryItem = (updatedItem) => {
  const index = currentInventory.findIndex(item => item.id === updatedItem.id);
  if (index !== -1) {
    // Asegura que quantity sea un número
    currentInventory[index] = { ...currentInventory[index], ...updatedItem, quantity: parseInt(updatedItem.quantity) };
    saveInventory(); // Guarda el inventario actualizado
    return currentInventory[index]; // Retorna el item actualizado (útil para el feedback)
  }
  return null; // Retorna null si no se encontró el item
};

export const deleteInventoryItem = (idToDelete) => {
  const initialLength = currentInventory.length;
  currentInventory = currentInventory.filter(item => item.id !== idToDelete);
  if (currentInventory.length < initialLength) {
    saveInventory(); // Guarda el inventario actualizado solo si hubo un cambio
    return true; // Indica éxito
  }
  return false; // Indica que el item no fue encontrado o no se eliminó
};

export const getEquipmentById = (id) => {
  return currentInventory.find(item => item.id === parseInt(id));
};