import { useState, useEffect } from "react";
import axios from "axios";

export default function useGrupos() {
  const [grupos, setGrupos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchGrupos = async () => {
      try {
        const response = await axios.get("/api/grupos");
        setGrupos(response.data.data);
      } catch (err) {
        setError(
          "Error al cargar las grupos: " +
            (err.response?.data?.message || err.message),
        );
      } finally {
        setLoading(false);
      }
    };

    fetchGrupos();
  }, []);

  return { grupos, loading, error };
}
