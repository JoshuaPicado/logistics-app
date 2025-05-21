import React, { useEffect, useRef, useState } from 'react';
import { BrowserMultiFormatReader } from '@zxing/library';

const ValidarQR = () => {
  const [resultado, setResultado] = useState('');
  const videoRef = useRef(null);
  const codeReader = useRef(null);

  useEffect(() => {
    codeReader.current = new BrowserMultiFormatReader();

    codeReader.current
      .listVideoInputDevices()
      .then((videoInputDevices) => {
        if (videoInputDevices.length === 0) {
          setResultado('❌ No se encontró cámara');
          return;
        }
        // Selecciona la cámara trasera si existe
        const camara = videoInputDevices.find(device =>
          device.label.toLowerCase().includes('back')) || videoInputDevices[0];

        codeReader.current.decodeFromVideoDevice(
          camara.deviceId,
          videoRef.current,
          (result, err) => {
            if (result) {
              setResultado(`✅ Código QR detectado: ${result.getText()}`);
              codeReader.current.reset(); // Para detener la cámara después de detectar
              // Aquí puedes llamar a validarPaquete(result.getText()) si tienes lógica extra
            }
            if (err && !(err.name === 'NotFoundException')) {
              console.error(err);
            }
          }
        );
      })
      .catch((err) => {
        setResultado(`❌ Error al acceder a la cámara: ${err.message}`);
      });

    return () => {
      if (codeReader.current) {
        codeReader.current.reset();
      }
    };
  }, []);

  return (
    <div style={{ textAlign: 'center', padding: 20 }}>
      <h3>Escanear Código QR</h3>
      <video ref={videoRef} style={{ width: 300, height: 300, border: '1px solid #ccc' }} />
      <p style={{ whiteSpace: 'pre-wrap', marginTop: 10 }}>{resultado}</p>
    </div>
  );
};

export default ValidarQR;
