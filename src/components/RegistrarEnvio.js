import React, { useState } from 'react';

const RegistrarEnvio = () => {
  const [id_cliente, setIdCliente] = useState('');
  const [qr, setQR] = useState('');

  const enviar = async () => {
    const res = await fetch('http://localhost:5000/api/envios', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id_cliente })
    });
    const data = await res.json();
    if (res.ok) {
      setQR(`✅ QR generado: ${data.qr_code}`);
    } else {
      setQR(`❌ ${data.error}`);
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
      color: qr.startsWith('✅') ? 'green' : 'red',
    }
  };

  return (
    <div style={styles.container}>
      <h3 style={styles.heading}>Registrar Envío</h3>
      <input
        style={styles.input}
        value={id_cliente}
        onChange={e => setIdCliente(e.target.value)}
        placeholder="ID Cliente"
      />
      <button style={styles.button} onClick={enviar}>Generar QR</button>
      {qr && <p style={styles.mensaje}>{qr}</p>}
    </div>
  );
};

export default RegistrarEnvio;
