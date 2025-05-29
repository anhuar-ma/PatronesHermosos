import React, { useState } from 'react';
import { X } from 'lucide-react';
import '../styles/CambiarGrupo.css'; 

const AgregarColaborador = ({ onClose, onConfirm, colaboradores, colaboradoresLoading, colaboradoresError }) => {
  const [selectedColaborador, setSelectedColaborador] = useState(null);

  // if (colaboradoresLoading) {
  //   return <p>Cargando colaboradores...</p>;
  // }

  if (colaboradoresError) {
    return <p>Error al cargar los colaboradores: {colaboradoresError}</p>;
  }

  return (
    <div className="modal-overlay">
      <div className="modal-box">
        <button className="close-button" onClick={onClose}>
          <X size={24} />
        </button>
        <h2>Seleccionar colaborador</h2>
        <table>
          <thead>
            <tr>
              <th></th>
              <th>Nombre</th>
              <th>Rol</th>
              <th>Idioma</th>
            </tr>
          </thead>
          <tbody>
            {colaboradores.map((colaborador) => (
              <tr key={colaborador.id_colaborador}>
                <td>
                  <input
                    type="radio"
                    name="colaborador"
                    value={colaborador.id_colaborador}
                    onChange={() => setSelectedColaborador(colaborador.id_colaborador)}
                    checked={selectedColaborador === colaborador.id_colaborador}
                  />
                </td>
                <td>{colaborador.nombre}</td>
                <td>{colaborador.rol}</td>
                <td>{colaborador.idioma}</td>
              </tr>
            ))}
          </tbody>
        </table>

        <div className="modal-actions">
          <button
            className="confirm-button"
            disabled={selectedColaborador === null}
            onClick={() => onConfirm(selectedColaborador)}
          >
            Seleccionar colaborador
          </button>
        </div>
      </div>
    </div>
  );
};

export default AgregarColaborador;