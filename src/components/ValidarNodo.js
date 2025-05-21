import React, { useState } from 'react';

const ValidarNodo = () => {
  const [form, setForm] = useState({ ip: '', token: '' });
  const [respuesta, setRespuesta] = useState('');

  const handleChange = e => setForm({ ...form, [e.target.name]: e.target.value });

  const validar = async () => {
    const res = await fetch('http://localhost:5000/api/validar-nodo', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(form)
    });
    const data = await res.json();
    setRespuesta(
      res.ok
        ? (data.valido ? `✅ Nodo válido. ID: ${data.id_nodo}` : '❌ Nodo no válido')
        : '❌ Error'
    );
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
    respuesta: {
      marginTop: '15px',
      textAlign: 'center',
      color: respuesta.startsWith('✅') ? 'green' : 'red',
    }
  };

  return (
    <div style={styles.container}>
      <h3 style={styles.heading}>Validar Nodo</h3>
      <input
        name="ip"
        placeholder="IP del nodo"
        value={form.ip}
        onChange={handleChange}
        style={styles.input}
      />
      <input
        name="token"
        placeholder="Token de acceso"
        value={form.token}
        onChange={handleChange}
        style={styles.input}
      />
      <button style={styles.button} onClick={validar}>Validar</button>
      {respuesta && <p style={styles.respuesta}>{respuesta}</p>}
    </div>
  );
};

export default ValidarNodo;
