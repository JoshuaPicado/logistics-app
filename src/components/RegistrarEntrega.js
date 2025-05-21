import React, { useState } from 'react';
import { API_BASE } from '../components/config';

const RegistrarEntrega = ({ sucursal }) => {
  const [id_paquete, setPaquete] = useState('');
  const [estado, setEstado] = useState('Exitoso');
  const [observaciones, setObs] = useState('');
  const [firmaFile, setFirmaFile] = useState(null);
  const [mensaje, setMensaje] = useState('');

  const registrar = () => {
    if (!firmaFile) {
      setMensaje('❌ Debe adjuntar una imagen de firma o comprobante');
      return;
    }

    const reader = new FileReader();
    reader.onloadend = async () => {
      const firmaBase64 = reader.result.split(',')[1]; // Elimina encabezado data:image/...

      try {
        const res = await fetch(`${API_BASE[sucursal]}/entregas`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            id_paquete,
            estado,
            observaciones,
            firma: firmaBase64
          })
        });

        const data = await res.json();
        setMensaje(res.ok ? '✅ Entrega registrada con firma' : '❌ ' + data.error);
      } catch (err) {
        setMensaje('❌ Error al conectar con el servidor');
      }
    };

    reader.readAsDataURL(firmaFile);
  };

  const styles = {
    container: {
      backgroundColor: '#fff',
      padding: '25px',
      borderRadius: '10px',
      boxShadow: '0 0 10px rgba(0,0,0,0.1)',
      maxWidth: '500px',
      margin: '40px auto',
      fontFamily: 'Arial, sans-serif',
    },
    heading: {
      fontSize: '22px',
      fontWeight: 'bold',
      marginBottom: '20px',
      textAlign: 'center',
      color: '#2c3e50',
    },
    input: {
      width: '100%',
      padding: '10px',
      marginBottom: '12px',
      borderRadius: '5px',
      border: '1px solid #ccc',
      fontSize: '15px',
    },
    textarea: {
      width: '100%',
      padding: '10px',
      minHeight: '80px',
      borderRadius: '5px',
      border: '1px solid #ccc',
      fontSize: '15px',
      marginBottom: '12px',
    },
    select: {
      width: '100%',
      padding: '10px',
      marginBottom: '12px',
      borderRadius: '5px',
      border: '1px solid #ccc',
      fontSize: '15px',
    },
    file: {
      marginBottom: '12px',
    },
    button: {
      width: '100%',
      padding: '10px',
      backgroundColor: '#007bff',
      color: 'white',
      border: 'none',
      borderRadius: '5px',
      fontSize: '16px',
      cursor: 'pointer',
    },
    mensaje: {
      color: mensaje.startsWith('✅') ? 'green' : 'red',
      marginTop: '10px',
      textAlign: 'center',
    }
  };

  return (
    <div style={styles.container}>
      <h3 style={styles.heading}>Registrar Entrega ({sucursal})</h3>
      <input
        style={styles.input}
        placeholder="ID Paquete"
        value={id_paquete}
        onChange={e => setPaquete(e.target.value)}
      />
      <select style={styles.select} value={estado} onChange={e => setEstado(e.target.value)}>
        <option>Exitoso</option>
        <option>Fallido</option>
      </select>
      <textarea
        style={styles.textarea}
        placeholder="Observaciones"
        value={observaciones}
        onChange={e => setObs(e.target.value)}
      />
      <input
        type="file"
        accept="image/*"
        style={styles.file}
        onChange={e => setFirmaFile(e.target.files[0])}
      />
      <button style={styles.button} onClick={registrar}>Registrar Entrega</button>
      {mensaje && <p style={styles.mensaje}>{mensaje}</p>}
    </div>
  );
};

export default RegistrarEntrega;
