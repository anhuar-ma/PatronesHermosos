// src/components/TablaParticipantesListado.jsx
import React from "react";
import useCurrentRol from "../hooks/useCurrentRol";
import { ArrowUpAZ, ArrowDownAZ, ArrowDownUp } from "lucide-react";
import { useNavigate } from "react-router-dom";

export default function Tabla({
  mentoras,
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
          <th onClick={() => onSort("nombre_completo_mentora")}>
            <div className="tablas__thContainer">
              <span>Nombre de la mentora</span>
              {renderSortArrow("nombre_completo_mentora")}
            </div>
          </th>
          <th onClick={() => onSort("correo")}>
            <div className="tablas__thContainer">
              <span>Correo</span>
              {renderSortArrow("correo")}
            </div>
          </th>
          <th>Ver detalles</th>
          <th>Estado</th>
        </tr>
      </thead>

      <tbody>
        {mentoras.map((mentora) => (
          <tr key={mentora.id_mentora}>
            <td>{mentora.nombre_completo_mentora}</td>
            <td>{mentora.correo}</td>
            <td>
              <button
                className="tabla__botonMorado"
                onClick={() =>
                  navigate(`/admin/mentoras/${mentora.id_mentora}`)
                }
              >
                Ver detalles
              </button>
            </td>
            <td>
              {rol === 1 ? <span>{mentora.estado}</span>:(
                <select
                className={`select-estado select-estado--${mentora.estado.toLowerCase()}`}
                  value={mentora.estado}
                  onChange={(e) =>
                    onStatusChange(mentora.id_mentora, e.target.value)
                  }
                >
                  {statusOptions.map((status) => (
                    <option key={status} value={status}>
                      {status}
                    </option>
                  ))}
                </select>
              )}
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}
