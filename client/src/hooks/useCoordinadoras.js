import { useState, useEffect } from "react";
import axios from "axios";

const useCoordinadoras = () => {
  const [coordinadoras, setCoordinadoras] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchCoordinadoras = async () => {
    try {
      setLoading(true);
      const response = await axios.get("/api/coordinadoras_asociadas");
      setCoordinadoras(response.data.data);
      setError(null);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCoordinadoras();
  }, []);

  return { coordinadoras, loading, error, setCoordinadoras, reloadCoordinadoras: fetchCoordinadoras };
};

export default useCoordinadoras;