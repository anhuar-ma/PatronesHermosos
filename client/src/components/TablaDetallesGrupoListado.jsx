import { ArrowUpAZ, ArrowDownAZ, ArrowDownUp } from "lucide-react";

export default function Tabla({
  grupos,
  onSort,
  sortField,
  sortOrder,
  onDelete,
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
          <th onClick={() => onSort("nombre_completo")}>
            <div className="tablas__thContainer">
              <span>Nombre</span>
              {renderSortArrow("nombre_completo")}
            </div>
          </th>
          <th>
            <div className="tablas__thContainer">
              <span>Rol</span> 
            </div>
          </th>
          <th>
            <div className="tablas__thContainer">
              <span>Eliminar</span>
            </div>
          </th>
        </tr>
      </thead>
      <tbody>
        {grupos.map((grupo) => (
          <tr key={grupo.id}>
            <td>{grupo.nombre_completo}</td>
            <td>{grupo.rol}</td>
            <td>
              <button
                className="tabla__botonMorado"
                onClick={() => {
                  onDelete(grupo.id_integrante, grupo.rol);
                }}
              >
                Eliminar
              </button>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}

