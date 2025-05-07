import { getSedeNombre } from "../utils/sedeUtils";
import "../styles/ColaboradorDetail.css";

export default function ColaboradorCard({ colaborador, onDelete, onEdit, onChangeGroup }) {
  return (


    <div className="background__view">
        <div className="colaborador-card">
            <div className="header-actions">
                <h2 className="title__view">Vista detallada de colaboradores</h2>
                <div className="actions">
                <button className="btn-change-group" onClick={onChangeGroup}>Cambiar grupo</button>
                <button className="btn-edit" onClick={onEdit}>Editar registro</button>
                </div>
            </div>

            <h3 className="subtitle__view">Información personal</h3>

            <div className="info-grid">
                <div className="info-column">
                <h5 className="label__colaborator">Nombre(s) de la candidata:</h5>
                <p className="info__colaborator">{colaborador.nombre}</p>

                <h5 className="label__colaborator">Apellido paterno de la candidata:</h5>
                <p className="info__colaborator">{colaborador.apellido_paterno}</p>

                <h5 className="label__colaborator">Correo:</h5>
                <p className="info__colaborator">{colaborador.correo}</p>

                <h5 className="label__colaborator">Idioma de preferencia:</h5>
                <p className="info__colaborator">{colaborador.idioma}</p>

                <h5 className="label__colaborator">Carrera universitaria:</h5>
                <p className="info__colaborator">{colaborador.carrera}</p>

                <h5 className="label__colaborator">Grupo asignado:</h5>
                <p className="info__colaborator">{colaborador.id_grupo}</p>
                </div>

                <div className="info-column">
                <h5 className="label__colaborator">Apellido materno de la candidata:</h5>
                <p className="info__colaborator">{colaborador.apellido_materno}</p>

                <h5 className="label__colaborator">Universidad de procedencia:</h5>
                <p className="info__colaborator">{colaborador.universidad}</p>

                <h5 className="label__colaborator">Rol al que se postula:</h5>
                <p className="info__colaborator">{colaborador.rol}</p>

                <h5 className="label__colaborator">Nivel de dominio del idioma:</h5>
                <p className="info__colaborator">{colaborador.nivel}</p>

                <h5 className="label__colaborator">Sede:</h5>
                <p className="info__colaborator">{getSedeNombre(colaborador.id_sede)}</p>
                </div>
            </div>

            <div className="delete-button-container">
                <button className="btn-delete" onClick={onDelete}>Eliminar registro</button>
            </div>
        </div>
    </div>
  );
}
