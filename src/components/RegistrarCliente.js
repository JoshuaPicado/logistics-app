import React, { useState } from 'react';

const RegistrarCliente = () => {
  const [form, setForm] = useState({
    nombre: '',
    cedula: '',
    telefono: '',
    correo: ''
  });

  const [mensaje, setMensaje] = useState('');
  const [error, setError] = useState('');

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const registrar = async () => {
    try {
      const res = await fetch('http://localhost:5000/api/clientes', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form)
      });

      const data = await res.json();

      if (!res.ok) throw new Error(data.error || 'Error al registrar');

      setMensaje('✅ Cliente registrado con éxito');
      setError('');
      setForm({ nombre: '', cedula: '', telefono: '', correo: '' });

    } catch (err) {
      setMensaje('');
      setError(err.message);
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
      color: 'green',
      marginTop: '10px',
      textAlign: 'center',
    },
    error: {
      color: 'red',
      marginTop: '10px',
      textAlign: 'center',
    }
  };

  return (
    <div style={styles.container}>
      <h2 style={styles.heading}>Registrar Cliente</h2>
      <input
        style={styles.input}
        name="nombre"
        placeholder="Nombre"
        value={form.nombre}
        onChange={handleChange}
      />
      <input
        style={styles.input}
        name="cedula"
        placeholder="Cédula (1-2345-6789)"
        value={form.cedula}
        onChange={handleChange}
      />
      <input
        style={styles.input}
        name="telefono"
        placeholder="Teléfono (8888-8888)"
        value={form.telefono}
        onChange={handleChange}
      />
      <input
        style={styles.input}
        name="correo"
        placeholder="Correo"
        value={form.correo}
        onChange={handleChange}
      />
      <button style={styles.button} onClick={registrar}>Registrar</button>

      {mensaje && <p style={styles.mensaje}>{mensaje}</p>}
      {error && <p style={styles.error}>{error}</p>}
    </div>
  );
};

export default RegistrarCliente;
