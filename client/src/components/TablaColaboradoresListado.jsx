import { getSedeNombre } from "../utils/sedeUtils";
import { ArrowUpAZ, ArrowDownAZ, ArrowDownUp } from "lucide-react";

export default function Tabla({
  colaboradores,
  onSort,
  sortField,
  sortOrder,
  statusOptions = [], // Array of possible estados
  onStatusChange,
}) {
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
            {" "}
            <div className="tablas__thContainer">
              <span>Nombre</span>
              {renderSortArrow("nombre")}
            </div>
          </th>
          <th onClick={() => onSort("rol")}>
            <div className="tablas__thContainer">
              <span> Rol</span>
              {renderSortArrow("universidad")}
            </div>
          </th>
          <th>Sede</th>

          {/* <th onClick={() => onSort("universidad")}>
            <div className="tablas__thContainer">
              <span> Universidad</span>
              {renderSortArrow("universidad")}
            </div>
          </th> */}
          <th onClick={() => onSort("correo")}>
            <div className="tablas__thContainer">
              <span> Correo</span>
              {renderSortArrow("correo")}
            </div>
          </th>
          <th>Mas información</th>

          <th>Estado</th>
        </tr>
      </thead>
      <tbody>
        {colaboradores.map((colaborador) => (
          <tr key={colaborador.id_colaborador}>
            <td>{`${colaborador.nombre} ${colaborador.apellido_paterno} ${colaborador.apellido_materno}`}</td>
            <td>{colaborador.rol}</td>
            <td>{colaborador.id_sede}</td>
            <td>{colaborador.correo}</td>
            {/* <td>{colaborador.universidad}</td> */}
            <td>
              <button className="tabla__botonMorado">Ver detalles</button>
            </td>

            {/* <td>{colaborador.estado}</td>
             */}
            <td>
              {" "}
              <select
                className={`select-estado select-estado--${colaborador.estado.toLowerCase()}`}
                value={colaborador.estado}
                onChange={(e) =>
                  onStatusChange(colaborador.id_colaborador, e.target.value)
                }
              >
                {statusOptions.map((status) => (
                  <option
                    key={status}
                    value={status}
                    disabled={
                      (colaborador.estado === "Aceptado" ||
                        colaborador.estado === "Rechazado") &&
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
