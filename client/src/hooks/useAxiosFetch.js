import { useState, useEffect } from "react";
import axios from "axios";

const useAxiosFetch = (url) => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const token = localStorage.getItem("token");
    axios
      .get(url, {
        headers: {
          "Content-Type": "application/json",
          Authorization: token ? `Bearer ${token}` : "",
        },
      })
      .then((response) => {
        setData(response.data);
        setLoading(false);
      })
      .catch((err) => {
        setError(err.response?.data?.message || err.message || "Error al obtener los datos");
        setLoading(false);
      });
  }, [url]);

  return { data, loading, error };
};

export default useAxiosFetch;