import { useState } from "react";
import axios from "axios";

export default function useColaboradores(idGrupo) {
  const [colaboradores, setColaboradores] = useState([]);
  const [colaboradoresLoading, setColaboradoresLoading] = useState(false);
  const [colaboradoresError, setColaboradoresError] = useState(null);

  // Función para obtener colaboradores disponibles
  const fetchColaboradores = async () => {
    setColaboradoresLoading(true);
    setColaboradoresError(null);
    try {
      const response = await axios.get(`/api/grupos/${idGrupo}/colaboradoresDisponibles`);
      setColaboradores(response.data.data);
    } catch (error) {
      console.error("Error al obtener colaboradores:", error);
      setColaboradoresError("No se pudieron cargar los colaboradores.");
    } finally {
      setColaboradoresLoading(false);
    }
  };

  // Función para manejar la asignación de un colaborador
  const assignColaborador = async (idColaborador, refreshGrupos) => {
    try {
      const response = await axios.post(`/api/grupos/${idGrupo}/colaboradoresDisponibles`, {
        id_colaborador: idColaborador,
      });
      alert(response.data.message); // Mostrar mensaje de éxito
      await fetchColaboradores(); // Actualizar la lista de colaboradores disponibles
      refreshGrupos(); // Refrescar la tabla de grupos
    } catch (error) {
      console.error("Error al asignar colaborador:", error);
      alert("No se pudo asignar el colaborador.");
    }
  };

  return {
    colaboradores,
    colaboradoresLoading,
    colaboradoresError,
    fetchColaboradores,
    assignColaborador,
  };
}