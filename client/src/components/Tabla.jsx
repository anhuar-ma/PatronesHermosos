import { getSedeNombre } from "../utils/sedeUtils";
export default function Tabla({ colaboradores, onSort, sortField, sortOrder }) {
  const renderSortArrow = (field) => {
    if (sortField !== field) return null;
    return sortOrder === "asc" ? " ▲" : " ▼";
  };

  return (
    <div className="table-container">
      <table className="colaboradores-table">
        <thead>
          <tr>
            <th onClick={() => onSort("nombre")}>Nombre{renderSortArrow("nombre")}</th>
            <th onClick={() => onSort("apellido_paterno")}>Apellidos{renderSortArrow("apellido_paterno")}</th>
            <th onClick={() => onSort("correo")}>Correo{renderSortArrow("correo")}</th>
            <th onClick={() => onSort("universidad")}>Universidad{renderSortArrow("universidad")}</th>
            <th onClick={() => onSort("rol")}>Rol{renderSortArrow("rol")}</th>
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
    </div>
  );
}
