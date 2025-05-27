// src/hooks/useCurrentRol.js
import { useState, useEffect } from "react";

export default function useCurrentRol() {
  const [rol, setRol] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const token = localStorage.getItem("token");

        if (!token) {
          setLoading(false);
          return;
        }

        const response = await fetch("/api/auth/me", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (response.ok) {
          const data = await response.json();
          setRol(data.user.rol);
        } else {
          // Token is invalid, remove it
          localStorage.removeItem("token");
          setRol(null);
        }
      } catch (error) {
        console.error("Error fetching user data:", error);
        setRol(null);
      } finally {
        setLoading(false);
      }
    };

    fetchUserData();
  }, []);

  return { rol };
}
