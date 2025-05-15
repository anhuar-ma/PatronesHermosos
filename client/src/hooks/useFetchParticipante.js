// src/hooks/useFetchParticipante.js
import { useState, useEffect } from "react";
import axios from "axios";

export const useFetchParticipante = (id) => {
  const [participante, setParticipante] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    axios
      .get(`/api/participantes/parents/${id}`)
      .then((res) => {
        setParticipante(res.data);
        setLoading(false);
      })
      .catch((err) => {
        setError(err.response?.data?.message || err.message);
        setLoading(false);
      });
  }, [id]);

  return { participante, loading, error, setParticipante };
};
