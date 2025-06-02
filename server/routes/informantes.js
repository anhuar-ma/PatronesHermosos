import axios from "axios";
import { useState } from "react";

export default function useDeleteInformante(onSuccess, onError) {
  const [loadingIds, setLoadingIds] = useState(new Set());

  const setLoading = (id, isLoading) => {
    setLoadingIds(prev => {
      const updated = new Set(prev);
      if (isLoading) {
        updated.add(id);
      } else {
        updated.delete(id);
      }
      return updated;
    });
  };

  const deleteInformante = async (id) => {
    const confirmacion = window.confirm("¿Estás seguro que deseas eliminar a este informante?");
    if (!confirmacion) return;

    try {
      setLoading(id, true);
      const response = await axios.delete(`api/informantes/${id}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });

      alert(response.data.message || "Informante eliminado correctamente");

      if (onSuccess) onSuccess(id);
    } catch (error) {
      console.error("Error eliminando informante:", error);

      const mensaje =
        error.response?.data?.message ||
        "Ocurrió un error inesperado al eliminar el informante";

      alert(mensaje);

      if (onError) onError(error);
    } finally {
      setLoading(id, false);
    }
  };

  const isLoading = (id) => loadingIds.has(id);

  return { deleteInformante, isLoading };
}
