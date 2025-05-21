import React, { useState } from 'react';

const HistorialEnvios = () => {
  const [id_cliente, setIdCliente] = useState('');
  const [historial, setHistorial] = useState([]);
  const [error, setError] = useState('');

  const consultar = async () => {
    try {
      const res = await fetch(`http://localhost:5000/api/historial/${id_cliente}`);
      const data = await res.json();
      if (res.ok) {
        setHistorial(data);
        setError('');
      } else {
        setHistorial([]);
        setError(data.error || 'Error al consultar');
      }
    } catch (err) {
      setHistorial([]);
      setError('Error al conectar con el servidor');
    }
  };

  const styles = {
    container: {
      backgroundColor: '#fff',
      padding: '20px',
      borderRadius: '8px',
      boxShadow: '0 0 10px rgba(0,0,0,0.1)',
      maxWidth: '600px',
      margin: '30px auto',
      fontFamily: 'Arial, sans-serif',
    },
    heading: {
      fontSize: '20px',
      fontWeight: 'bold',
      marginBottom: '15px',
      textAlign: 'center',
      color: '#2c3e50',
    },
    input: {
      width: '100%',
      padding: '10px',
      marginBottom: '10px',
      borderRadius: '4px',
      border: '1px solid #ccc',
    },
    button: {
      width: '100%',
      padding: '10px',
      backgroundColor: '#3498db',
      color: 'white',
      border: 'none',
      borderRadius: '4px',
      cursor: 'pointer',
      fontSize: '15px',
    },
    error: {
      color: 'red',
      textAlign: 'center',
      marginTop: '10px',
    },
    list: {
      marginTop: '20px',
      listStyle: 'none',
      padding: 0,
    },
    listItem: {
      padding: '10px',
      borderBottom: '1px solid #eee',
      fontSize: '14px',
    },
  };

  return (
    <div style={styles.container}>
      <h3 style={styles.heading}>Historial de Envíos</h3>
      <input
        style={styles.input}
        value={id_cliente}
        onChange={e => setIdCliente(e.target.value)}
        placeholder="ID Cliente"
      />
      <button style={styles.button} onClick={consultar}>Consultar</button>
      {error && <p style={styles.error}>{error}</p>}

      {historial.length > 0 && (
        <ul style={styles.list}>
          {historial.map((h, i) => (
            <li key={i} style={styles.listItem}>
              <strong>QR:</strong> {h.qr_code} | <strong>Estado:</strong> {h.estado} | <strong>Fecha:</strong> {h.fecha}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default HistorialEnvios;
