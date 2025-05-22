import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import axios from "axios";
import LoadingCard from "../../components/LoadingCard";
import { useEditMentora } from "../../hooks/useEditMentoras";
import { useFetchMentoras } from "../../hooks/useFetchMentoras";
import { useNavigate } from "react-router-dom";
import "../../styles/ViewDetails.css";

export default function DetalleMentora() {
  const { id } = useParams();
  const { mentora, loading, error, setMentora } = useFetchMentoras(id);
  const navigate = useNavigate();

  const {
    editableData,
    setEditableData,
    handleChange,
    handleSave,
    editMode,
    setEditMode,
  } = useEditMentora(mentora);

  const handleDelete = async () => {
    const confirmDelete = window.confirm("¿Estás seguro de que deseas eliminar a esta mentora?");
    if (!confirmDelete) return;

    try {
      await axios.delete(`/api/mentoras/${mentora.id_mentora}`);
      alert("Mentora eliminado correctamente");
      navigate("/admin/mentoras/");
    } catch (err) {
      alert(
        "Error al eliminar la mentora: " +
        (err.response?.data?.message || err.message)
      );
    }
  };

  const saveChanges = async () => {
    try {
      const updatedData = await handleSave(id);
      setMentora(updatedData);
      setEditableData(updatedData);
      setEditMode(false);
    } catch (err) {
      alert("Error al guardar: " + err.message);
    }
  };

  if (loading) return <LoadingCard mensaje="Cargando mentora..." />;
  if (error) return <LoadingCard mensaje={error} />;

  return (
    <div className="background__view">
      <div className="colaborador-card">
        <div className="header-actions">
          <h2 className="title__view">Vista detallada de mentora</h2>
          <div className="actions">
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

        <h3 className="subtitle__view">Información personal de la mentora</h3>
        <div className="info-grid">
          <div className="info-column">
            <h5 className="label__colaborator">Nombre(s) de la mentora:</h5>
            {editMode ? (
              <input
                className="registroEdicion__input"
                value={editableData.nombre || ""}
                onChange={(e) => handleChange("nombre", e.target.value)}
              />
            ) : (
              <p className="info__colaborator">{mentora.nombre}</p>
            )}

            <h5 className="label__colaborator">Apellido paterno de la mentora:</h5>
            {editMode ? (
              <input
                className="registroEdicion__input"
                value={editableData.apellido_paterno || ""}
                onChange={(e) => handleChange("apellido_paterno", e.target.value)}
              />
            ) : (
              <p className="info__colaborator">{mentora.apellido_paterno}</p>
            )}

          </div>


          <div className="info-column">
            <h5 className="label__colaborator">Apellido materno de la mentora:</h5>
            {editMode ? (
              <input
                className="registroEdicion__input"
                value={editableData.apellido_materno || ""}
                onChange={(e) => handleChange("apellido_materno", e.target.value)}
              />
            ) : (
              <p className="info__colaborator">{mentora.apellido_materno}</p>
            )}

            <h5 className="label__colaborator">Correo:</h5>
                {editMode ? (
                <input
                    className="registroEdicion__input"
                    value={editableData.correo || ""}
                    onChange={(e) => handleChange("correo", e.target.value)}
                />
                ) : (
                <p className="info__colaborator">{mentora.correo}</p>
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
