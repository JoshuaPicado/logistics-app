// src/layout/DashboardLayout.jsx
import React from 'react';

const DashboardLayout = ({ children, onSelect, actualVista }) => {
  return (
    <div className="flex min-h-screen bg-gray-100">
      {/* Sidebar */}
      <aside className="w-64 bg-white shadow-lg p-4">
        <h2 className="text-xl font-bold mb-6 text-blue-700">Correos TEC</h2>
        <nav className="flex flex-col gap-3">
          <button onClick={() => onSelect('central')} className={`p-2 rounded ${actualVista === 'central' ? 'bg-blue-600 text-white' : 'hover:bg-blue-100'}`}>Nodo Central</button>
          <button onClick={() => onSelect('fortuna')} className={`p-2 rounded ${actualVista === 'fortuna' ? 'bg-green-600 text-white' : 'hover:bg-green-100'}`}>Sucursal Fortuna</button>
          <button onClick={() => onSelect('florencia')} className={`p-2 rounded ${actualVista === 'florencia' ? 'bg-yellow-600 text-white' : 'hover:bg-yellow-100'}`}>Sucursal Florencia</button>
          <button onClick={() => onSelect('inicio')} className="p-2 mt-10 text-sm text-gray-500 hover:underline">Volver al inicio</button>
        </nav>
      </aside>

      {/* Contenido */}
      <main className="flex-1 p-6">
        {children}
      </main>
    </div>
  );
};

export default DashboardLayout;
