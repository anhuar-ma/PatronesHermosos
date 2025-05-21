import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import axios from "axios";
import LoadingCard from "../../components/LoadingCard";
import { useEditColaborador } from "../../hooks/useEditColaborador";
import useCurrentRol from "../../hooks/useCurrentRol";
import { useFetchColaborador } from "../../hooks/useFetchColaborador";
import { useNavigate } from "react-router-dom";
import useSedesNames from "../../hooks/useSedesNombres";
import useGrupos from "../../hooks/useGrupos";
import "../../styles/ViewDetails.css";

export default function DetalleColaborador() {
  const { id } = useParams();
  const { colaborador, loading, error, setColaborador } = useFetchColaborador(id);
  const { sedes, loading: sedesLoading, error: sedesError } = useSedesNames();
  const [mostrarSelectGrupo, setMostrarSelectGrupo] = useState(false);
  const [grupoSeleccionado, setGrupoSeleccionado] = useState(null);
  const { grupos, loading: gruposLoading, error: gruposError } = useGrupos();
  const navigate = useNavigate();



  console.log(`Sedes ${sedes}`);
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
      await axios.delete(`/api/colaboradores/${colaborador.id_colaborador}`); // Ajusta esta ruta si es necesario
      alert("Colaborador eliminado correctamente");
      navigate("/admin/colaboradores/"); // Redirige a la tabla de colaboradores
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
    <button
      className="btn-change-group"
      onClick={() => setMostrarSelectGrupo(!mostrarSelectGrupo)}
    >
      {mostrarSelectGrupo ? "Cancelar" : "Cambiar grupo"}
    </button>
    {mostrarSelectGrupo && (
      <>
        {gruposLoading ? (
          <p>Cargando grupos...</p>
        ) : gruposError ? (
          <p>{gruposError}</p>
        ) : (
          <select
            className="registroEdicion__input"
            value={grupoSeleccionado || colaborador.id_grupo}
            onChange={(e) => setGrupoSeleccionado(e.target.value)}
          >
            <option value="">Selecciona un grupo</option>
            {grupos.map((grupo) => (
              <option key={grupo.id_grupo} value={grupo.id_grupo}>
                {grupo.nivel} - {grupo.idioma}
              </option>
            ))}
          </select>
        )}

          <button
            className="btn-edit"
            onClick={async () => {
              try {
                await axios.post(`/api/grupos/${grupoSeleccionado}/colaboradoresDisponibles`, {
                  id_colaborador: colaborador.id_colaborador, // o como tengas ese ID
                });

                alert("Grupo actualizado correctamente");
                window.location.reload(); // o usa una función para recargar los datos sin recargar la página
              } catch (err) {
                alert(
                  "Error al actualizar el grupo: " +
                    (err.response?.data?.message || err.message)
                );
              }
            }}
            disabled={!grupoSeleccionado}
          >
            Confirmar cambio
          </button>

      </>
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
        <button className="btn-delete" onClick={handleDelete}>
          Eliminar registro
        </button>
        </div>
      </div>
    </div>
  );
}
