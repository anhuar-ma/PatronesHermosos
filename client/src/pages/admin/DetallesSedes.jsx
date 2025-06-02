import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import axios from "axios";
import LoadingCard from "../../components/LoadingCard";
import { useEditSede } from "../../hooks/useEditSede";
import { useFetchSede } from "../../hooks/useFetchSede";
import { useNavigate } from "react-router-dom";
import { FaArrowLeft } from "react-icons/fa";
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

  // Agrega un estado para errores
  const [errors, setErrors] = useState({});

  // Función para regresar
  const handleGoBack = () => {
    navigate(-1);
  };

  const handleDelete = async () => {
    const confirmDelete = window.confirm("¿Estás seguro de que deseas eliminar esta sede?");
    if (!confirmDelete) return;

    try {
      await axios.delete(`/api/sedes/${sede.id_sede}`);
      alert("Sede eliminada correctamente");
      navigate("/admin/sedes/");
    } catch (err) {
      alert(
        "Error al eliminar la sede: " +
        (err.response?.data?.message || err.message)
      );
    }
  };

  function formatDate(dateStr) {
    if (!dateStr) return "";
    const date = new Date(dateStr);
    if (isNaN(date.getTime())) return dateStr;
    const day = ("0" + date.getDate()).slice(-2);
    const month = ("0" + (date.getMonth() + 1)).slice(-2);
    const year = date.getFullYear();
    return `${day}/${month}/${year}`;
  }

  const saveChanges = async () => {
    // Lista de campos obligatorios y sus mensajes
    const requiredFields = [
      { field: "nombre", message: "El nombre de la coordinadora es obligatorio." },
      { field: "apellido_paterno", message: "El apellido paterno de la coordinadora es obligatorio." },
      { field: "correo", message: "El correo de la coordinadora es obligatorio." },
      { field: "nombre_sede", message: "El nombre de la sede es obligatorio." },
      { field: "fecha_inicio", message: "La fecha de inicio es obligatoria." },
    ];

    const newErrors = {};
    for (const req of requiredFields) {
      if (!editableData[req.field] || editableData[req.field].trim() === "") {
        newErrors[req.field] = req.message;
      }
    }

    // Verificar formato del correo si tiene contenido
    if (editableData.correo && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(editableData.correo.trim())) {
      newErrors.correo = "Ingresa un correo electrónico válido.";
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    try {
      const updatedData = await handleSave(id);
      setSede(updatedData);
      setEditableData(updatedData);
      setEditMode(false);
      setErrors({});
    } catch (err) {
      alert("Error al guardar: " + err.message);
    }
  };

  if (loading)
    return (
      <div style={{
        marginLeft: '18%',
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        height: "100vh",
        backgroundColor: "#9E629A"
      }}>
        <LoadingCard mensaje="Cargando info de sede..." />
      </div>
    );
  if (error) return <LoadingCard mensaje={error} />;

  return (
    <div className="background__view">
      <div className="colaborador-card">
        <button className="btn-regresar" onClick={handleGoBack}>
          <FaArrowLeft className="btn-regresar__icon" /> Regresar
        </button>
        <div className="header-actions">
          <h2 className="title__view">Vista detallada de Sedes</h2>
          <div className="actions">
            <button
              className={`btn-edit ${editMode ? "registroEdicion__botonCancelar" : ""}`}
              onClick={() => {
                if (editMode) {
                  // Si se cancela, reinicia los datos editables a los originales
                  setEditableData(sede);
                }
                setEditMode(!editMode);
                setErrors({});
              }}
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

        <h3 className="subtitle__view">Información personal de la coordinadora</h3>
        <div className="info-grid">
          <div className="info-column">
            <h5 className="label__colaborator">Nombre(s) de la coordinadora:</h5>
            {editMode ? (
              <>
                <input
                  className="registroEdicion__input"
                  value={editableData.nombre || ""}
                  onChange={(e) => {
                    handleChange("nombre", e.target.value);
                    setErrors({ ...errors, nombre: "" });
                  }}
                />
                {errors.nombre && <p className="error-message">{errors.nombre}</p>}
              </>
            ) : (
              <p className="info__colaborator">{sede.nombre}</p>
            )}

            <h5 className="label__colaborator">Apellido paterno de la coordinadora:</h5>
            {editMode ? (
              <>
                <input
                  className="registroEdicion__input"
                  value={editableData.apellido_paterno || ""}
                  onChange={(e) => {
                    handleChange("apellido_paterno", e.target.value);
                    setErrors({ ...errors, apellido_paterno: "" });
                  }}
                />
                {errors.apellido_paterno && <p className="error-message">{errors.apellido_paterno}</p>}
              </>
            ) : (
              <p className="info__colaborator">{sede.apellido_paterno}</p>
            )}
          </div>

          <div className="info-column">
            <h5 className="label__colaborator">Apellido materno de la coordinadora:</h5>
            {editMode ? (
              <>
                <input
                  className="registroEdicion__input"
                  value={editableData.apellido_materno || ""}
                  onChange={(e) => handleChange("apellido_materno", e.target.value)}
                />
              </>
            ) : (
              <p className="info__colaborator">{sede.apellido_materno || "N/A"}</p>
            )}

            <h5 className="label__colaborator">Correo:</h5>
            {editMode ? (
              <>
                <input
                  className="registroEdicion__input"
                  value={editableData.correo || ""}
                  onChange={(e) => {
                    handleChange("correo", e.target.value);
                    setErrors({ ...errors, correo: "" });
                  }}
                />
                {errors.correo && <p className="error-message">{errors.correo}</p>}
              </>
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
              <>
                <input
                  className="registroEdicion__input"
                  value={editableData.nombre_sede || ""}
                  onChange={(e) => {
                    handleChange("nombre_sede", e.target.value);
                    setErrors({ ...errors, nombre_sede: "" });
                  }}
                />
                {errors.nombre_sede && <p className="error-message">{errors.nombre_sede}</p>}
              </>
            ) : (
              <p className="info__colaborator">{sede.nombre_sede}</p>
            )}

            <h5 className="label__colaborator">Fecha de inicio:</h5>
            {editMode ? (
              <>
                <select
                  className="registroEdicion__input"
                  value={editableData.fecha_inicio || ""}
                  onChange={(e) => {
                    handleChange("fecha_inicio", e.target.value);
                    setErrors({ ...errors, fecha_inicio: "" });
                  }}
                >
                  <option value="">{formatDate(sede.fecha_inicio)}</option>
                  <option value="06/16/25">16/06/2025</option>
                  <option value="06/23/25">23/06/2025</option>
                  <option value="06/30/25">30/06/2025</option>
                  <option value="07/07/25">07/07/2025</option>
                  <option value="07/14/25">14/07/2025</option>
                </select>
                {errors.fecha_inicio && <p className="error-message">{errors.fecha_inicio}</p>}
              </>
            ) : (
              <p className="info__colaborator">{formatDate(sede.fecha_inicio)}</p>
            )}
          </div>

          <div className="info-column">
            <h5 className="label__colaborator">Convocatoria de sede:</h5>
            <button
              className={`registro__botonGrisArchivos ${editMode ? "registro__botonDeshabilitado" : ""}`}
              disabled={editMode || !sede.convocatoria}
              onClick={async () => {
                try {
                  // Get the file but don't download it - instead open in a new tab
                  const response = await axios.get(`/api/sedes/download/${id}`, {
                    responseType: 'blob'
                  });

                  // Create a blob URL from the response
                  const url = window.URL.createObjectURL(new Blob([response.data], {
                    type: 'application/pdf'
                  }));

                  // Open the URL in a new tab instead of downloading
                  window.open(url, '_blank');
                } catch (error) {
                  console.error("Error displaying file:", error);
                  alert("Error al mostrar el archivo");
                }

              }

              }
            >
              {sede.convocatoria ? "Ver archivo" : "No hay archivo disponible"}
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