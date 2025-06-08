// src/components/TablaParticipantesListado.jsx
import React from "react";
import { ArrowUpAZ, ArrowDownAZ, ArrowDownUp } from "lucide-react";
import { useNavigate } from "react-router-dom";
import useCurrentRol from "../hooks/useCurrentRol";

export default function Tabla({
  coordinadoras,
  onSort,
  sortField,
  sortOrder,
  onStatusChange,
  statusOptions = [],
}) {
  const navigate = useNavigate();
  const { rol } = useCurrentRol();

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
          <th onClick={() => onSort("nombre_sede")}>
            <div className="tablas__thContainer">
              <span>Nombre de coordinadora asociada</span>
              {renderSortArrow("nombre_sede")}
            </div>
          </th>
          <th onClick={() => onSort("correo")}>
            <div className="tablas__thContainer">
              <span>Email</span>
              {renderSortArrow("correo")}
            </div>
          </th>
          <th onClick={() => onSort("nombre_sede")}>
            <div className="tablas__thContainer">
              <span>Sede</span>
              {renderSortArrow("nombre_sede")}
            </div>
          </th>
          <th>Estado</th>
        </tr>
      </thead>

      <tbody>
        {coordinadoras.map((coordinadora) => (
          <tr key={coordinadora.id_coordinadora_asociada}>
            
            <td>{coordinadora.nombre_completo}</td>
            <td>{coordinadora.correo}</td>
            <td>{coordinadora.nombre_sede}</td>
            <td>
              <select
                className={`select-estado select-estado--${coordinadora.estado.toLowerCase()}`}
                value={coordinadora.estado}
                onChange={(e) => onStatusChange(coordinadora.id_coordinadora_asociada, e.target.value)}
              >
                {statusOptions.map((status) => (
                  <option
                    key={status}
                    value={status}
                    disabled={
                      (coordinadora.estado === "Aceptado" ||
                        coordinadora.estado === "Rechazado") &&
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
