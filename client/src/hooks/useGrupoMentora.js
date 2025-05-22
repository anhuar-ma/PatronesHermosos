import { useState, useEffect } from "react";
import axios from "axios";

export default function useGrupoMentora(idGrupo) {
  const [mentora, setMentora] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!idGrupo) return;

    const fetchMentora = async () => {
      setLoading(true);
      setError(null);

      try {
        const token = localStorage.getItem("token"); // Obtén el token desde el almacenamiento local
        const response = await axios.get(`/api/grupos/${idGrupo}/mentoras`, {
          headers: {
            Authorization: `Bearer ${token}`, // Incluye el token en el encabezado
          },
        });

        // Si el backend devuelve un array vacío, establece mentora como null
        const data = response.data.data;
        if (Array.isArray(data) && data.length > 0) {
          setMentora(data[0]); // Usa el primer elemento si hay múltiples mentoras
        } else {
          setMentora(null); // No hay mentora asignada
        }
      } catch (err) {
        console.error("Error fetching mentora:", err);
        setError(err.response?.data?.message || "Error al obtener la mentora del grupo");
      } finally {
        setLoading(false);
      }
    };

    fetchMentora();
  }, [idGrupo]);

  return { mentora, loading, error };
}