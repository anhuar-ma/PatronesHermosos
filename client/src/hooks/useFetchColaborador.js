import { useState, useEffect } from "react";
import axios from "axios";

export const useFetchColaborador = (id) => {
  const [colaborador, setColaborador] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    axios
      .get(`/api/colaboradores/${id}`)
      .then((res) => {
        setColaborador(res.data);
        setLoading(false);
      })
      .catch((err) => {
        setError(err.response?.data?.message || err.message);
        setLoading(false);
      });
  }, [id]);

  return { colaborador, loading, error, setColaborador };
};
