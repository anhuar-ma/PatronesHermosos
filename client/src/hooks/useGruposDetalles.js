import { useState, useEffect } from "react";
import axios from "axios";

export default function useGrupoDetalles(idGrupo) {
  const [detalles, setDetalles] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!idGrupo) return;

    const fetchDetalles = async () => {
      setLoading(true);
      setError(null);

      try {
        // Obtén el token desde el almacenamiento local o contexto
        const token = localStorage.getItem("token"); // Asegúrate de que el token esté almacenado correctamente

        const response = await axios.get(`/api/grupos/${idGrupo}`, {
          headers: {
            Authorization: `Bearer ${token}`, // Incluye el token en el encabezado
          },
        });

        setDetalles(response.data.data || null); // Guarda los detalles del grupo
      } catch (err) {
        console.error("Error fetching group details:", err);
        setError(err.response?.data?.message || "Error al obtener los detalles del grupo");
      } finally {
        setLoading(false);
      }
    };

    fetchDetalles();
  }, [idGrupo]);

  return { detalles, loading, error };
}