import { ArrowUpAZ, ArrowDownAZ, ArrowDownUp } from "lucide-react";
import { useNavigate } from "react-router-dom";

export default function Tabla({
  grupos,
  onSort,
  sortField,
  sortOrder,
}) {
  const renderSortArrow = (field) => {
    if (sortField !== field) return <ArrowDownUp size={14} />;
    return sortOrder === "asc" ? (
      <ArrowDownAZ size={14} />
    ) : (
      <ArrowUpAZ size={14} />
    );
  };

    const navigate = useNavigate();

  return (
    <table className="colaboradores-table">
      <thead>
        <tr>
          <th onClick={() => onSort("id_grupo")}>
            <div className="tablas__thContainer">
              <span>ID</span>
              {renderSortArrow("id_grupo")}
            </div>
          </th>
          <th>
            <div className="tablas__thContainer">
              <span> Idioma</span>
            </div>
          </th>
          <th>
            <div className="tablas__thContainer">
              <span> Nivel</span>
            </div>
          </th>
          <th onClick={() => onSort("mentora")}>
            <div className="tablas__thContainer">
              <span> Mentora</span>
              {renderSortArrow("mentora")}
            </div>
          </th>
          <th onClick={() => onSort("instructora")}>
            <div className="tablas__thContainer">
              <span>Instructora</span>
              {renderSortArrow("instructora")}
            </div>
          </th>
          <th>
            <div className="tablas__thContainer">
              <span>Cupos disponibles</span>
            </div>
          </th>
          <th>Editar Grupo</th>
        </tr>
      </thead>
      <tbody>
        {grupos.map((grupo) => (
          <tr key={grupo.id_grupo}>
            <td>{grupo.id_grupo}</td>
            <td>{grupo.idioma}</td>
            <td>{grupo.nivel}</td>
            <td>{grupo.nombre_mentora?.trim() ? grupo.nombre_mentora : "Sin asignar"}</td>
            <td>{grupo.nombre_instructora?.trim() ? grupo.nombre_instructora : "Sin asignar"}</td>
            <td style={{ textAlign: 'center', verticalAlign: 'middle' }} >{grupo.cupo}</td>
            <td>
              <button
                className="tabla__botonMorado"
                onClick={() =>
                  navigate(`/admin/grupos/${grupo.id_grupo}/listado`)
                }
              >
                Ver detalles
              </button>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}