import { useState } from "react";
import axios from "axios";

export default function useEliminarIntegrante() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const eliminarIntegrante = async (idGrupo, idIntegrante, rol) => {
    setLoading(true);
    setError(null);
    console.log("ELIMINAR");
    console.log("rol", rol);

    try {
      const token = localStorage.getItem("token"); // Obtén el token desde el almacenamiento local
      await axios.put(
        `/api/grupos/${idGrupo}/listado/${idIntegrante}`,
        { rol }, // Envía el rol en el cuerpo de la solicitud
        {
          headers: {
            Authorization: `Bearer ${token}`, // Incluye el token en el encabezado
          },
        },
      );

      return { success: true, message: "Integrante eliminado exitosamente." };
    } catch (err) {
      console.error("Error eliminando integrante:", err);
      setError(
        err.response?.data?.message || "Error al eliminar el integrante.",
      );
      return { success: false, message: error };
    } finally {
      setLoading(false);
    }
  };

  return { eliminarIntegrante, loading, error };
}
