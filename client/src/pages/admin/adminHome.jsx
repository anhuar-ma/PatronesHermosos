import React from "react";
import "../../styles/AdminDashboard.css";

import DistribucionPoblacion from "../../components/DistribucionPoblacion";

import KPICards from "../../components/KPICards";
import TablaComparativa from "../../components/TablaComparativa";
import TablaEstadoSedes from "../../components/TablaEstadosSedes.jsx";
import TablaCoodinadoraAsociada from "../../components/TablaCoordinadoraAsociada.jsx";
import useCurrentRol from "../../hooks/useCurrentRol";


const AdminDashboard = () => {
  const currentRol  = useCurrentRol();
  return (
    <div className="admin-dashboard-content">
      <h1 className="adminDashboard__tituloBienvenida">Bienvenida de nuevo, Rosa</h1>
      <p>Visión general del estado de las sedes, cursos y alumnas.</p>

      {currentRol === 1 && <TablaCoodinadoraAsociada />}

      <KPICards />

      <DistribucionPoblacion />


      {/* <div className="chart-section">
        <div className="chart-box">
          <h2>📈 Evolución de Alumnas</h2>
          <EvolucionAlumnasChart />
        </div>
      </div> */}
      <TablaComparativa />

      <div className="adminDashboard__chart-box">
        <h2>Inicio de Actividades por Sede</h2>
        <TablaEstadoSedes />
      </div>

      {/* <div className="">
      <MiGrafica />
      <MiPastelito />
    </div> */}
    </div>
  );
};

export default AdminDashboard;
