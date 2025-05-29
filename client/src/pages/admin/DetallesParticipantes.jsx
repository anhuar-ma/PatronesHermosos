import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import axios from "axios";
import LoadingCard from "../../components/LoadingCard";
import { useEditParticipante } from "../../hooks/useEditParticipante";
import { useNavigate } from "react-router-dom";
import { useFetchParticipante } from "../../hooks/useFetchParticipante";
import "../../styles/ViewDetails.css";
import useCurrentRol from "../../hooks/useCurrentRol";
import { FaArrowLeft } from "react-icons/fa";
import PhoneInput from 'react-phone-input-2';

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

  const saveChanges = async () => {
    const requiredFields = [
      { field: "nombre", message: "El nombre es obligatorio" },
      { field: "apellido_paterno", message: "El apellido paterno es obligatorio" },
      { field: "correo", message: "El correo es obligatorio" },
      { field: "escolaridad", message: "La escolaridad es obligatoria" },
      { field: "edad", message: "La edad es obligatoria" },
      { field: "idioma", message: "El idioma es obligatorio" },
      { field: "escuela", message: "La escuela es obligatoria" },
      { field: "nombre_tutor", message: "El nombre del tutor es obligatorio" },
      { field: "apellido_paterno_tutor", message: "El apellido paterno del tutor es obligatorio" },
      { field: "correo_tutor", message: "El correo del tutor es obligatorio" },
      { field: "telefono_tutor", message: "El teléfono del tutor es obligatorio" }
    ];
  
    const newErrors = {};
    for (const req of requiredFields) {
      if (
        !editableData[req.field] ||
        String(editableData[req.field]).trim() === ""
      ) {
        newErrors[req.field] = req.message;
      }
      
    }
    
    
    // Verificar formato del correo si tiene contenido
    if (editableData.correo && typeof editableData.correo === "string" && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(editableData.correo.trim())) {
      newErrors.correo = "Ingresa un correo electrónico válido.";
    }

    // Verificar formato del correo si tiene contenido
    if (editableData.correo_tutor && typeof editableData.correo_tutor === "string" && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(editableData.correo.trim())) {
      newErrors.correo_tutor = "Ingresa un correo electrónico válido.";
    }

    // Validar la edad
    if (
      editableData.edad !== undefined &&
      (isNaN(editableData.edad) || editableData.edad < 0 || editableData.edad > 100)
    ) {
      newErrors.edad = "La edad debe ser menor a 100.";
    }

    

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }
  
    try {
      const updatedData = await handleSave(id);
      setParticipante(updatedData); // Actualiza la información en pantalla
      setEditableData(updatedData); // Actualiza el editableData también
      setEditMode(false);
      setErrors({}); // Limpia los errores al guardar correctamente
    } catch (err) {
      alert("Error al guardar: " + err.message);
    }
  };


    if (loading)
      return (
        <div style={{ 
          marginLeft: "18%",
          display: "flex", 
          justifyContent: "center", 
          alignItems: "center", 
          height: "100vh", 
          backgroundColor: "#9E629A"
        }}>
          <LoadingCard mensaje="Cargando participantes..." />
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
          <h2 className="title__view">Vista detallada de participantes</h2>
          <div className="actions">
            <button
              className={`btn-edit ${
                editMode ? "registroEdicion__botonCancelar" : ""
              }`}
              onClick={() => {
                if (editMode) {
                  // Si se cancela, reinicia los datos editables a los originales
                  setEditableData(participante);
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

        <h3 className="subtitle__view">
          Información personal de la participante
        </h3>
        <div className="info-grid">
          <div className="info-column">
            <h5 className="label__colaborator">
              Nombre(s) de la participante:
            </h5>
            {editMode ? (
              <>
              <input
                className="registroEdicion__input"
                value={editableData.nombre || ""}
                onChange={(e) =>{
                  handleChange("nombre", e.target.value);
                  setErrors({...errors, nombre: "" }); 
                }}
              />
              {errors.nombre && <p className="error-message">{errors.nombre}</p>}
              </>
            ) : (
              <p className="info__colaborator">{participante.nombre}</p>
            )}

            <h5 className="label__colaborator">
              Apellido paterno de la participante:
            </h5>
            {editMode ? (
              <>
              <input
                className="registroEdicion__input"
                value={editableData.apellido_paterno || ""}
                onChange={(e) =>{
                  handleChange("apellido_paterno", e.target.value);
                  setErrors({...errors, apellido_paterno: "" });
                }}
              />
              {errors.apellido_paterno && <p className="error-message">{errors.apellido_paterno}</p>}
            </>
            ) : (
              <p className="info__colaborator">
                {participante.apellido_paterno}
              </p>
            )}

            <h5 className="label__colaborator">Correo:</h5>
            {editMode ? (
              <>
              <input
                className="registroEdicion__input"
                value={editableData.correo || ""}
                onChange={(e) =>{
                  handleChange("correo", e.target.value)
                  setErrors({...errors, correo: "" });
                }}
              />
              {errors.correo && <p className="error-message">{errors.correo}</p>}
            </>
            ) : (
              <p className="info__colaborator">{participante.correo}</p>
            )}

            <h5 className="label__colaborator">Escolaridad:</h5>
            {editMode ? (
              <>
                <select
                  className="registroEdicion__input"
                  value={editableData.escolaridad || ""}
                  onChange={(e) => {
                    handleChange("escolaridad", e.target.value);
                    setErrors({ ...errors, escolaridad: "" });
                  }}
                >
                  <option value={editableData.escolaridad}>
                    {editableData.escolaridad}
                  </option>
                  {editableData.escolaridad === "Secundaria" ? (
                    <option value="Prepa">Prepa</option>
                  ) : (
                    <option value="Secundaria">Secundaria</option>
                  )}
                </select>
                {errors.escolaridad && <p className="error-message">{errors.escolaridad}</p>}
              </>
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
                {participante.apellido_materno || "N/A"}
              </p>
            )}

            <h5 className="label__colaborator">Edad de la participante:</h5>
            {editMode ? (
              <>
              <input
                type="number"
                className="registroEdicion__input"
                value={editableData.edad || ""}
                onChange={(e) => {
                  handleChange("edad", e.target.value)
                }}
              />
              {errors.edad && <p className="error-message">{errors.edad}</p>}
              </>
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
              <>
              <input
                className="registroEdicion__input"
                value={editableData.escuela || ""}
                onChange={(e) => {
                  handleChange("escuela", e.target.value);
                  setErrors({ ...errors, escuela: "" });

                }}
              />
              {errors.escuela && <p className="error-message">{errors.escuela}</p>}
              </>
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
              <>
              <input
                className="registroEdicion__input"
                value={editableData.nombre_tutor || ""}
                onChange={(e) => {
                  handleChange("nombre_tutor", e.target.value);
                  setErrors({ ...errors, nombre_tutor: "" });
                }}
              />
              {errors.nombre_tutor && <p className="error-message">{errors.nombre_tutor}</p>}
              </>
            ) : (
              <p className="info__colaborator">{participante.nombre_tutor}</p>
            )}

            <h5 className="label__colaborator">Apellido paterno del tutor:</h5>
            {editMode ? (
              <>
              <input
                className="registroEdicion__input"
                value={editableData.apellido_paterno_tutor || ""}
                onChange={(e) => {
                  handleChange("apellido_paterno_tutor", e.target.value)
                  setErrors({ ...errors, apellido_paterno_tutor: "" });
                }}
              />
              {errors.apellido_paterno_tutor && <p className="error-message">{errors.apellido_paterno_tutor}</p>}
              </>
            ) : (
              <p className="info__colaborator">
                {participante.apellido_paterno_tutor}
              </p>
            )}

            <h5 className="label__colaborator">Correo:</h5>
            {editMode ? (
              <>
              <input
                className="registroEdicion__input"
                value={editableData.correo_tutor || ""}
                onChange={(e) => {
                  handleChange("correo_tutor", e.target.value);
                  setErrors({ ...errors, correo_tutor: "" })
                }}
              />
              {errors.correo_tutor && <p className="error-message">{errors.correo_tutor}</p>}
              </>
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
                {participante.apellido_materno_tutor || "N/A"}
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
              <>
                <PhoneInput
                  country={'mx'} // Cambia a 'us' o cualquier país por defecto si lo prefieres
                  value={editableData.telefono_tutor || ''}
                  onChange={(phone) => {
                    handleChange('telefono_tutor', phone);
                    setErrors({ ...errors, telefono_tutor: '' });
                  }}
                  inputClass="registroEdicion__input"
                  containerStyle={{ width: '100%' }}
                  specialLabel="" // Quita el label interno
                />
                {errors.telefono_tutor && <p className="error-message">{errors.telefono_tutor}</p>}
              </>
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
