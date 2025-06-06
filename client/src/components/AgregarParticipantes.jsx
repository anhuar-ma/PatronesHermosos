import React, { useState } from 'react';
import { X } from 'lucide-react';
import '../styles/CambiarGrupo.css'; 

const AgregarParticipantes = ({ onClose, onConfirm, participantes, participantesLoading, participantesError }) => {
  const [selectedParticipante, setSelectedParticipante] = useState(null);


  if (participantesError) {
    return <p>Error al cargar los colaboradores: {colaboradoresError}</p>;
  }

  return (
    <div className="modal-overlay">
      <div className="modal-box">
        <button className="close-button" onClick={onClose}>
          <X size={24} />
        </button>
        <h2>Seleccionar participante</h2>
        <table>
          <thead>
            <tr>
              <th></th>
              <th>Nombre</th>
              <th>Escolaridad</th>
              <th>Idioma</th>
            </tr>
          </thead>
          <tbody>
            {participantes.map((participante) => (
              <tr key={participante.id_participante}>
                <td>
                  <input
                    type="radio"
                    name="participante"
                    value={participante.id_participante}
                    onChange={() => setSelectedParticipante(participante.id_participante)}
                    checked={selectedParticipante === participante.id_participante}
                  />
                </td>
                <td>{participante.nombre_participante}</td>
                <td>{participante.escolaridad}</td>
                <td>{participante.idioma}</td>
              </tr>
            ))}
          </tbody>
        </table>

        <div className="modal-actions">
          <button
            className="confirm-button"
            disabled={selectedParticipante === null}
            onClick={() => onConfirm(selectedParticipante)}
          >
            Seleccionar participante
          </button>
        </div>
      </div>
    </div>
  );
};

export default AgregarParticipantes;