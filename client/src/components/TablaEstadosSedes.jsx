import React from "react";

// Simulación de datos
const sedes = [
  { sede: "Buenos Aires", inicio: "2025-03-10" },
  { sede: "Rosario", inicio: "2025-04-01" },
  { sede: "Mendoza", inicio: "2025-04-20" },
  { sede: "Córdoba", inicio: "2025-05-05" },
  { sede: "Salta", inicio: "2025-06-01" },
];

const hoy = new Date();

const TablaEstadoSedes = () => {
  const sedesConEstado = sedes.map((sede) => {
    const fechaInicio = new Date(sede.inicio);
    const activa = fechaInicio <= hoy;
    return {
      ...sede,
      estado: activa ? "Activa" : "Por iniciar",
    };
  });

  return (
    <div className="table-section">
      <h2>📌 Estado de Sedes</h2>
      <table className="comparison-table">
        <thead>
          <tr>
            <th>Sede</th>
            <th>Estado</th>
            <th>Fecha de Inicio</th>
          </tr>
        </thead>
        <tbody>
          {sedesConEstado.map((sede, idx) => (
            <tr key={idx}>
              <td>{sede.sede}</td>
              <td>
                <span
                  className={`estado-tag ${
                    sede.estado === "Activa" ? "activa" : "pendiente"
                  }`}
                >
                  {sede.estado}
                </span>
              </td>
              <td>
                {new Date(sede.inicio).toLocaleDateString("es-AR", {
                  day: "2-digit",
                  month: "short",
                  year: "numeric",
                })}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default TablaEstadoSedes;
