// src/components/TablaParticipantesListado.jsx
import React from "react";

import { ArrowUpAZ, ArrowDownAZ, ArrowDownUp } from "lucide-react";
import { useNavigate } from "react-router-dom";

export default function Tabla({
  informantes,
  onSort,
  sortField,
  sortOrder,
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
          <th onClick={() => onSort("nombre_completo_mentora")}>
            <div className="tablas__thContainer">
              <span>Nombre del contacto</span>
              {renderSortArrow("nombre_completo_mentora")}
            </div>
          </th>
          <th onClick={() => onSort("correo")}>
            <div className="tablas__thContainer">
              <span>Correo</span>
              {renderSortArrow("correo")}
            </div>
          </th>
          {/* <th>Ver detalles</th> */}
        </tr>
      </thead>

      <tbody>
        {informantes.map((informante) => (
          <tr key={informante.id_informante}>
            <td>{informante.nombre_completo}</td>
            <td>{informante.correo}</td>
            {/* <td>
              <button
                className="tabla__botonMorado"
                onClick={() =>
                  navigate(`/admin/mentoras/${mentora.id_mentora}`)
                }
              >
                Ver detalles
              </button>
            </td> */}
          </tr>
        ))}
      </tbody>
    </table>
  );
}
