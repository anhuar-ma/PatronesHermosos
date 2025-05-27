import React, { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import useCoordinadoras from "../hooks/useCoordinadoras";
import axios from "axios";

const TablaAsignacionMentora = () => {
  const { coordinadoras, loading, error, setCoordinadoras, reloadCoordinadoras } = useCoordinadoras();
  const navigate = useNavigate();
  const location = useLocation(); // Obtener el estado pasado desde navigate
  const [deleteError, setDeleteError] = useState(null);

  const handleEliminar = async (id) => {
    const confirmacion = window.confirm(
      "¿Estás seguro de que deseas eliminar a esta coordinadora asociada? Esta acción no se puede deshacer."
    );

    if (!confirmacion) {
      return; // Si el usuario cancela, no se realiza ninguna acción
    }

    try {
      await axios.delete(`/api/coordinadoras_asociadas/${id}`);
      setCoordinadoras((prev) =>
        prev.filter((coordinadora) => coordinadora.id_coordinadora_asociada !== id)
      );
      setDeleteError(null); 
    } catch (err) {
      console.error("Error eliminando coordinadora:", err);
      setDeleteError("No se pudo eliminar la coordinadora asociada. Intenta nuevamente.");
    }
  };

  // Recargar datos si se pasa el estado `refresh`
  useEffect(() => {
    if (location.state?.refresh) {
      reloadCoordinadoras(); // Recargar los datos
      navigate(location.pathname, { replace: true }); // Limpiar el estado `refresh`
    }
  }, [location.state, reloadCoordinadoras, navigate, location.pathname]);

  if (loading) return <p>Cargando...</p>;
  if (error) return <p>Error: {error}</p>;

  return (
    <div className="adminDashboard__tableSection">
      <h2>Coordinadora asociada</h2>
      {deleteError && <p className="error">{deleteError}</p>} {/* Mostrar error si ocurre */}
      <table className="adminDashboard__coodinadoraAsociacionTable">
        <thead>
          <tr>
            <th>Nombre</th>
            <th>Correo</th>
            <th>Eliminar/asignar coordinadora asociada</th>
          </tr>
        </thead>
        <tbody>
          {coordinadoras.length > 0 ? (
            coordinadoras.map((coordinadora) => (
              <tr key={coordinadora.id_coordinadora_asociada}>
                <td>{coordinadora.nombre_completo}</td>
                <td>{coordinadora.correo}</td>
                <td>
                  <button
                    className="btn_eliminarCoordinadora"
                    onClick={() => handleEliminar(coordinadora.id_coordinadora_asociada)}
                  >
                    Eliminar asociada
                  </button>
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td>— Ninguna asignada —</td>
              <td>— Ninguna asignada —</td>
              <td>
                {coordinadoras.length === 0 && (
                  <button
                    className="btn-agregarCoordinadora"
                    onClick={() => navigate(`/admin/registro-coordinadora-asociada`)}
                  >
                    Asignar coordinadora asociada
                  </button>
                )}
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
};

export default TablaAsignacionMentora;