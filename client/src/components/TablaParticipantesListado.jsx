// src/components/TablaParticipantesListado.jsx
import React from "react";
import useCurrentRol from "../hooks/useCurrentRol";
import { ArrowUpAZ, ArrowDownAZ, ArrowDownUp } from "lucide-react";
import { useNavigate } from "react-router-dom";

export default function Tabla({
  participantes,
  onSort,
  sortField,
  sortOrder,
  statusOptions = [],
  onStatusChange,
}) {
  const navigate = useNavigate();
  const {rol} = useCurrentRol();

  const formatPhoneNumber = (phone) => {
  if (!phone) return "Sin número"; // Manejo de números vacíos
  const cleaned = phone.replace(/\D/g, ""); // Elimina caracteres no numéricos

  // Divide el número en partes: lada, resto del número
   const match = cleaned.match(/^(\d{1,3})(\d{3})(\d{3})(\d{4})$/);
  return match ? `+${match[1]} ${match[2]} ${match[3]} ${match[4]}` : phone;
};

  const renderSortArrow = (field) => {
    if (sortField !== field) return <ArrowDownUp size={14} />;
    return sortOrder === "asc" ? (
      <ArrowDownAZ size={14} />
    ) : (
      <ArrowUpAZ size={14} />
    );
  };

  // const token = localStorage.getItem("token");

  return (
    <table className="colaboradores-table">
      <thead>
        <tr>
          <th onClick={() => onSort("nombre")}>
            <div className="tablas__thContainer">
              <span>Nombre de la participante</span>
              {renderSortArrow("nombre")}
            </div>
          </th>
          <th onClick={() => onSort("nombre_completo_tutor")}>
            <div className="tablas__thContainer">
              <span>Nombre del tutor</span>
              {renderSortArrow("nombre_completo_tutor")}
            </div>
          </th>
          <th>Teléfono de contacto</th>
          {rol === 0 ? <th>Sede</th> : <th>Grupo</th>}

          <th>Más Información</th>
          <th>Estado</th>
        </tr>
      </thead>

      <tbody>
        {participantes.map((participante) => (
          <tr key={participante.id_participante}>
            <td>{participante.nombre_completo_participante}</td>
            <td>{participante.nombre_completo_tutor}</td>
            <td>{formatPhoneNumber(participante.telefono_tutor)}</td>
            {rol === 0 ? (
              <td>{participante.nombre_sede || "Sin asignar" }</td>
            ) : (
              <td>{participante.id_grupo || "Sin asignar"}</td>
            )}

            <td>
              <button
                className="tabla__botonMorado"
                onClick={() =>
                  navigate(
                    `/admin/participantes/${participante.id_participante}`
                  )
                }
              >
                Ver detalles
              </button>
            </td>
            <td>
              <select
                className={`select-estado select-estado--${participante.estado.toLowerCase()}`}
                value={participante.estado}
                onChange={(e) =>
                  onStatusChange(participante.id_participante, e.target.value)
                }
              >
                {statusOptions.map((status) => (
                  <option
                    key={status}
                    value={status}
                    disabled={
                      (participante.estado === "Aceptado" ||
                        participante.estado === "Rechazado") &&
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
