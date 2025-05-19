import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import axios from "axios";
import LoadingCard from "../../components/LoadingCard";
import { useEditColaborador } from "../../hooks/useEditColaborador";
import useCurrentRol from "../../hooks/useCurrentRol";
import { useFetchColaborador } from "../../hooks/useFetchColaborador";
import useSedesNames from "../../hooks/useSedesNombres";
import "../../styles/ViewDetails.css";

export default function DetalleColaborador() {
  const { id } = useParams();
  const { colaborador, loading, error, setColaborador } = useFetchColaborador(id);
  const { sedes, loading: sedesLoading, error: sedesError } = useSedesNames();

  console.log(`Sedes ${sedes}`);
  const {
    editableData,
    setEditableData,
    handleChange,
    handleSave,
    editMode,
    setEditMode,
  } = useEditColaborador(colaborador);


  const saveChanges = async () => {
    try {
      const updatedData = await handleSave(id);
      setColaborador(updatedData); // Actualiza la información en pantalla
      setEditableData(updatedData); // Actualiza el editableData también
      setEditMode(false);
    } catch (err) {
      alert("Error al guardar: " + err.message);
    }
};


  if (loading) return <LoadingCard mensaje="Cargando colaborador..." />;
  if (error) return <LoadingCard mensaje={error} />;

    // const token = localStorage.getItem("token");
    const currentRol = useCurrentRol();
    console.log(`User current role: ${currentRol}`) ;

  return (
    <div className="background__view">
      <div className="colaborador-card">
        <div className="header-actions">
          <h2 className="title__view">Vista detallada de colaborador</h2>
          <div className="actions">

          {currentRol === 1 && (
            <>
              <button className="btn-change-group">Cambiar grupo</button>
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
          Información personal del colaborador
        </h3>
        <div className="info-grid">
          <div className="info-column">
            <h5 className="label__colaborator">
              Nombre(s) del colaborador:
            </h5>
            {editMode ? (
              <input
                className="registroEdicion__input"
                value={editableData.nombre || ""}
                onChange={(e) => handleChange("nombre", e.target.value)}
              />
            ) : (
              <p className="info__colaborator">{colaborador.nombre}</p>
            )}

            <h5 className="label__colaborator">
              Apellido paterno del colaborador:
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
                {colaborador.apellido_paterno}
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
              <p className="info__colaborator">{colaborador.correo}</p>
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
              <p className="info__colaborator">{colaborador.idioma}</p>
            )}

              {currentRol === 1 && (
                <>
                  <h5 className="label__colaborator">Grupo asignado:</h5>
                  <p className="info__colaborator">{colaborador.id_grupo}</p>
                </>
              )}
            {/* currentRol === 1 ?(
              (<h5 className="label__colaborator">Grupo asignado:</h5>)

            {currentRol === 0 ?(
                          editMode ? (
                            <select
                              className="registroEdicion__input"
                              value={editableData.nombre_sede || ""}
                              onChange={(e) => handleChange("nombre_sede", e.target.value)}
                            >
                              {sedes.map((sede) => (
                                <option key={sede.id_sede} value={sede.id_sede}>
                                  {sede.nombre}
                                </option>
                              ))}
                            </select>  
                          ) : (
                            <p className="info__colaborator">{colaborador.nombre_sede}</p>
                          )
            ): (<p className="info__colaborator">{colaborador.id_grupo}</p>)} */}
            
          </div>

          <div className="info-column">
            <h5 className="label__colaborator">
              Apellido materno del colaborador:
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
                {colaborador.apellido_materno}
              </p>
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

            <h5 className="label__colaborator">Rol al que se postula:</h5>
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

            <h5 className="label__colaborator">Nivel de dominio del idioma:</h5>
            {editMode ? (
              <select
                className="registroEdicion__input"
                value={editableData.nivel || ""}
                onChange={(e) => handleChange("nivel", e.target.value)}
              >
                <option value="Instructora">Basico</option>
                <option value="Facilitadora">Intermedio</option>
                <option value="Staff">Avanzado</option>
              </select>  
            ) : (
              <p className="info__colaborator">{colaborador.nivel}</p>
            )}

          </div>
        </div>


        <div className="delete-button-container">
          <button className="btn-delete">Eliminar registro</button>
        </div>
      </div>
    </div>
  );
}
