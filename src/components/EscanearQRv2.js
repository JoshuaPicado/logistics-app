// src/components/EscanearQRv2.js
import React, { useEffect, useRef, useState } from 'react';
import { Html5Qrcode } from 'html5-qrcode';

const EscanearQRv2 = () => {
  const [resultado, setResultado] = useState('');
  const qrRef = useRef(null);
  const scannerRef = useRef(null);

  useEffect(() => {
    const config = { fps: 10, qrbox: 250 };
    const scanner = new Html5Qrcode("reader");

    scannerRef.current = scanner;

    scanner.start(
      { facingMode: "environment" },
      config,
      async (decodedText) => {
        setResultado(`Código leído: ${decodedText}`);
        scanner.stop();  // detener escaneo al leer
        // aquí podés hacer fetch al backend usando el QR
      },
      (error) => {
        // ignorar errores de escaneo
      }
    );

    return () => {
      scanner.stop().catch(() => {});
    };
  }, []);

  return (
    <div style={{ textAlign: 'center' }}>
      <h3>Escanear QR (Método Alternativo)</h3>
      <div id="reader" style={{ width: "300px", margin: "auto" }}></div>
      <p>{resultado}</p>
    </div>
  );
};

export default EscanearQRv2;
