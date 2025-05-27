import { useState, useEffect } from "react";
import axios from "axios";

export default function useGrupoMentora(idGrupo) {
  const [mentora, setMentora] = useState([]); // Siempre será un arreglo
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Función para obtener la mentora del grupo
  const fetchMentora = async () => {
    if (!idGrupo) {
      setMentora([]);
      setLoading(false);
      setError("El ID del grupo no es válido");
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const token = localStorage.getItem("token"); // Obtén el token desde el almacenamiento local
      console.log("Token:", token); // Log para depuración

      const response = await axios.get(`/api/grupos/${idGrupo}/mentoras`, {
        headers: {
          Authorization: `Bearer ${token}`, // Incluye el token en el encabezado
        },
      });

      const data = response.data.data;
      console.log("Mentora obtenida:", data); // Log para depuración

      // Actualiza el estado con los datos obtenidos o un arreglo vacío
      setMentora(data || []);
    } catch (err) {
      console.error("Error al obtener la mentora:", err);
      setError(err.response?.data?.message || "Error al obtener la mentora del grupo");
    } finally {
      setLoading(false);
    }
  };

  // Llama a fetchMentora cuando el hook se monta o cambia el ID del grupo
  useEffect(() => {
    fetchMentora();
  }, [idGrupo]);

  // Devuelve los datos y la función para refrescar la mentora
  return { mentora, loading, error, refreshMentora: fetchMentora };
}