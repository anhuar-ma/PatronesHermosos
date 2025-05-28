import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import axios from "axios";
import LoadingCard from "../../components/LoadingCard";
import { useEditParticipante } from "../../hooks/useEditParticipante";
import { useNavigate } from "react-router-dom";
import { useFetchParticipante } from "../../hooks/useFetchParticipante";
import "../../styles/ViewDetails.css";
import useCurrentRol from "../../hooks/useCurrentRol";
import CambiarGrupo from "../../components/CambiarGrupo";
import { FaArrowLeft } from "react-icons/fa";
import useGrupos from "../../hooks/useGrupos";

export default function DetalleParticipante() {
  const { id } = useParams();
  const { participante, loading, error, setParticipante } = useFetchParticipante(id);
  const {
    editableData,
    setEditableData,
    handleChange,
    handleSave,
    editMode,
    setEditMode,
  } = useEditParticipante(participante);

  const navigate = useNavigate();
  const [mostrarCambiarGrupo, setMostrarCambiarGrupo] = useState(false);
  const { grupos, loading: gruposLoading, error: gruposError } = useGrupos();
  const currentRol = useCurrentRol();
    // Agrega un estado para errores
    const [errors, setErrors] = useState({});

    // Función para regresar
    const handleGoBack = () => {
      navigate(-1);
    };


  const handleDelete = async () => {
    const confirmDelete = window.confirm("¿Estás seguro de que deseas eliminar este participante?");
    if (!confirmDelete) return;

    try {
      await axios.delete(`/api/participantes/${participante.id_participante}`); // Ajusta esta ruta si es necesario
      alert("Participante eliminado correctamente");
      navigate("/admin/participantes/"); // Redirige a la tabla de participantes
    } catch (err) {
      alert(
        "Error al eliminar al participante: " +
        (err.response?.data?.message || err.message)
      );
    }
  };

// DetalleParticipante.jsx
  const saveChanges = async () => {
    try {
      const updatedData = await handleSave(id);
      setParticipante(updatedData); // Actualiza la información en pantalla
      setEditableData(updatedData); // Actualiza el editableData también
      setEditMode(false);
    } catch (err) {
      alert("Error al guardar: " + err.message);
    }
};


  if (loading) return <LoadingCard mensaje="Cargando participante..." />;
  if (error) return <LoadingCard mensaje={error} />;

  return (
    <div className="background__view">
      <div className="colaborador-card">
        <button className="btn-regresar" onClick={handleGoBack}>
            <FaArrowLeft className="btn-regresar__icon" /> Regresar
        </button>
        <div className="header-actions">
          <h2 className="title__view">Vista detallada de participantes</h2>
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
                            `/api/grupos/${grupoSeleccionado}/participantes`,
                            { id_participante: participante.id_participante }
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
          Información personal de la participante
        </h3>
        <div className="info-grid">
          <div className="info-column">
            <h5 className="label__colaborator">
              Nombre(s) de la participante:
            </h5>
            {editMode ? (
              <input
                className="registroEdicion__input"
                value={editableData.nombre || ""}
                onChange={(e) => handleChange("nombre", e.target.value)}
              />
            ) : (
              <p className="info__colaborator">{participante.nombre}</p>
            )}

            <h5 className="label__colaborator">
              Apellido paterno de la participante:
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
                {participante.apellido_paterno}
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
              <p className="info__colaborator">{participante.correo}</p>
            )}

            <h5 className="label__colaborator">Escolaridad:</h5>
            {editMode ? (
              <input
                className="registroEdicion__input"
                value={editableData.escolaridad || ""}
                onChange={(e) => handleChange("escolaridad", e.target.value)}
              />
            ) : (
              <p className="info__colaborator">{participante.escolaridad}</p>
            )}

              <h5 className="label__colaborator">Grupo asignado:</h5>
              <p className="info__colaborator">{participante.id_grupo}</p>

          </div>

          <div className="info-column">
            <h5 className="label__colaborator">
              Apellido materno de la participante:
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
                {participante.apellido_materno}
              </p>
            )}

            <h5 className="label__colaborator">Edad de la participante:</h5>
            {editMode ? (
              <input
                className="registroEdicion__input"
                value={editableData.edad || ""}
                onChange={(e) => handleChange("edad", e.target.value)}
              />
            ) : (
              <p className="info__colaborator">{participante.edad}</p>
            )}

            <h5 className="label__colaborator">Idioma de preferencia:</h5>
            {editMode ? (
              <select
                className="registroEdicion__input"
                value={editableData.idioma || ""}
                onChange={(e) => handleChange("idioma", e.target.value)}
              >
                <option value="Español">Español</option>
                <option value="Ingles">Inglés</option>

              </select>
            ) : (
              <p className="info__colaborator">{participante.idioma}</p>
            )}

            <h5 className="label__colaborator">Escuela:</h5>
            {editMode ? (
              <input
                className="registroEdicion__input"
                value={editableData.escuela || ""}
                onChange={(e) => handleChange("escuela", e.target.value)}
              />
            ) : (
              <p className="info__colaborator">{participante.escuela}</p>
            )}
          </div>
        </div>

        <h3 className="subtitle__view">Información personal del tutor</h3>
        <div className="info-grid">
          <div className="info-column">
            <h5 className="label__colaborator">Nombre(s) del tutor:</h5>
            {editMode ? (
              <input
                className="registroEdicion__input"
                value={editableData.nombre_tutor || ""}
                onChange={(e) => handleChange("nombre_tutor", e.target.value)}
              />
            ) : (
              <p className="info__colaborator">{participante.nombre_tutor}</p>
            )}

            <h5 className="label__colaborator">Apellido paterno del tutor:</h5>
            {editMode ? (
              <input
                className="registroEdicion__input"
                value={editableData.apellido_paterno_tutor || ""}
                onChange={(e) =>
                  handleChange("apellido_paterno_tutor", e.target.value)
                }
              />
            ) : (
              <p className="info__colaborator">
                {participante.apellido_paterno_tutor}
              </p>
            )}

            <h5 className="label__colaborator">Correo:</h5>
            {editMode ? (
              <input
                className="registroEdicion__input"
                value={editableData.correo_tutor || ""}
                onChange={(e) => handleChange("correo_tutor", e.target.value)}
              />
            ) : (
              <p className="info__colaborator">{participante.correo_tutor}</p>
            )}
          </div>

          <div className="info-column">
            <h5 className="label__colaborator">Apellido materno del tutor:</h5>
            {editMode ? (
              <input
                className="registroEdicion__input"
                value={editableData.apellido_materno_tutor || ""}
                onChange={(e) =>
                  handleChange("apellido_materno_tutor", e.target.value)
                }
              />
            ) : (
              <p className="info__colaborator">
                {participante.apellido_materno_tutor}
              </p>
            )}

            <h5 className="label__colaborator">Permiso firmado tutor:</h5>
            <button
              className={`registro__botonGrisArchivos ${
                editMode ? "registro__botonDeshabilitado" : ""
              }`}
              disabled={editMode || !participante.permiso_padre_tutor}
              onClick={async () => {
                try {
                  // // Method 1: Direct download if the file URL is available
                  // if (participante.permiso_padre_tutor) {
                  //   window.open(participante.permiso_padre_tutor, '_blank');
                  // }

                  // Method 2: Using the download endpoint
                  const response = await axios.get(`/api/participantes/download/${id}`, {
                    responseType: 'blob'
                  });

                  const url = window.URL.createObjectURL(new Blob([response.data]));
                  const link = document.createElement('a');
                  link.href = url;
                  link.setAttribute('download', 'permiso.pdf');
                  document.body.appendChild(link);
                  link.click();
                  link.remove();
                } catch (error) {
                  console.error("Error downloading file:", error);
                  alert("Error al descargar el archivo");
                }
              }}
            >
              {participante.permiso_padre_tutor ? 'Descargar archivo' : 'No hay archivo disponible'}
            </button>


            <h5 className="label__colaborator">Teléfono del tutor:</h5>
            {editMode ? (
              <input
                className="registroEdicion__input"
                value={editableData.telefono_tutor || ""}
                onChange={(e) => handleChange("telefono_tutor", e.target.value)}
              />
            ) : (
              <p className="info__colaborator">{participante.telefono_tutor}</p>
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
