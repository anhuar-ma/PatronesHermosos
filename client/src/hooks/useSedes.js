import { useState, useEffect } from "react";
import axios from "axios";

export default function useSedes() {
  const [sedes, setSedes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchSedes = async () => {
      try {
        const response = await axios.get("/api/sedes");
        setSedes(response.data.data);
      } catch (err) {
        setError(
          "Error al cargar de sedes: " +
            (err.response?.data?.message || err.message),
        );
      } finally {
        setLoading(false);
      }
    };

    fetchSedes();
  }, []);

  return { sedes, loading, error };
}
