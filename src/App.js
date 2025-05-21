import React, { useState } from 'react';

// Componentes nodo central
import RegistrarCliente from './components/RegistrarCliente';
import ConsultarCliente from './components/ClienteConsulta';
import RegistrarPago from './components/RegistrarPago';
import RegistrarEnvio from './components/RegistrarEnvio';
import HistorialEnvios from './components/HistorialEnvios';
import ValidarNodo from './components/ValidarNodo';
import ValidarQR from './components/ValidarQR';

// Componentes nodo local
import RegistrarPaquete from './components/RegistrarPaquete';
import AsignarRuta from './components/AsignarRuta';
import RegistrarEntrega from './components/RegistrarEntrega';

const styles = {
  container: {
    padding: '20px',
    fontFamily: 'Arial, sans-serif',
    textAlign: 'center',
  },
  title: {
    fontSize: '24px',
    fontWeight: 'bold',
    marginBottom: '10px',
    color: '#2c3e50',
  },
  subtitle: {
    fontSize: '18px',
    marginBottom: '10px',
    color: '#34495e',
  },
  button: {
    padding: '10px 16px',
    margin: '5px',
    backgroundColor: '#3498db',
    color: 'white',
    border: 'none',
    borderRadius: '4px',
    cursor: 'pointer',
  },
  buttonGroup: {
    marginTop: '15px',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'flex-start',
  },
  panel: {
    backgroundColor: '#fff',
    padding: '20px',
    borderRadius: '6px',
    boxShadow: '0 0 10px rgba(0,0,0,0.1)',
    maxWidth: '600px',
    margin: 'auto',
  },
  centered: {
    textAlign: 'center',
    marginTop: '50px',
  },
};

