import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import axios from "axios";
import LoadingCard from "../../components/LoadingCard";
import { useEditColaborador } from "../../hooks/useEditColaborador";
import useCurrentRol from "../../hooks/useCurrentRol";
import { useFetchColaborador } from "../../hooks/useFetchColaborador";
import { useNavigate } from "react-router-dom";
import useGrupos from "../../hooks/useGrupos";
import CambiarGrupo from "../../components/CambiarGrupo";
import "../../styles/ViewDetails.css";

export default function DetalleColaborador() {
  const { id } = useParams();
  const { colaborador, loading, error, setColaborador } = useFetchColaborador(id);
  const [mostrarCambiarGrupo, setMostrarCambiarGrupo] = useState(false);
  const { grupos, loading: gruposLoading, error: gruposError } = useGrupos();
  const navigate = useNavigate();

  const {
    editableData,
    setEditableData,
    handleChange,
    handleSave,
    editMode,
    setEditMode,
  } = useEditColaborador(colaborador);

  const handleDelete = async () => {
    const confirmDelete = window.confirm("¿Estás seguro de que deseas eliminar este colaborador?");
    if (!confirmDelete) return;

    try {
      await axios.delete(`/api/colaboradores/${colaborador.id_colaborador}`);
      alert("Colaborador eliminado correctamente");
      navigate("/admin/colaboradores/");
    } catch (err) {
      alert(
        "Error al eliminar al colaborador: " +
        (err.response?.data?.message || err.message)
      );
    }
  };

  const saveChanges = async () => {
    try {
      const updatedData = await handleSave(id);
      setColaborador(updatedData);
      setEditableData(updatedData);
      setEditMode(false);
    } catch (err) {
      alert("Error al guardar: " + err.message);
    }
  };

  if (loading) return <LoadingCard mensaje="Cargando colaborador..." />;
  if (error) return <LoadingCard mensaje={error} />;

  const currentRol = useCurrentRol();

  return (
    <div className="background__view">
      <div className="colaborador-card">
        <div className="header-actions">
          <h2 className="title__view">Vista detallada de colaborador</h2>
          <div className="actions">
            {currentRol === 1 && (
              <>
                <button
                  className={`btn-edit ${editMode ? "btn-delete-disabled" : ""}`}
                  onClick={() => setMostrarCambiarGrupo(true)}
                >
                  Cambiar grupo
                </button>
                {mostrarCambiarGrupo && (
                  <CambiarGrupo
                    onClose={() => setMostrarCambiarGrupo(false)}
                    onConfirm={async (grupoSeleccionado) => {
                      try {
                        await axios.post(
                          `/api/grupos/${grupoSeleccionado}/colaboradoresDisponibles`,
                          { id_colaborador: colaborador.id_colaborador }
                        );
                        alert("Grupo actualizado correctamente");
                        setMostrarCambiarGrupo(false);
                        window.location.reload(); // Recarga la página o actualiza los datos
                      } catch (err) {
                        alert(
                          "Error al actualizar el grupo: " +
                          (err.response?.data?.message || err.message)
                        );
                      }
                    }}
                    grupos={grupos}
                    gruposLoading={gruposLoading}
                    gruposError={gruposError}
                  />
                )}
              </>
            )}
            <button
              className={`btn-edit ${
                editMode ? "registroEdicion__botonCancelar" : ""
              }`}
              onClick={() => setEditMode(!editMode)}
            >
              {editMode ? "Cancelar edición" : "Editar registro"}
            </button>
            {editMode && (
              <button className="registroEdicion__botonGuardar" onClick={saveChanges}>
                Guardar cambios
              </button>
            )}
          </div>
        </div>

        <h3 className="subtitle__view">Información personal del colaborador</h3>
        <div className="info-grid">
          <div className="info-column">
            <h5 className="label__colaborator">Nombre(s) del colaborador:</h5>
            {editMode ? (
              <input
                className="registroEdicion__input"
                value={editableData.nombre || ""}
                onChange={(e) => handleChange("nombre", e.target.value)}
              />
            ) : (
              <p className="info__colaborator">{colaborador.nombre}</p>
            )}

            <h5 className="label__colaborator">Apellido paterno del colaborador:</h5>
            {editMode ? (
              <input
                className="registroEdicion__input"
                value={editableData.apellido_paterno || ""}
                onChange={(e) => handleChange("apellido_paterno", e.target.value)}
              />
            ) : (
              <p className="info__colaborator">{colaborador.apellido_paterno}</p>
            )}

            <h5 className="label__colaborator">Correo:</h5>
            {editMode ? (
              <input
                className="registroEdicion__input"
                value={editableData.correo || ""}
                onChange={(e) => handleChange("correo", e.target.value)}
              />
            ) : (
              <p className="info__colaborator">{colaborador.correo}</p>
            )}


            <h5 className="label__colaborator">Grupo:</h5>
            <p className="info__colaborator">{colaborador.id_grupo}</p>

          </div>


          <div className="info-column">
            <h5 className="label__colaborator">Apellido materno del colaborador:</h5>
            {editMode ? (
              <input
                className="registroEdicion__input"
                value={editableData.apellido_materno || ""}
                onChange={(e) => handleChange("apellido_materno", e.target.value)}
              />
            ) : (
              <p className="info__colaborator">{colaborador.apellido_materno}</p>
            )}

            <h5 className="label__colaborator">Universidad de procedencia:</h5>
            {editMode ? (
              <input
                className="registroEdicion__input"
                value={editableData.universidad || ""}
                onChange={(e) => handleChange("universidad", e.target.value)}
              />
            ) : (
              <p className="info__colaborator">{colaborador.universidad}</p>
            )}
          </div>
        </div>

        <div className="delete-button-container">
          <button
            className={`btn-delete ${editMode ? "btn-delete-disabled" : ""}`}
            disabled={editMode}
            onClick={handleDelete}
          >
            Eliminar registro
          </button>
        </div>
      </div>
    </div>
  );
}
