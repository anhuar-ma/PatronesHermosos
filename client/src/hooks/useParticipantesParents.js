import { useState, useEffect } from "react";
import axios from "axios";

export default function useParticipantesParents() {
  const [participantes, setParticipantes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchParticipantes = async () => {
      try {
        const response = await axios.get("/api/participantes/parents");
        setParticipantes(response.data.data);
      } catch (err) {
        setError(
          "Error al cargar las participantes con los padres: " +
            (err.response?.data?.message || err.message),
        );
      } finally {
        setLoading(false);
      }
    };

    fetchParticipantes();
  }, []);

  return { participantes, loading, error };
}
