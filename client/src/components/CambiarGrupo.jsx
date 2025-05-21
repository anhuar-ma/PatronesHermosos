import React, { useState } from 'react';
import { X } from 'lucide-react';
import '../styles/CambiarGrupo.css'; 

const CambiarGrupo = ({ onClose, onConfirm, grupos, gruposLoading, gruposError }) => {
  const [selectedGroup, setSelectedGroup] = useState(null);

  if (gruposLoading) {
    return <p>Cargando grupos...</p>;
  }

  if (gruposError) {
    return <p>Error al cargar los grupos: {gruposError}</p>;
  }

  return (
    <div className="modal-overlay">
      <div className="modal-box">
        <button className="close-button" onClick={onClose}>
          <X size={24} />
        </button>
        <h2>Cambio de grupo</h2>
        <table>
          <thead>
            <tr>
              <th></th>
              <th>Número de grupo</th>
              <th>Idioma</th>
              <th>Nivel</th>
            </tr>
          </thead>
          <tbody>
            {grupos.map((grupo) => (
              <tr key={grupo.id_grupo}>
                <td>
                  <input
                    type="radio"
                    name="group"
                    value={grupo.id_grupo}
                    onChange={() => setSelectedGroup(grupo.id_grupo)}
                    checked={selectedGroup === grupo.id_grupo}
                  />
                </td>
                <td>{grupo.id_grupo}</td>
                <td>{grupo.idioma}</td>
                <td>{grupo.nivel}</td>
              </tr>
            ))}
          </tbody>
        </table>

        <div className="modal-actions">
          <button
            className="confirm-button"
            disabled={selectedGroup === null}
            onClick={() => onConfirm(selectedGroup)}
          >
            Cambiar a este grupo
          </button>
        </div>
      </div>
    </div>
  );
};

export default CambiarGrupo;