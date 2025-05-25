import { getSedeNombre } from "../utils/sedeUtils";
import useCurrentRol from "../hooks/useCurrentRol";
import { ArrowUpAZ, ArrowDownAZ, ArrowDownUp } from "lucide-react";
import { useNavigate } from "react-router-dom";

export default function Tabla({
  colaboradores,
  onSort,
  sortField,
  sortOrder,
  statusOptions = [], // Array of possible estados
  onStatusChange,
}) {

  const navigate = useNavigate();
  const renderSortArrow = (field) => {
    if (sortField !== field) return <ArrowDownUp size={14} />;
    return sortOrder === "asc" ? (
      <ArrowDownAZ size={14} />
    ) : (
      <ArrowUpAZ size={14} />
    );
  };

  const currentRol = useCurrentRol();
  console.log(currentRol);

  return (
    <table className="colaboradores-table">
      <thead>
        <tr>
          <th onClick={() => onSort("nombre_completo_colaborador")}>
            {" "}
            <div className="tablas__thContainer">
              <span>Nombre</span>
              {renderSortArrow("nombre_completo_colaborador")}
            </div>
          </th>
          <th>
            <div className="tablas__thContainer">
              <span> Rol</span>
            </div>
          </th>
          {currentRol === 0 ? <th>Sede</th> : <th>Grupo</th>}

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
            <td>{colaborador.nombre_completo_colaborador}</td>
            <td>{colaborador.rol}</td>
            {currentRol === 0 ? (
              <td>{colaborador.nombre_sede || "Sin asignar"}</td>
            ): (
              <td>{colaborador.id_grupo || "Sin asignar"}</td>
            )}
            <td>{colaborador.correo}</td>
            {/* <td>{colaborador.universidad}</td> */}
            <td>
            <button
                className="tabla__botonMorado"
                onClick={() =>
                  navigate(`/admin/colaboradores/${colaborador.id_colaborador}`)
                }
              >
                Ver detalles
              </button>
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
