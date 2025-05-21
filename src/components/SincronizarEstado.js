import React, { useState } from 'react';

const SincronizarEstado = () => {
  const [qr_code, setQR] = useState('');
  const [estado, setEstado] = useState('En Ruta');
  const [mensaje, setMensaje] = useState('');

  const sincronizar = async () => {
    const res = await fetch('http://localhost:5001/api/sync', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ qr_code, estado })
    });
    const data = await res.json();
    setMensaje(res.ok ? '✅ Sincronizado con éxito' : '❌ ' + data.error);
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
      backgroundColor: '#28a745',
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
      <h3 style={styles.heading}>Sincronizar Estado con Nodo Central</h3>
      <input
        style={styles.input}
        placeholder="Código QR"
        value={qr_code}
        onChange={e => setQR(e.target.value)}
      />
      <select
        style={styles.select}
        value={estado}
        onChange={e => setEstado(e.target.value)}
      >
        <option>Recibido</option>
        <option>En Ruta</option>
        <option>Entregado</option>
        <option>Fallido</option>
      </select>
      <button style={styles.button} onClick={sincronizar}>Sincronizar</button>
      {mensaje && <p style={styles.mensaje}>{mensaje}</p>}
    </div>
  );
};

export default SincronizarEstado;
