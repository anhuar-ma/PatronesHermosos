import { ArrowUpAZ, ArrowDownAZ, ArrowDownUp } from "lucide-react";

export default function Tabla({ participantes, onSort, sortField, sortOrder }) {
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
          <th onClick={() => onSort("apellido_paterno")}>
            <div className="tablas__thContainer">
              <span> Apellidos</span>
              {renderSortArrow("apellido_paterno")}
            </div>
          </th>
          <th onClick={() => onSort("correo")}>
            <div className="tablas__thContainer">
              <span> Correo</span>
              {renderSortArrow("correo")}
            </div>
          </th>
          <th onClick={() => onSort("universidad")}>
            <div className="tablas__thContainer">
              <span> Universidad</span>
              {renderSortArrow("universidad")}
            </div>
          </th>
          <th onClick={() => onSort("rol")}>
            <div className="tablas__thContainer">
              <span> Rol</span>
              {renderSortArrow("universidad")}
            </div>
          </th>
          <th>Sede</th>
          <th>Estado</th>
        </tr>
      </thead>
      <tbody>
        {colaboradores.map((colaborador) => (
          <tr key={colaborador.id_colaborador}>
            <td>{colaborador.nombre}</td>
            <td>{`${colaborador.apellido_paterno} ${colaborador.apellido_materno}`}</td>
            <td>{colaborador.correo}</td>
            <td>{colaborador.universidad}</td>
            <td>{colaborador.rol}</td>
            <td>{getSedeNombre(colaborador.id_sede)}</td>
            <td>{colaborador.estado}</td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}
