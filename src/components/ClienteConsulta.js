import React, { useState } from 'react';

const ClienteConsulta = () => {
  const [cedula, setCedula] = useState('');
  const [cliente, setCliente] = useState(null);
  const [error, setError] = useState('');

  const buscarCliente = async () => {
    try {
      const res = await fetch(`http://localhost:5000/api/cliente/${cedula}`);
      const data = await res.json();

      if (!res.ok) throw new Error(data.error || 'Error al consultar');

      setCliente(data);
      setError('');
    } catch (err) {
      setCliente(null);
      setError(err.message);
    }
  };

  const styles = {
    container: {
      backgroundColor: '#fff',
      padding: '20px',
      borderRadius: '8px',
      boxShadow: '0 0 10px rgba(0,0,0,0.1)',
      maxWidth: '500px',
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
    result: {
      marginTop: '20px',
      borderTop: '1px solid #ccc',
      paddingTop: '10px',
    },
    label: {
      fontWeight: 'bold',
      color: '#2c3e50',
    }
  };

  return (
    <div style={styles.container}>
      <h2 style={styles.heading}>Consulta de Cliente</h2>
      <input
        type="text"
        placeholder="Cédula (ej: 1-2345-6789)"
        value={cedula}
        onChange={(e) => setCedula(e.target.value)}
        style={styles.input}
      />
      <button onClick={buscarCliente} style={styles.button}>Buscar</button>

      {error && <p style={styles.error}>{error}</p>}

      {cliente && (
        <div style={styles.result}>
          <p><span style={styles.label}>Nombre:</span> {cliente.nombre}</p>
          <p><span style={styles.label}>Correo:</span> {cliente.correo}</p>
          <p><span style={styles.label}>Saldo:</span> ₡{parseFloat(cliente.saldo).toFixed(2)}</p>
        </div>
      )}
    </div>
  );
};

export default ClienteConsulta;
