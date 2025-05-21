import React, { useState } from 'react';
import { API_BASE } from '../components/config';

const AsignarRuta = ({ sucursal }) => {
  const [id_paquete, setPaquete] = useState('');
  const [id_vehiculo, setVehiculo] = useState('');
  const [id_ruta, setRuta] = useState('');
  const [mensaje, setMensaje] = useState('');

  const asignar = async () => {
    try {
      const res = await fetch(`${API_BASE[sucursal]}/asignaciones`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id_paquete, id_vehiculo, id_ruta })
      });
      const data = await res.json();
      setMensaje(res.ok ? '✅ Asignación registrada' : '❌ ' + data.error);
    } catch (err) {
      setMensaje('❌ Error al conectar con el servidor');
    }
  };

  // 🎨 Estilos manuales
  const styles = {
    container: {
      backgroundColor: '#ffffff',
      padding: '20px',
      borderRadius: '8px',
      marginTop: '20px',
      boxShadow: '0 0 10px rgba(0,0,0,0.1)',
      maxWidth: '500px',
      marginLeft: 'auto',
      marginRight: 'auto',
      fontFamily: 'Arial, sans-serif',
    },
    heading: {
      fontSize: '20px',
      fontWeight: 'bold',
      marginBottom: '20px',
      textAlign: 'center',
      color: '#2c3e50',
    },
    input: {
      width: '100%',
      padding: '10px',
      marginBottom: '10px',
      borderRadius: '4px',
      border: '1px solid #ccc',
      fontSize: '14px',
    },
    button: {
      padding: '10px 16px',
      backgroundColor: '#3498db',
      color: 'white',
      border: 'none',
      borderRadius: '4px',
      cursor: 'pointer',
      width: '100%',
    },
    message: {
      marginTop: '10px',
      fontWeight: 'bold',
      textAlign: 'center',
    },
  };

  return (
    <div style={styles.container}>
      <h3 style={styles.heading}>Asignar Ruta ({sucursal})</h3>
      <input
        style={styles.input}
        placeholder="ID Paquete"
        value={id_paquete}
        onChange={e => setPaquete(e.target.value)}
      />
      <input
        style={styles.input}
        placeholder="ID Vehículo"
        value={id_vehiculo}
        onChange={e => setVehiculo(e.target.value)}
      />
      <input
        style={styles.input}
        placeholder="ID Ruta"
        value={id_ruta}
        onChange={e => setRuta(e.target.value)}
      />
      <button style={styles.button} onClick={asignar}>Asignar</button>
      <p style={styles.message}>{mensaje}</p>
    </div>
  );
};

export default AsignarRuta;
