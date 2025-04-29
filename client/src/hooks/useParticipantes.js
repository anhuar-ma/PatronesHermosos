import { useState, useEffect } from "react";
import axios from "axios";

export default function useColaboradores() {
  const [colaboradores, setColaboradores] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchColaboradores = async () => {
      try {
        const response = await axios.get("/api/participantes");
        setColaboradores(response.data.data);
      } catch (err) {
        setError(
          "Error al cargar las participantes: " +
            (err.response?.data?.message || err.message),
        );
      } finally {
        setLoading(false);
      }
    };

    fetchColaboradores();
  }, []);

  return { colaboradores, loading, error };
}
