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
              <span>Nombre de la participante</span>
              {renderSortArrow("nombre")}
            </div>
          </th>
          <th onClick={() => onSort("apellido_paterno")}>
            <div className="tablas__thContainer">
              <span> Nombre del tutor</span>
              {renderSortArrow("apellido_paterno")}
            </div>
          </th>
          <th>Telefono de contacto</th>
          <th> Grupo </th>
          <th>Mas Información</th>
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
            <td>{participante.nombre}</td>
            <td>{participante.nombre}</td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}
