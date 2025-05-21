import React, { useState } from 'react';
import { API_BASE } from '../components/config';

const RegistrarPaquete = ({ sucursal }) => {
  const [id_envio_central, setIdEnvioCentral] = useState('');
  const [estado, setEstado] = useState('');
  const [mensaje, setMensaje] = useState('');

  const registrar = async () => {
    try {
      const res = await fetch(`${API_BASE[sucursal]}/paquetes`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id_envio_central, estado_local: estado })
      });
      const data = await res.json();
      setMensaje(res.ok ? '✅ Paquete registrado' : '❌ ' + data.error);
    } catch (err) {
      setMensaje('❌ Error al conectar con el servidor');
    }
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
    select: {
      width: '100%',
      padding: '10px',
      marginBottom: '12px',
      borderRadius: '5px',
      border: '1px solid #ccc',
      fontSize: '15px',
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
      marginTop: '15px',
      textAlign: 'center',
      color: mensaje.startsWith('✅') ? 'green' : 'red',
    }
  };

  return (
    <div style={styles.container}>
      <h3 style={styles.heading}>Registrar Paquete ({sucursal})</h3>
      <input
        style={styles.input}
        placeholder="ID Envío Central"
        value={id_envio_central}
        onChange={e => setIdEnvioCentral(e.target.value)}
      />
      <select
        style={styles.select}
        value={estado}
        onChange={e => setEstado(e.target.value)}
      >
        <option value="">Seleccione estado</option>
        <option value="Recibido">Recibido</option>
        <option value="En Ruta">En Ruta</option>
      </select>
      <button style={styles.button} onClick={registrar}>Registrar</button>
      {mensaje && <p style={styles.mensaje}>{mensaje}</p>}
    </div>
  );
};

export default RegistrarPaquete;
