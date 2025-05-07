import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import axios from "axios";
import LoadingCard from "../../components/LoadingCard";
import "../../styles/ViewDetails.css";

export default function DetalleParticipante() {
  const { id } = useParams();
  const [participante, setParticipante] = useState(null);
  const [editableData, setEditableData] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [editMode, setEditMode] = useState(false);

  useEffect(() => {
    axios
      .get(`/api/participantes/parents/${id}`)
      .then((res) => {
        setParticipante(res.data);
        setEditableData(res.data);
        setLoading(false);
      })
      .catch((err) => {
        setError(err.response?.data?.message || err.message);
        setLoading(false);
      });
  }, [id]);

  const handleChange = (field, value) => {
    setEditableData({ ...editableData, [field]: value });
  };

  const handleSave = () => {
    axios
      .put(`/api/participantes/${id}`, editableData)
      .then(() => {
        setParticipante(editableData);
        setEditMode(false);
      })
      .catch((err) => {
        alert("Error al guardar: " + (err.response?.data?.message || err.message));
      });
  };

  if (loading) return <LoadingCard mensaje="Cargando participante..." />;
  if (error) return <LoadingCard mensaje={error} />;

  return (
    <div className="background__view">
      <div className="colaborador-card">
        <div className="header-actions">
          <h2 className="title__view">Vista detallada de participantes</h2>
          <div className="actions">
            <button className="btn-change-group">Cambiar grupo</button>
            <button className="btn-edit" onClick={() => setEditMode(!editMode)}>
              {editMode ? "Cancelar edición" : "Editar registro"}
            </button>
            {editMode && (
              <button className="btn-save" onClick={handleSave}>
                Guardar cambios
              </button>
            )}
          </div>
        </div>

        <h3 className="subtitle__view">Información personal de la participante</h3>
        <div className="info-grid">
          <div className="info-column">
            <h5 className="label__colaborator">Nombre(s) de la participante:</h5>
            {editMode ? (
              <input value={editableData.nombre || ''} onChange={(e) => handleChange("nombre", e.target.value)} />
            ) : (
              <p className="info__colaborator">{participante.nombre}</p>
            )}

            <h5 className="label__colaborator">Apellido paterno de la participante:</h5>
            {editMode ? (
              <input value={editableData.apellido_paterno || ''} onChange={(e) => handleChange("apellido_paterno", e.target.value)} />
            ) : (
              <p className="info__colaborator">{participante.apellido_paterno}</p>
            )}

            <h5 className="label__colaborator">Correo:</h5>
            {editMode ? (
              <input value={editableData.correo || ''} onChange={(e) => handleChange("correo", e.target.value)} />
            ) : (
              <p className="info__colaborator">{participante.correo}</p>
            )}

            <h5 className="label__colaborator">Escolaridad:</h5>
            {editMode ? (
              <input value={editableData.escolaridad || ''} onChange={(e) => handleChange("escolaridad", e.target.value)} />
            ) : (
              <p className="info__colaborator">{participante.escolaridad}</p>
            )}

            <h5 className="label__colaborator">Grupo asignado:</h5>
            {editMode ? (
              <input value={editableData.id_grupo || ''} onChange={(e) => handleChange("id_grupo", e.target.value)} />
            ) : (
              <p className="info__colaborator">{participante.id_grupo}</p>
            )}
          </div>

          <div className="info-column">
            <h5 className="label__colaborator">Apellido materno de la participante:</h5>
            {editMode ? (
              <input value={editableData.apellido_materno || ''} onChange={(e) => handleChange("apellido_materno", e.target.value)} />
            ) : (
              <p className="info__colaborator">{participante.apellido_materno}</p>
            )}

            <h5 className="label__colaborator">Edad de la participante:</h5>
            {editMode ? (
              <input value={editableData.edad || ''} onChange={(e) => handleChange("edad", e.target.value)} />
            ) : (
              <p className="info__colaborator">{participante.edad}</p>
            )}

            <h5 className="label__colaborator">Idioma de preferencia:</h5>
            {editMode ? (
              <input value={editableData.idioma || ''} onChange={(e) => handleChange("idioma", e.target.value)} />
            ) : (
              <p className="info__colaborator">{participante.idioma}</p>
            )}

            <h5 className="label__colaborator">Escuela:</h5>
            {editMode ? (
              <input value={editableData.escuela || ''} onChange={(e) => handleChange("escuela", e.target.value)} />
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
              <input value={editableData.nombre_tutor || ''} onChange={(e) => handleChange("nombre_tutor", e.target.value)} />
            ) : (
              <p className="info__colaborator">{participante.nombre_tutor}</p>
            )}

            <h5 className="label__colaborator">Apellido paterno del tutor:</h5>
            {editMode ? (
              <input value={editableData.apellido_paterno_tutor || ''} onChange={(e) => handleChange("apellido_paterno_tutor", e.target.value)} />
            ) : (
              <p className="info__colaborator">{participante.apellido_paterno_tutor}</p>
            )}

            <h5 className="label__colaborator">Correo:</h5>
            {editMode ? (
              <input value={editableData.correo_tutor || ''} onChange={(e) => handleChange("correo_tutor", e.target.value)} />
            ) : (
              <p className="info__colaborator">{participante.correo_tutor}</p>
            )}
          </div>

          <div className="info-column">
            <h5 className="label__colaborator">Apellido materno del tutor:</h5>
            {editMode ? (
              <input value={editableData.apellido_materno || ''} onChange={(e) => handleChange("apellido_materno_tutor", e.target.value)} />
            ) : (
              <p className="info__colaborator">{participante.apellido_materno}</p>
            )}

            <h5 className="label__colaborator">Permiso firmado tutor:</h5>
            <button>Descargar archivo</button>

            <h5 className="label__colaborator">Teléfono del tutor:</h5>
            {editMode ? (
              <input value={editableData.telefono_tutor || ''} onChange={(e) => handleChange("telefono_tutor", e.target.value)} />
            ) : (
              <p className="info__colaborator">{participante.telefono_tutor}</p>
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
