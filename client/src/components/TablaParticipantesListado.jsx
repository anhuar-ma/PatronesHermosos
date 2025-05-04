import { ArrowUpAZ, ArrowDownAZ, ArrowDownUp } from "lucide-react";
import { useNavigate } from "react-router-dom";


export default function Tabla({
  participantes,
  onSort,
  sortField,
  sortOrder,
  onStatusChange,
  statusOptions = [], // valor por defecto para evitar errores
}) {

  const navigate =  useNavigate();

  const handleVerDetalles = (id) => {
    navigate(`/detalle-participante/${id}`);
  };


  const renderSortArrow = (field) => {
    if (sortField !== field) return <ArrowDownUp size={14} />;
    return sortOrder === "asc" ? (
      <ArrowDownAZ size={14} />
    ) : (
      <ArrowUpAZ size={14} />
    );
  };

  return (
    <table className="colaboradores-table">
      <thead>
        <tr>
          <th onClick={() => onSort("nombre")}>
            <div className="tablas__thContainer">
              <span>Nombre de la participante</span>
              {renderSortArrow("nombre")}
            </div>
          </th>
          <th onClick={() => onSort("apellido_paterno")}>
            <div className="tablas__thContainer">
              <span>Nombre del tutor</span>
              {renderSortArrow("apellido_paterno")}
            </div>
          </th>
          <th>Teléfono de contacto</th>
          <th>Grupo</th>
          <th>Más Información</th>
          <th>Estado</th>
        </tr>
      </thead>
      <tbody>
        {participantes.map((participante) => (
          <tr key={participante.id_colaborador}>
            <td>{`${participante.nombre} ${participante.apellido_paterno} ${participante.apellido_materno}`}</td>
            <td>{`${participante.nombre_tutor} ${participante.apellido_paterno_tutor} ${participante.apellido_materno_tutor}`}</td>
            <td>{participante.telefono_tutor}</td>
            <td>{participante.id_grupo}</td>
            <td>
                <button
                    className="tabla__botonMorado"
                     onClick={() => handleVerDetalles(p.id_participante)}
                    >
                    Ver detalles
                </button>
            </td>
            <td>
              {" "}
              <select
                className={`select-estado select-estado--${participante.estado.toLowerCase()}`}
                value={participante.estado}
                onChange={(e) =>
                  onStatusChange(participante.id_participante, e.target.value)
                }
              >
                {statusOptions.map((status) => (
                  <option
                    key={status}
                    value={status}
                    disabled={
                      (participante.estado === "Aceptado" ||
                        participante.estado === "Rechazado") &&
                      status === "Pendiente"
                    }
                  >
                    {status}
                  </option>
                ))}
              </select>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}
