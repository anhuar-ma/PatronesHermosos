import { useState } from "react";

export default function useParticipanteDetalles() {
  const [participanteSeleccionado, setParticipanteSeleccionado] = useState(null);

  const abrirDetalles = (participante) => {
    setParticipanteSeleccionado(participante);
  };

  const cerrarDetalles = () => {
    setParticipanteSeleccionado(null);
  };

  return {
    participanteSeleccionado,
    abrirDetalles,
    cerrarDetalles,
  };
}
