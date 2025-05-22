// src/hooks/useFetchMentoras.js
import { useState, useEffect } from "react";
import axios from "axios";

export const useFetchMentoras = (id) => {
  const [mentora, setMentora] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    axios
      .get(`/api/mentoras/${id}`)
      .then((res) => {
        setMentora(res.data);
        setLoading(false);
      })
      .catch((err) => {
        setError(err.response?.data?.message || err.message);
        setLoading(false);
      });
  }, [id]);

  return { mentora, loading, error, setMentora };
};
