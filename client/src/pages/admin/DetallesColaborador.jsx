import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import axios from "axios";
import LoadingCard from "../../components/LoadingCard";
import { useEditColaborador } from "../../hooks/useEditColaborador";
import useCurrentRol from "../../hooks/useCurrentRol";
import { useFetchColaborador } from "../../hooks/useFetchColaborador";
import { FaArrowLeft } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import useGrupos from "../../hooks/useGrupos";
import CambiarGrupo from "../../components/CambiarGrupo";
import "../../styles/ViewDetails.css";
import { set } from "react-hook-form";

export default function DetalleColaborador() {
  const { id } = useParams();
  const { colaborador, loading, error, setColaborador } = useFetchColaborador(id);
  const [mostrarCambiarGrupo, setMostrarCambiarGrupo] = useState(false);
  const { grupos, loading: gruposLoading, error: gruposError } = useGrupos();
  const navigate = useNavigate();
  const currentRol = useCurrentRol();

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


    // Agrega un estado para errores
    const [errors, setErrors] = useState({});

    // Función para regresar
    const handleGoBack = () => {
      navigate(-1);
    };



  const saveChanges = async () => {
    const requiredFields = [
      { field: "nombre", message: "El nombre es obligatorio" },
      { field: "apellido_paterno", message: "El apellido paterno es obligatorio" },
      { field: "correo", message: "El correo es obligatorio" },
      { field: "universidad", message: "La universidad es obligatoria" },
    ]

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
    
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    try {
      const updatedData = await handleSave(id);
      setColaborador(updatedData);
      setEditableData(updatedData);
      setEditMode(false);
      setErrors({}); // Limpiar errores al guardar correctamente
    } catch (err) {
      alert("Error al guardar: " + err.message);
    }
  };

  if (loading)
    return (
      <div style={{
        marginLeft: '18%', // igual al sidebar
        height: '100vh',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: "#9E629A"
      }}>
        <LoadingCard mensaje="Cargando colaborador..." />
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
          <h2 className="title__view">Vista detallada de colaborador</h2>
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

        <h3 className="subtitle__view">Información personal del colaborador</h3>
        <div className="info-grid">
          <div className="info-column">
            <h5 className="label__colaborator">Nombre(s) del colaborador:</h5>
            {editMode ? (
              <>
              <input
                className="registroEdicion__input"
                value={editableData.nombre || ""}
                onChange={(e) => {
                  handleChange("nombre", e.target.value);
                  setErrors(...errors, { nombre: "" });
                }}
              />
                {errors.nombre && <p className="error-message">{errors.nombre}</p>}
              </>
            ) : (
              <p className="info__colaborator">{colaborador.nombre}</p>
            )}

            <h5 className="label__colaborator">Apellido paterno del colaborador:</h5>
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
            <p className="info__colaborator">{colaborador.id_grupo || "Sin asignar"}</p>

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
              <p className="info__colaborator">{colaborador.apellido_materno || "N/A"}</p>
            )}

            <h5 className="label__colaborator">Universidad de procedencia:</h5>
            {editMode ? (
              <>
              <input
                className="registroEdicion__input"
                value={editableData.universidad || ""}
                onChange={(e) => {
                   handleChange("universidad", e.target.value)
                    setErrors({ ...errors, universidad: "" });
                }}
              />
                {errors.universidad && <p className="error-message">{errors.universidad}</p>}
              </>
            ) : (
              <p className="info__colaborator">{colaborador.universidad}</p>
            )}

          <h5 className="label__colaborator">Rol:</h5>
            {editMode ? (
              <select
                className="registroEdicion__input"
                value={editableData.rol || ""}
                onChange={(e) => handleChange("rol", e.target.value)}
              >
                <option value="Instructora">Instructora</option>
                <option value="Facilitadora">Facilitadora</option>
                <option value="Staff">Staff</option>

              </select>
            ) : (
              <p className="info__colaborator">{colaborador.rol}</p>
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
