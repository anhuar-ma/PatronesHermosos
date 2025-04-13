import React from "react";
import "../../styles/AdminDashboard.css";
import InicioSedesChart from "../../components/TablaEstadosSedes.jsx";
import DistribucionPoblacion from "../../components/DistribucionPoblacion";

import MiGrafica from '../../components/MiGrafica.jsx';
import MiPastelito from '../../components/MiPastel.jsx';
import EvolucionAlumnasChart from "../../components/EvolucionAlumnasChart";
import KPICards from "../../components/KPICards";
import TablaComparativa from "../../components/TablaComparativa";
import TablaEstadoSedes from "../../components/TablaEstadosSedes.jsx";

const AdminDashboard = () => {
  return (
    <div className="admin-dashboard-content">
      <h1>📊 Dashboard Nacional</h1>
      <p>Visión general del estado de las sedes, cursos y alumnas.</p>

      <KPICards />

      <DistribucionPoblacion />


      {/* <div className="chart-section">
        <div className="chart-box">
          <h2>📈 Evolución de Alumnas</h2>
          <EvolucionAlumnasChart />
        </div>
      </div> */}
      <TablaComparativa />

      <div className="chart-box">
        <h2>📅 Inicio de Actividades por Sede</h2>
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
