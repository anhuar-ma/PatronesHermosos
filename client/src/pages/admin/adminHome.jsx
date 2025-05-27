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
  const { rol } = useCurrentRol();
  // console.log("CURRENT ROL", currentRol);
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

  // Add this new function for database deletion
  const handleDeleteDatabase = async () => {
    // Confirm deletion with a warning message
    const confirmed = window.confirm(
      "¡ADVERTENCIA! Esta acción eliminará TODOS los datos de la base de datos y no se puede deshacer. ¿Estás seguro que deseas continuar?"
    );
    
    if (!confirmed) return;
    
    try {
      const response = await axios.delete("/api/deleteDB");
      
      if (response.data.success) {
        alert("Base de datos vaciada exitosamente");
        // Optional: reload the page to refresh any statistics
        window.location.reload();
      } else {
        alert(`Error: ${response.data.message}`);
      }
    } catch (error) {
      console.error("Error al eliminar la base de datos:", error);
      alert(`Error al eliminar la base de datos: ${error.response?.data?.message || error.message}`);
    }
  };

  return (
    <div className="admin-dashboard-content">
      <h1 className="adminDashboard__tituloBienvenida">
        Bienvenida de nuevo, Rosa
      </h1>
      <p>Visión general del estado de las sedes, cursos y alumnas.</p>

      {rol === 1 &&
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

      {rol === 0 && <div className="adminDashboard__chart-box">
        <TablaComparativa />
      </div>}

      {/* <div className="adminDashboard__chart-box">
        <h2>Inicio de Actividades por Sede</h2>
        <TablaEstadoSedes />
      </div> */}

      <div
        className="download-statistics-container"
        style={{ marginBottom: "20px", textAlign: "right", display: "flex", justifyContent: "flex-end", gap: "10px" }}
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

        {/* Add the new delete database button - only visible to admin (rol === 0) */}
        {rol === 0 && (
          <button
            onClick={handleDeleteDatabase}
            style={{
              padding: "10px 15px",
              backgroundColor: "#D32F2F", // Red color for warning
              color: "white",
              border: "none",
              borderRadius: "4px",
              cursor: "pointer",
              display: "inline-flex",
              alignItems: "center",
              gap: "8px",
            }}
          >
            <i className="fas fa-trash-alt"></i> Eliminar Base de Datos
          </button>
        )}
      </div>

      {/* <div className="">
      <MiGrafica />
      <MiPastelito />
    </div> */}
    </div>
  );
};

export default AdminDashboard;
