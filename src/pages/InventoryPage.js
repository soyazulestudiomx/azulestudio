// src/pages/InventoryPage.js
import React, { useState, useEffect } from 'react';
import './InventoryPage.css';
import Button from '../components/Common/Button';
import InventoryFormModal from '../components/Inventory/InventoryFormModal';
import Notification from '../components/Common/Notification';
import Pagination from '../components/Common/Pagination';

// ELIMINA esta línea:
// import JsBarcode from 'jsbarcode';

const EQUIPMENT_CATEGORIES = ['Cámara', 'Lente', 'Iluminación', 'Accesorios', 'Software', 'Otro'];
const EQUIPMENT_STATUS = ['Disponible', 'En Uso', 'En Reparación', 'Baja', 'Perdido'];

function InventoryPage() {
  const [inventory, setInventory] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedEquipment, setSelectedEquipment] = useState(null);
  const [notification, setNotification] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterCategory, setFilterCategory] = useState('Todos');
  const [filterStatus, setFilterStatus] = useState('Todos');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  const API_BASE_URL = 'http://localhost:5001/api/equipment';

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
    fetchInventory();
  }, []);

  const filteredInventory = inventory.filter(item => {
    const matchesSearch = item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          item.serialNumber.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = filterCategory === 'Todos' || item.category === filterCategory;
    const matchesStatus = filterStatus === 'Todos' || item.status === filterStatus;
    return matchesSearch && matchesCategory && matchesStatus;
  });

  const totalPages = Math.ceil(filteredInventory.length / itemsPerPage);
  const paginatedInventory = filteredInventory.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  const handleAddOrUpdateEquipment = async (equipmentData) => {
    try {
      let response;
      if (equipmentData._id) {
        response = await fetch(`${API_BASE_URL}/${equipmentData._id}`, {
          method: 'PATCH',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(equipmentData),
        });
        if (!response.ok) throw new Error('Error al actualizar equipo');
        setNotification({ message: 'Equipo actualizado correctamente.', type: 'success' });
      } else {
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
      setSelectedEquipment(null);
      fetchInventory();
    } catch (error) {
      console.error("Error al guardar equipo:", error);
      setNotification({ message: `Error al guardar equipo: ${error.message}`, type: 'error' });
    }
  };

  const handleDeleteEquipment = async (id, name) => {
    if (window.confirm(`¿Estás seguro de que quieres eliminar ${name}?`)) {
      try {
        const response = await fetch(`${API_BASE_URL}/${id}`, {
          method: 'DELETE',
        });
        if (!response.ok) throw new Error('Error al eliminar equipo');
        setNotification({ message: `${name} eliminado correctamente.`, type: 'success' });
        fetchInventory();
      } catch (error) {
        console.error("Error al eliminar equipo:", error);
        setNotification({ message: `Error al eliminar equipo: ${error.message}`, type: 'error' });
      }
    }
  };

  const handleOpenAddModal = () => {
    setSelectedEquipment(null);
    setIsModalOpen(true);
  };

  const handleOpenEditModal = (equipment) => {
    setSelectedEquipment(equipment);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedEquipment(null);
  };

  const handleCloseNotification = () => {
    setNotification(null);
  };

  const generateAndPrintBarcode = (equipment) => {
    const printWindow = window.open('', '_blank', 'width=400,height=250');
    if (!printWindow) {
      alert('Por favor, permite ventanas emergentes para imprimir el código de barras.');
      return;
    }

    const barcodeValue = equipment.serialNumber || equipment._id;

    const barcodeHtml = `
      <html>
      <head>
          <title>Etiqueta: ${equipment.name}</title>
          <style>
              body {
                  font-family: Arial, sans-serif;
                  display: flex;
                  flex-direction: column;
                  justify-content: center;
                  align-items: center;
                  height: 100vh;
                  margin: 0;
                  padding: 10px;
                  box-sizing: border-box;
                  text-align: center;
              }
              .barcode-container {
                  padding: 5px;
                  width: fit-content;
                  max-width: 90%;
              }
              svg {
                  display: block;
                  margin: 0 auto;
                  width: 100%;
                  height: auto;
              }
              p {
                  margin: 2px 0;
                  font-size: 10px;
                  word-break: break-word;
              }
              @media print {
                  body {
                      margin: 0;
                      padding: 0;
                      -webkit-print-color-adjust: exact;
                      print-color-adjust: exact;
                  }
                  .barcode-container {
                      border: none;
                      page-break-after: avoid;
                  }
              }
          </style>
          <script src="https://cdn.jsdelivr.net/npm/jsbarcode@3.11.5/dist/JsBarcode.all.min.js"></script>
      </head>
      <body>
          <div id="barcode-area" class="barcode-container">
              <p><strong>${equipment.name}</strong></p>
              <svg id="barcode"></svg>
              <p>ID: ${equipment._id}</p>
              ${equipment.serialNumber ? `<p>Serie: ${equipment.serialNumber}</p>` : ''}
          </div>

          <script>
              document.addEventListener('DOMContentLoaded', () => {
                  const barcodeElement = document.getElementById('barcode');
                  const barcodeValueToUse = "${barcodeValue}";
                  if (barcodeValueToUse) {
                      JsBarcode(barcodeElement, barcodeValueToUse, {
                          format: "CODE128",
                          displayValue: true,
                          fontSize: 12,
                          width: 2,
                          height: 60
                      });
                  } else {
                      document.getElementById('barcode-area').innerHTML = '<p>No hay datos válidos para el código de barras.</p>';
                  }
                  setTimeout(() => {
                      if (window) { // Aquí ya estamos en el contexto de la nueva ventana, 'window' es la referencia correcta
                          window.print();
                          window.onafterprint = () => window.close();
                      }
                  }, 200);
              });
          </script>
      </body>
      </html>
    `;

    printWindow.document.write(barcodeHtml);
    printWindow.document.close();
  };

  // ---------------------------------------------------
  // LÓGICA PARA IMPRIMIR MÚLTIPLES ETIQUETAS EN UNA CARTA (CORREGIDA)
  // ---------------------------------------------------
  const generateAndPrintAllBarcodes = () => {
    const printWindow = window.open('', '_blank', 'width=800,height=600');
    if (!printWindow) {
      alert('Por favor, permite ventanas emergentes para imprimir los códigos de barras.');
      return;
    }

    const dataToPrint = filteredInventory; // Usamos los datos ya filtrados/paginados

    // IMPORTANTE: stringify dataToPrint para poder pasarlo al script de la nueva ventana
    const serializedData = JSON.stringify(dataToPrint);

    let allBarcodesHtml = `
      <html>
      <head>
          <title>Imprimir Todas las Etiquetas</title>
          <style>
              body {
                  font-family: Arial, sans-serif;
                  margin: 10mm;
                  padding: 0;
                  box-sizing: border-box;
                  display: grid;
                  grid-template-columns: repeat(auto-fill, minmax(2in, 1fr)); /* Ejemplo: 2in de ancho por etiqueta */
                  gap: 5mm;
                  justify-items: start;
                  align-items: start;
              }
              .barcode-container {
                  padding: 2mm;
                  border: 1px solid #eee;
                  text-align: center;
                  width: 2in; /* Ancho fijo para cada etiqueta en la impresión */
                  height: 1in; /* Altura fija para cada etiqueta en la impresión */
                  box-sizing: border-box;
                  overflow: hidden;
                  page-break-inside: avoid;
              }
              svg {
                  display: block;
                  margin: 0 auto;
                  width: 100%;
                  height: auto;
              }
              p {
                  margin: 1px 0;
                  font-size: 8px;
                  word-break: break-word;
                  line-height: 1.2;
              }
              strong {
                  font-size: 9px;
              }
              @media print {
                  body {
                      margin: 0;
                      padding: 0;
                      display: grid;
                      grid-template-columns: repeat(auto-fill, minmax(2in, 1fr));
                      gap: 5mm;
                      justify-items: start;
                      align-items: start;
                  }
                  .barcode-container {
                      border: none;
                      width: 2in;
                      height: 1in;
                      padding: 2mm;
                      overflow: hidden;
                  }
              }
          </style>
          <script src="https://cdn.jsdelivr.net/npm/jsbarcode@3.11.5/dist/JsBarcode.all.min.js"></script>
      </head>
      <body>
          <div id="all-barcodes-area">
          </div>
          <script>
              document.addEventListener('DOMContentLoaded', () => {
                  const data = ${serializedData}; // <-- AHORA SÍ PASAMOS LOS DATOS SERIALIZADOS Y LOS PARSEAMOS EN EL SCRIPT

                  data.forEach(equipment => {
                      const container = document.createElement('div'); // <-- USAMOS 'document' de la ventana actual
                      container.className = 'barcode-container';
                      const barcodeValue = equipment.serialNumber || equipment._id;

                      container.innerHTML = \`
                          <p><strong>\${equipment.name}</strong></p>
                          <svg id="barcode-\${equipment._id}"></svg>
                          <p>ID: \${equipment._id}</p>
                          \${equipment.serialNumber ? \`<p>Serie: \${equipment.serialNumber}</p>\` : ''}
                      \`;
                      document.getElementById('all-barcodes-area').appendChild(container); // <-- USAMOS 'document' de la ventana actual

                      if (barcodeValue) {
                          JsBarcode(\`#barcode-\${equipment._id}\`, barcodeValue, {
                              format: "CODE128",
                              displayValue: true,
                              fontSize: 10,
                              width: 1.5,
                              height: 40
                          });
                      }
                  });

                  setTimeout(() => {
                      if (window) { // <-- USAMOS 'window' de la ventana actual para imprimir
                          window.print();
                          window.onafterprint = () => window.close();
                      }
                  }, 500);
              });
          </script>
      </body>
      </html>
    `;

    printWindow.document.write(allBarcodesHtml);
    printWindow.document.close();
  };

  return (
    <div className="inventory-page-container">
      {notification && (
        <Notification
          message={notification.message}
          type={notification.type}
          onClose={handleCloseNotification}
        />
      )}

      <div className="inventory-card">
        <div className="inventory-header-section">
          <div className="inventory-title-block">
            <h2>Inventario de Equipo</h2>
            <p>Administra tu equipo fotográfico eficientemente.</p>
          </div>
          <Button onClick={handleOpenAddModal} className="add-button">
            Añadir Equipo
          </Button>
        </div>

        <div className="inventory-controls-section">
          <div className="inventory-search search-bar">
            <input
              type="text"
              placeholder="Buscar equipo..."
              className="search-input"
              value={searchTerm}
              onChange={(e) => {
                setSearchTerm(e.target.value);
                setCurrentPage(1);
              }}
            />
          </div>

          <div className="status-filters">
            {['Todos', ...EQUIPMENT_STATUS].map(status => (
              <Button
                key={status}
                onClick={() => {
                  setFilterStatus(status);
                  setCurrentPage(1);
                }}
                className={filterStatus === status ? 'status-active' : ''}
              >
                {status}
              </Button>
            ))}
          </div>

          <div className="category-filter-control">
            <label htmlFor="category-select" className="filter-label">Categoría:</label>
            <select
              id="category-select"
              value={filterCategory}
              onChange={(e) => {
                setFilterCategory(e.target.value);
                setCurrentPage(1);
              }}
              className="category-select"
            >
              <option value="Todos">Todas las categorías</option>
              {EQUIPMENT_CATEGORIES.map(cat => (
                <option key={cat} value={cat}>{cat}</option>
              ))}
            </select>
          </div>
        </div>

        <div className="print-all-barcodes-section" style={{ textAlign: 'right', marginBottom: '15px' }}>
            <Button onClick={generateAndPrintAllBarcodes} className="secondary-button">
                Imprimir Todas las Etiquetas
            </Button>
        </div>

        <div className="table-responsive">
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
                  <tr key={item._id}>
                    <td data-label="Nombre">{item.name}</td>
                    <td data-label="Cantidad">{item.quantity}</td>
                    <td data-label="Categoría">{item.category || 'N/A'}</td>
                    <td data-label="Estado" className="status-badge-container">
                      <span className={`status-badge status-${item.status.toLowerCase().replace(/\s+/g, '-')}`}>
                        {item.status}
                      </span>
                    </td>
                    <td data-label="Acciones">
                      <div className="action-buttons-group">
                        <Button className="action-link" onClick={() => handleOpenEditModal(item)}>Ver Detalles</Button>
                        <span className="action-separator">|</span>
                        <Button className="action-link" onClick={() => handleDeleteEquipment(item._id, item.name)}>Eliminar</Button>
                        <span className="action-separator">|</span>
                        <Button className="action-link" onClick={() => generateAndPrintBarcode(item)}>Imprimir Etiqueta</Button>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="5" className="no-results-message">No se encontraron equipos que coincidan con los criterios.</td>
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
      </div>

      {isModalOpen && (
        <InventoryFormModal
          onClose={handleCloseModal}
          onSave={handleAddOrUpdateEquipment}
          equipment={selectedEquipment}
          equipmentCategories={EQUIPMENT_CATEGORIES}
          equipmentStatus={EQUIPMENT_STATUS}
        />
      )}
    </div>
  );
}

export default InventoryPage;