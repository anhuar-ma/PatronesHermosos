// useFetchSede.js (asumo que usas este hook)
import { useState, useEffect } from "react";
import axios from "axios";

export function useFetchSede(id) {
  const [sede, setSede] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchSede = async () => {
      try {
        const token = localStorage.getItem("token");
        const response = await axios.get(`/api/sedes/${id}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (response.data.success) {
          setSede(response.data.data[0]); // Aquí asegúrate que sea el índice correcto
        } else {
          setError("No se pudo obtener la información de la sede.");
        }
      } catch (err) {
        setError("Error al obtener los datos.");
      } finally {
        setLoading(false);
      }
    };

    fetchSede();
  }, [id]);

  return { sede, loading, error, setSede };
}