function App() {
  const [vista, setVista] = useState('inicio'); // 'inicio', 'central', 'fortuna', 'florencia'
  const [seccionCentral, setSeccionCentral] = useState('');
  const [seccionFortuna, setSeccionFortuna] = useState('');
  const [seccionFlorencia, setSeccionFlorencia] = useState('');

  // Volver un nivel atrás según contexto actual
  const handleVolver = () => {
    if (vista === 'inicio') return; // no hacer nada si ya estás en la inicial general

    // Si estás en una sub-sección (una opción) de alguna sucursal, limpiar esa sección y volver al menú sucursal
    if (vista === 'central' && seccionCentral !== '') {
      setSeccionCentral('');
      return;
    }
    if (vista === 'fortuna' && seccionFortuna !== '') {
      setSeccionFortuna('');
      return;
    }
    if (vista === 'florencia' && seccionFlorencia !== '') {
      setSeccionFlorencia('');
      return;
    }

    // Si estás en menú sucursal sin opción activa, volver a pantalla inicio
    setVista('inicio');
    setSeccionCentral('');
    setSeccionFortuna('');
    setSeccionFlorencia('');
  };

  // Botón Volver se muestra siempre excepto en pantalla inicio general
  const BotonVolver = () => {
    if (vista === 'inicio') return null; // no mostrar
    return (
      <button
        style={{ ...styles.button, marginBottom: 20, alignSelf: 'start' }}
        onClick={handleVolver}
      >
        ⬅ Volver
      </button>
    );
  };

  // Función para renderizar contenido con botón volver
  const renderSeccionConVolver = (Componente) => (
    <div style={styles.panel}>
      <BotonVolver />
      {Componente}
    </div>
  );

  // Renderizado completo de la UI según vista y secciones
  const renderVista = () => {
    if (vista === 'central') {
      if (seccionCentral === '') {
        // menú sucursal central
        return (
          <div style={styles.panel}>
            <BotonVolver />
            <h3 style={styles.subtitle}>Gestión Sucursal Central</h3>
            <div style={styles.buttonGroup}>
              <button style={styles.button} onClick={() => setSeccionCentral('registrar_cliente')}>
                Registrar Cliente
              </button>
              <button style={styles.button} onClick={() => setSeccionCentral('consultar_cliente')}>
                Consultar Cliente
              </button>
              <button style={styles.button} onClick={() => setSeccionCentral('registrar_pago')}>
                Registrar Pago
              </button>
              <button style={styles.button} onClick={() => setSeccionCentral('registrar_envio')}>
                Registrar Envío
              </button>
              <button style={styles.button} onClick={() => setSeccionCentral('historial')}>
                Historial
              </button>
              <button style={styles.button} onClick={() => setSeccionCentral('validar_nodo')}>
                Validar Nodo
              </button>
              <button style={styles.button} onClick={() => setSeccionCentral('validar_paquete_qr')}>
                Validar Paquete (QR)
              </button>
            </div>
          </div>
        );
      }
      // opción específica nodo central
      switch (seccionCentral) {
        case 'registrar_cliente': return renderSeccionConVolver(<RegistrarCliente />);
        case 'consultar_cliente': return renderSeccionConVolver(<ConsultarCliente />);
        case 'registrar_pago': return renderSeccionConVolver(<RegistrarPago />);
        case 'registrar_envio': return renderSeccionConVolver(<RegistrarEnvio />);
        case 'historial': return renderSeccionConVolver(<HistorialEnvios />);
        case 'validar_nodo': return renderSeccionConVolver(<ValidarNodo />);
        case 'validar_paquete_qr': return renderSeccionConVolver(<ValidarQR />);
        default: return null;
      }
    }

    if (vista === 'fortuna') {
      if (seccionFortuna === '') {
        // menú sucursal fortuna
        return (
          <div style={styles.panel}>
            <BotonVolver />
            <h3 style={styles.subtitle}>Gestión Sucursal La Fortuna</h3>
            <div style={styles.buttonGroup}>
              <button style={styles.button} onClick={() => setSeccionFortuna('registrar_paquete')}>
                Registrar Paquete
              </button>
              <button style={styles.button} onClick={() => setSeccionFortuna('asignar_ruta')}>
                Asignar Ruta
              </button>
              <button style={styles.button} onClick={() => setSeccionFortuna('registrar_entrega')}>
                Registrar Entrega
              </button>
            </div>
          </div>
        );
      }
      // opción específica sucursal fortuna
      switch (seccionFortuna) {
        case 'registrar_paquete': return renderSeccionConVolver(<RegistrarPaquete sucursal="fortuna" />);
        case 'asignar_ruta': return renderSeccionConVolver(<AsignarRuta sucursal="fortuna" />);
        case 'registrar_entrega': return renderSeccionConVolver(<RegistrarEntrega sucursal="fortuna" />);
        default: return null;
      }
    }

    if (vista === 'florencia') {
      if (seccionFlorencia === '') {
        // menú sucursal florencia
        return (
          <div style={styles.panel}>
            <BotonVolver />
            <h3 style={styles.subtitle}>Gestión Sucursal Florencia</h3>
            <div style={styles.buttonGroup}>
              <button style={styles.button} onClick={() => setSeccionFlorencia('registrar_paquete')}>
                Registrar Paquete
              </button>
              <button style={styles.button} onClick={() => setSeccionFlorencia('asignar_ruta')}>
                Asignar Ruta
              </button>
              <button style={styles.button} onClick={() => setSeccionFlorencia('registrar_entrega')}>
                Registrar Entrega
              </button>
            </div>
          </div>
        );
      }
      // opción específica sucursal florencia
      switch (seccionFlorencia) {
        case 'registrar_paquete': return renderSeccionConVolver(<RegistrarPaquete sucursal="florencia" />);
        case 'asignar_ruta': return renderSeccionConVolver(<AsignarRuta sucursal="florencia" />);
        case 'registrar_entrega': return renderSeccionConVolver(<RegistrarEntrega sucursal="florencia" />);
        default: return null;
      }
    }

    // pantalla inicio general
    return (
      <div style={styles.centered}>
        <h2 style={styles.title}>Bienvenido a Correos TEC</h2>
        <p>Seleccione una sucursal para comenzar</p>
        <button style={styles.button} onClick={() => cambiarVista('central')}>
          Sucursal Central
        </button>{' '}
        <button style={styles.button} onClick={() => cambiarVista('fortuna')}>
          Sucursal La Fortuna
        </button>{' '}
        <button style={styles.button} onClick={() => cambiarVista('florencia')}>
          Sucursal Florencia
        </button>
      </div>
    );
  };
  
const cambiarVista = (nuevaVista) => {
  setVista(nuevaVista);
  setSeccionCentral('');
  setSeccionFortuna('');
  setSeccionFlorencia('');
};

  return (
    <div style={styles.container}>
      <h1 style={styles.title}>Gestor de Paquetes - Correos TEC</h1>
      {renderVista()}
    </div>
  );
}

export default App;
