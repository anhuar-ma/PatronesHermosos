// src/components/TablaParticipantesListado.jsx
import React from "react";
import { ArrowUpAZ, ArrowDownAZ, ArrowDownUp } from "lucide-react";
import { useNavigate } from "react-router-dom";

export default function Tabla({
  sedes,
  onSort,
  sortField,
  sortOrder,
  onStatusChange,
  statusOptions = [],
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

  return (
    <table className="colaboradores-table">
      <thead>
        <tr>
          <th onClick={() => onSort("nombre")}>
            <div className="tablas__thContainer">
              <span>Nombre de la coordinadora</span>
              {renderSortArrow("nombre")}
            </div>
          </th>
          <th onClick={() => onSort("apellido_paterno")}>
            <div className="tablas__thContainer">
              <span>Email</span>
              {renderSortArrow("apellido_paterno")}
            </div>
          </th>
          <th>Nombre de sede</th>
          <th>Fecha de inicio</th>
          <th>Ver permiso</th>
          <th>Estado</th>
        </tr>
      </thead>

      <tbody>
        {sedes.map((sede) => (
          <tr key={sede.id_sedes}>
            <td>{sede.nombre_completo_coordinadora}</td>
            <td>{sede.correo}</td>
            <td>{sede.nombre_sede}</td>
            <td>
              {new Date(sede.fecha_inicio).toLocaleDateString("es-MX", {
                day: "2-digit",
                month: "2-digit",
                year: "numeric",
              })}
            </td>
            <td>
              <button className="tabla__botonGris">Ver archivo</button>
            </td>
            <td>
              <select
                className={`select-estado select-estado--${sede.estado.toLowerCase()}`}
                value={sede.estado}
                onChange={(e) => onStatusChange(sede.id_sede, e.target.value)}
              >
                {statusOptions.map((status) => (
                  <option
                    key={status}
                    value={status}
                    disabled={
                      (sede.estado === "Aceptado" ||
                        sede.estado === "Rechazado") &&
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
