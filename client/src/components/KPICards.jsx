import React from "react";
import useCurrentRol from "../hooks/useCurrentRol";

const KPICards = () => {
  const currentRol = useCurrentRol();

  // Cambia el título según el rol
  if (currentRol === 0) {
    document.title = "Dashboard Admin";
  } else {
    document.title = "Dashboard Sede";
  }

  const kpis = [
    { label: "Alumnas registradas", value: "1,250" },
    { label: "Mentoras registradas", value: "1,250" },
    { label: "Staff registrado", value: "1,250" },
    { label: "Instructoras registradas", value: "1,250" },
    { label: "Grupos en inglés", value: "1,250" },
    { label: "Grupos en español", value: "1,250" },
  ];
  const kpisNacional = [
    { label: "Sedes aceptadas", value: "1,250" },
    { label: "Sedes pendientes", value: "1,250" },
    { label: "Alumnas pendientes a nivel nacional", value: "1,250" },
    { label: "Alumnas registradas a nivel nacional", value: "1,250" },
    { label: "Mentoras registradas a nivel nacional", value: "1,250" },
    { label: "Staff registrado a nivel nacional", value: "1,250" },
    { label: "Instructoras registradas a nivel nacional", value: "1,250" },
    { label: "Grupos en inglés a nivel nacional", value: "1,250" },
    { label: "Grupos en español a nivel nacional", value: "1,250" },
  ];

  // Selecciona el array de KPIs según el rol
  const kpisToShow = currentRol === 0 ? kpisNacional : kpis;

  return (
    <div className="adminDashboard__cards">
      {kpisToShow.map((kpi, index) => (
        <div key={index} className="adminDashboard__card">
          <h3>{kpi.label}</h3>
          <p>{kpi.value}</p>
        </div>
      ))}
    </div>
  );
};

export default KPICards;
