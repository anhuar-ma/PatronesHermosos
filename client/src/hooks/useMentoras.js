import { useState, useEffect } from "react";
import axios from "axios";

export default function useMentoras() {
  const [mentoras, setMentoras] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchMentoras = async () => {
      try {
        const response = await axios.get("/api/mentoras");
        setMentoras(response.data.data);
      } catch (err) {
        setError(
          "Error al cargar las mentoras: " +
            (err.response?.data?.message || err.message),
        );
      } finally {
        setLoading(false);
      }
    };

    fetchMentoras();
  }, []);

  return { mentoras, loading, error };
}
