import { useState, useEffect } from "react";
import axios from "axios";

export default function useGrupoListado(idGrupo) {
  const [listado, setListado] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!idGrupo) return;

    const fetchListado = async () => {
      setLoading(true);
      setError(null);

      try {
        // Obtén el token desde el almacenamiento local o contexto
        const token = localStorage.getItem("token"); // Asegúrate de que el token esté almacenado correctamente

        const response = await axios.get(`/api/grupos/${idGrupo}/listado`, {
          headers: {
            Authorization: `Bearer ${token}`, // Incluye el token en el encabezado
          },
        });

        setListado(response.data.data || []); // Asegúrate de que sea un array
      } catch (err) {
        console.error("Error fetching listado:", err);
        setError(err.response?.data?.message || "Error al obtener el listado");
      } finally {
        setLoading(false);
      }
    }; 

    fetchListado();
  }, [idGrupo]);

  return { listado, loading, error };
}