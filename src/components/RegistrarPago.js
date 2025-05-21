import React, { useState } from 'react';

const RegistrarPago = () => {
  const [id_cliente, setIdCliente] = useState('');
  const [monto, setMonto] = useState('');
  const [mensaje, setMensaje] = useState('');

  const registrar = async () => {
    const res = await fetch('http://localhost:5000/api/pagos', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id_cliente, monto: parseFloat(monto) })
    });

    const data = await res.json();
    if (res.ok) {
      setMensaje('✅ Pago registrado con éxito');
    } else {
      setMensaje('❌ ' + data.error);
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
      <h3 style={styles.heading}>Registrar Pago</h3>
      <input
        style={styles.input}
        value={id_cliente}
        onChange={e => setIdCliente(e.target.value)}
        placeholder="ID Cliente"
      />
      <input
        style={styles.input}
        value={monto}
        onChange={e => setMonto(e.target.value)}
        placeholder="Monto"
        type="number"
        min="0"
      />
      <button style={styles.button} onClick={registrar}>Registrar</button>
      {mensaje && <p style={styles.mensaje}>{mensaje}</p>}
    </div>
  );
};

export default RegistrarPago;
