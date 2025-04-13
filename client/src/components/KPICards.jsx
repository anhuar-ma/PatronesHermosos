import React from "react";

const KPICards = () => {
  const kpis = [
    { label: "👩‍🎓 Alumnas aceptadas a nivel nacional", value: "1,250" },
    { label: "🏢 Sedes aceptadas", value: "8" },
    { label: "Sedes pendientes de aprobar", value: "2" },
    { label: "👩‍🏫 Staff", value: "50" },
    { label: "Sedes activas", value: "6" },
    { label: "Sedes pendientes por iniciar actividades", value: "4" },
  ];

  return (
    <div className="kpi-cards">
      {kpis.map((kpi, index) => (
        <div key={index} className="kpi-card">
          <h3>{kpi.label}</h3>
          <p>{kpi.value}</p>
        </div>
      ))}
    </div>
  );
};

export default KPICards;
