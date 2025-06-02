import axios from "axios";
import { useState } from "react";

export default function useDeleteInformante(onSuccess) {
  const [loading, setLoading] = useState(false);

  const deleteInformante = async (id) => {
    const confirmacion = window.confirm("¿Estás seguro que deseas eliminar a este informante?");
    if (!confirmacion) return;

    try {
      setLoading(true);
      const response = await axios.delete(
        `/api/informantes/${id}`,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );

      alert("Informante eliminado correctamente");

      if (onSuccess) onSuccess(id);
    } catch (error) {
      console.error("Error eliminando informante:", error);
      alert(error.response?.data?.message || "No se pudo eliminar el informante");
    } finally {
      setLoading(false);
    }
  };

  return { deleteInformante, loading };
}
