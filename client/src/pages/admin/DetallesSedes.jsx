import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import axios from "axios";
import LoadingCard from "../../components/LoadingCard";
import { useEditSede } from "../../hooks/useEditSede";
import { useFetchSede } from "../../hooks/useFetchSede";
import { useNavigate } from "react-router-dom";
import "../../styles/ViewDetails.css";

export default function DetalleSede() {
  const { id } = useParams();
  const { sede, loading, error, setSede } = useFetchSede(id);
  const {
    editableData,
    setEditableData,
    handleChange,
    handleSave,
    editMode,
    setEditMode,
  } = useEditSede(sede);
  const navigate = useNavigate();

  const handleDelete = async () => {
    const confirmDelete = window.confirm("¿Estás seguro de que deseas eliminar esta sede?");
    if (!confirmDelete) return;
  
    try {
      await axios.delete(`/api/sedes/${sede.id_sede}`); // Ajusta esta ruta si es necesario
      alert("Sede eliminado correctamente");
      navigate("/admin/sedes/"); // Redirige a la tabla de sedes
    } catch (err) {
      alert(
        "Error al eliminar la sede: " +
        (err.response?.data?.message || err.message)
      );
    }
  };
  

// DetalleParticipante.jsx
  const saveChanges = async () => {
    try {
      const updatedData = await handleSave(id);
      setSede(updatedData); // Actualiza la información en pantalla
      setEditableData(updatedData); // Actualiza el editableData también
      setEditMode(false);
    } catch (err) {
      alert("Error al guardar: " + err.message);
    }
};


if (loading) return <LoadingCard mensaje="Cargando info de sede..." />;
if (error) return <LoadingCard mensaje={error} />;

  return (
    <div className="background__view">
      <div className="colaborador-card">
        <div className="header-actions">
          <h2 className="title__view">Vista detallada de Sedes</h2>
          <div className="actions">
            {/* <button className="btn-edit" onClick={() => setEditMode(!editMode)}>
              {editMode ? "Cancelar edición" : "Editar registro"}
            </button> */}
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

        <h3 className="subtitle__view">
          Información personal de la coordinadora
        </h3>
        <div className="info-grid">
          <div className="info-column">
            <h5 className="label__colaborator">
              Nombre(s) de la coordinadora:
            </h5>
            {editMode ? (
              <input
                className="registroEdicion__input"
                value={editableData.nombre || ""}
                onChange={(e) => handleChange("nombre", e.target.value)}
              />
            ) : (
              <p className="info__colaborator">{sede.nombre}</p>
            )}

            <h5 className="label__colaborator">
              Apellido paterno de la coordinadora:
            </h5>
            {editMode ? (
              <input
                className="registroEdicion__input"
                value={editableData.apellido_paterno || ""}
                onChange={(e) =>
                  handleChange("apellido_paterno", e.target.value)
                }
              />
            ) : (
              <p className="info__colaborator">
                {sede.apellido_paterno}
              </p>
            )}

          </div>

          <div className="info-column">
            <h5 className="label__colaborator">
              Apellido materno de la coordinadora:
            </h5>
            {editMode ? (
              <input
                className="registroEdicion__input"
                value={editableData.apellido_materno || ""}
                onChange={(e) =>
                  handleChange("apellido_materno", e.target.value)
                }
              />
            ) : (
              <p className="info__colaborator">
                {sede.apellido_materno}
              </p>
            )}

            <h5 className="label__colaborator">Correo:</h5>
            {editMode ? (
              <input
                className="registroEdicion__input"
                value={editableData.correo || ""}
                onChange={(e) => handleChange("correo", e.target.value)}
              />
            ) : (
              <p className="info__colaborator">{sede.correo}</p>
            )}
          </div>
        </div>

        <h3 className="subtitle__view">Información de la sede</h3>
        <div className="info-grid">
          <div className="info-column">
            <h5 className="label__colaborator">Nombre de la sede:</h5>
            {editMode ? (
              <input
                className="registroEdicion__input"
                value={editableData.nombre_sede || ""}
                onChange={(e) => handleChange("nombre_tutor", e.target.value)}
              />
            ) : (
              <p className="info__colaborator">{sede.nombre_sede}</p>
            )}

            <h5 className="label__colaborator">Fecha de inicio:</h5>
            {editMode ? (
              <select
                className="registroEdicion__input"
                value={editableData.idioma || ""}
                onChange={(e) => handleChange("idioma", e.target.value)}
              >
                <option value="16/06/25">16/06/25</option>
                <option value="23/06/25">23/06/25</option>
                <option value="30/06/25">30/06/25</option>
                <option value="07/07/25">07/07/25</option>
                <option value="14/07/25">14/07/25</option>
              </select>  
            ) : (
              <p className="info__colaborator">{sede.fecha_inicio}</p>
            )}

          </div>

          <div className="info-column">

              <h5 className="label__colaborator">Convocatoria de sede:</h5>
              <button
                className={`registro__botonGrisArchivos ${
                  editMode ? "registro__botonDeshabilitado" : ""
                }`}
                disabled={editMode || !sede.convocatoria}
                onClick={async () => {
                  try {
                    // // Method 1: Direct download if the file URL is available
                    // if (participante.permiso_padre_tutor) {
                    //   window.open(participante.permiso_padre_tutor, '_blank');
                    // }

                    // Method 2: Using the download endpoint
                    const response = await axios.get(`/api/sedes/download/${id}`, {
                      responseType: 'blob'
                    });

                    const url = window.URL.createObjectURL(new Blob([response.data]));
                    const link = document.createElement('a');
                    link.href = url;
                    link.setAttribute('download', sede.archivo_nombre || 'permiso.pdf');
                    document.body.appendChild(link);
                    link.click();
                    link.remove();
                  } catch (error) {
                    console.error("Error downloading file:", error);
                    alert("Error al descargar el archivo");
                  }
                }}
            >
              {sede.convocatoria ? 'Descargar archivo' : 'No hay archivo disponible'}
            </button>
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
