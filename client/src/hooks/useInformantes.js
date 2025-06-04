import { useState, useEffect } from "react";
import axios from "axios";

export default function useInformantes() {
  const [informantes, setInformantes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchInformantes = async () => {
      try {
        const response = await axios.get("/api/informantes");
        setInformantes(response.data.data);
      } catch (err) {
        setError(
          "Error al cargar los informantes: " +
            (err.response?.data?.message || err.message)
        );
      } finally {
        setLoading(false);
      }
    };

    fetchInformantes();
  }, []);

  return { informantes, loading, error };
}
