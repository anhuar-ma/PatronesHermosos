import { useState } from "react";
import axios from "axios";

export default function useParticipantes(idGrupo) {
  const [participantes, setParticipantes] = useState([]);
  const [participantesLoading, setParticipantesLoading] = useState(false);
  const [participantesError, setParticipantesError] = useState(null);

  // Función para obtener colaboradores disponibles
  const fetchParticipantes = async () => {
    setParticipantesLoading(true);
    setParticipantesError(null);
    try {
      const response = await axios.get(`/api/grupos/${idGrupo}/participantesDisponibles`);
      setParticipantes(response.data.data);
    } catch (error) {
      console.error("Error al obtener participantes:", error);
      setParticipantesError("No se pudieron cargar los participantes.");
    } finally {
      setParticipantesLoading(false);
    }
  };

  // Función para manejar la asignación de un colaborador
  const assignParticipante = async (id_participante, refreshGrupos) => {
    try {
      const response = await axios.post(`/api/grupos/${idGrupo}/participantes`, {
        id_participante: id_participante,
      });
      alert(response.data.message); // Mostrar mensaje de éxito
      await fetchParticipantes(); // Actualizar la lista de colaboradores disponibles
      refreshGrupos(); // Refrescar la tabla de grupos
    } catch (error) {
      console.error("Error al asignar colaborador:", error);
      alert("No se pudo asignar el colaborador.");
    }
  };

  return {
    participantes,
    participantesLoading,
    participantesError,
    fetchParticipantes,
    assignParticipante,
  };
}