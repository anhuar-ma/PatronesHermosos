import React, { useState } from 'react';
import { X } from 'lucide-react';
import '../styles/CambiarGrupo.css'; 

const AgregarMentoras = ({ onClose, onConfirm, mentoras, mentorasLoading, mentorasError }) => {
  const [selectedMentora, setSelectedMentora] = useState(null);

  if (mentorasLoading) {
    return <p>Cargando mentora...</p>;
  }

  if (mentorasError) {
    return <p>Error al cargar los mentoras: {mentorasError}</p>;
  }

  return (
    <div className="modal-overlay">
      <div className="modal-box">
        <button className="close-button" onClick={onClose}>
          <X size={24} />
        </button>
        <h2>Seleccionar mentoras</h2>
        <table>
          <thead>
            <tr>
              <th></th>
              <th>Nombre</th>
            </tr>
          </thead>
          <tbody>
            {mentoras.map((mentora) => (
              <tr key={mentora.id_mentora}>
                <td>
                  <input
                    type="radio"
                    name="mentora"
                    value={mentora.id_mentora}
                    onChange={() => setSelectedMentora(mentora.id_mentora)}
                    checked={selectedMentora === mentora.id_mentora}
                  />
                </td>
                <td>{mentora.nombre_mentora}</td>
              </tr>
            ))}
          </tbody>
        </table>

        <div className="modal-actions">
          <button
            className="confirm-button"
            disabled={selectedMentora === null}
            onClick={() => onConfirm(selectedMentora)}
          >
            Seleccionar mentora
          </button>
        </div>
      </div>
    </div>
  );
};

export default AgregarMentoras;