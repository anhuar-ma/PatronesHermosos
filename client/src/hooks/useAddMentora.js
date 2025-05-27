import { useState } from "react";
import axios from "axios";

export default function useMentoras(idGrupo) {
  const [mentoras, setMentoras] = useState([]);
  const [mentorasLoading, setMentorasLoading] = useState(false);
  const [mentorasError, setMentorasError] = useState(null);

  // Función para obtener mentoras disponibles
  const fetchMentoras = async () => {
    setMentorasLoading(true);
    setMentorasError(null);
    try {
      const response = await axios.get(`/api/grupos/${idGrupo}/mentorasDisponibles`);
      setMentoras(response.data.data);
    } catch (error) {
      console.error("Error al obtener colaboradores:", error);
      setMentorasError("No se pudieron cargar los colaboradores.");
    } finally {
      setMentorasLoading(false);
    }
  };

  // Función para manejar la asignación de un colaborador
  const assignMentora = async (idMentora, actualizacionMentoras) => {
    try {
      const response = await axios.post(`/api/grupos/${idGrupo}/mentoras`, {
        id_mentora: idMentora,
      });
      alert(response.data.message); // Mostrar mensaje de éxito
      actualizacionMentoras(); // Refrescar la tabla de grupos
    } catch (error) {
      console.error("Error al asignar colaborador:", error);
      alert("No se pudo asignar el colaborador.");
    }
  };

  return {
    mentoras,
    mentorasLoading,
    mentorasError,
    fetchMentoras,
    assignMentora,
  };
}