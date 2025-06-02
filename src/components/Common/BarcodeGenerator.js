// src/components/Common/BarcodeGenerator.js
import React, { useRef, useEffect } from 'react';
import JsBarcode from 'jsbarcode'; // Importa la librería
import './BarcodeGenerator.css'; // Asegúrate de crear este archivo CSS

/**
 * Componente para generar y mostrar un código de barras.
 * @param {object} props
 * @param {string} props.value - El valor a codificar en el código de barras (ej. ID del producto).
 * @param {string} [props.format='CODE128'] - El formato del código de barras (ej. 'CODE128', 'EAN13', 'UPC').
 * @param {number} [props.width=2] - Ancho de la barra más delgada.
 * @param {number} [props.height=100] - Altura del código de barras.
 * @param {string} [props.displayValue=true] - Mostrar o no el valor de texto debajo del código.
 * @param {string} [props.font='monospace'] - Fuente para el valor de texto.
 * @param {number} [props.fontSize=18] - Tamaño de fuente para el valor de texto.
 * @param {string} [props.lineColor='#000'] - Color de las barras.
 * @param {string} [props.background='#fff'] - Color de fondo.
 */
function BarcodeGenerator({
  value,
  format = 'CODE128', // CODE128 es un formato versátil para datos alfanuméricos
  width = 2,
  height = 100,
  displayValue = true,
  font = 'monospace',
  fontSize = 18,
  lineColor = '#000',
  background = '#fff',
  // Otros parámetros de JsBarcode pueden ser añadidos aquí
}) {
  const barcodeRef = useRef(null); // Referencia al elemento SVG

  useEffect(() => {
    if (barcodeRef.current && value) {
      try {
        JsBarcode(barcodeRef.current, String(value), {
          format: format,
          width: width,
          height: height,
          displayValue: displayValue,
          font: font,
          fontSize: fontSize,
          lineColor: lineColor,
          background: background,
        });
      } catch (error) {
        console.error("Error generating barcode:", error);
      }
    }
  }, [value, format, width, height, displayValue, font, fontSize, lineColor, background]);

  if (!value) {
    return <div className="barcode-placeholder">No hay valor para generar código de barras.</div>;
  }

  return (
    <div className="barcode-container">
      <svg ref={barcodeRef}></svg> {/* Aquí se renderizará el código de barras */}
    </div>
  );
}

export default BarcodeGenerator;