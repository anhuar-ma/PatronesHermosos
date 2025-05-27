import React from "react";
import "../../styles/AdminDashboard.css";

import DistribucionPoblacion from "../../components/DistribucionPoblacion";

import KPICards from "../../components/KPICards";
import TablaComparativa from "../../components/TablaComparativa";
import TablaEstadoSedes from "../../components/TablaEstadosSedes.jsx";
import TablaCoodinadoraAsociada from "../../components/TablaCoordinadoraAsociada.jsx";
import useCurrentRol from "../../hooks/useCurrentRol";
import axios from "axios";

const AdminDashboard = () => {
  const currentRol = useCurrentRol();
  const downloadStatistics = async () => {
    try {
      // Make a request to get the Excel file

      const response = await axios.get(
        "/api/estadisticas/estadisticas?format=excel",
        {
          responseType: "blob", // Important for handling binary data
        },
      );

      // Create a blob and download link
      const blob = new Blob([response.data], {
        type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
      });
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", "estadisticas.xlsx");
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);

      alert("Estadísticas descargadas con éxito");
    } catch (error) {
      console.error("Error downloading statistics:", error);
      alert.error("Error al descargar estadísticas");
    }
  };

  return (
    <div className="admin-dashboard-content">
      <h1 className="adminDashboard__tituloBienvenida">
        Bienvenida de nuevo, Rosa
      </h1>
      <p>Visión general del estado de las sedes, cursos y alumnas.</p>

      {currentRol === 1 && 
      <div className="adminDashboard__chart-box">
        <TablaCoodinadoraAsociada />
      </div>}

      <KPICards />

      <DistribucionPoblacion />

      {/* <div className="chart-section">
        <div className="chart-box">
          <h2>📈 Evolución de Alumnas</h2>
          <EvolucionAlumnasChart />
        </div>
      </div> */}

       {currentRol === 0 &&  <div className="adminDashboard__chart-box">
      <TablaComparativa />
        </div>}
      
      {/* <div className="adminDashboard__chart-box">
        <h2>Inicio de Actividades por Sede</h2>
        <TablaEstadoSedes />
      </div> */}

      <div
        className="download-statistics-container"
        style={{ marginBottom: "20px", textAlign: "right" }}
      >
        <button
          onClick={downloadStatistics}
          style={{
            padding: "10px 15px",
            backgroundColor: "#4CAF50",
            color: "white",
            border: "none",
            borderRadius: "4px",
            cursor: "pointer",
            display: "inline-flex",
            alignItems: "center",
            gap: "8px",
          }}
        >
          <i className="fas fa-download"></i> Descargar Estadísticas en Excel
        </button>
      </div>

      {/* <div className="">
      <MiGrafica />
      <MiPastelito />
    </div> */}
    </div>
  );
};

export default AdminDashboard;
