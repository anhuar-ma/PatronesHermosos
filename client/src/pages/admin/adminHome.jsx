import React from "react";
import "../../styles/AdminDashboard.css";
import DistribucionPoblacion from "../../components/DistribucionPoblacion";
import KPICards from "../../components/KPICards";
import TablaComparativa from "../../components/TablaComparativa";
import TablaCoodinadoraAsociada from "../../components/TablaCoordinadoraAsociada.jsx";
import useCurrentRol from "../../hooks/useCurrentRol";
import axios from "axios";

const AdminDashboard = () => {
  const { rol } = useCurrentRol();
  // console.log("CURRENT ROL", currentRol);
  const downloadStatistics = async () => {
    try {
      const response = await axios.get(
        "/api/estadisticas/estadisticas?format=excel",
        {
          responseType: "blob",
        }
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

  const downloadPermisosYConvocatorias = async () => {
    try {
      const response = await axios.get(
        "/api/estadisticas/permisos",
        {
          responseType: "blob",
        }
      );

      // Create a blob with the correct MIME type for ZIP files
      const blob = new Blob([response.data], {
        type: "application/zip", // Changed from Excel to ZIP MIME type
      });

      const url = window.URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", "permisos_y_convocatorias.zip"); // Correct file extension
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);

      alert("Permisos y convocatorias descargados con éxito");
    } catch (error) {
      console.error("Error downloading permisos:", error);
      alert("Error al descargar permisos y convocatorias");
    }
  };

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
      alert(
        `Error al eliminar la base de datos: ${error.response?.data?.message || error.message
        }`
      );
    }
  };

  return (
    <div className="admin-dashboard-content">
      <h1 className="adminDashboard__tituloBienvenida">Bienvenida de nuevo</h1>
      <h2>Resumen de Actividades</h2>

      {rol === 1 && (
        <div className="adminDashboard__chart-tabla-box">
          <TablaCoodinadoraAsociada />
        </div>
      )}

      <KPICards />

      <DistribucionPoblacion />

      {rol === 0 && (
        <div className="adminDashboard__chart-box">
          <TablaComparativa />
        </div>
      )}

      <div className="adminDashboard__actions">
        <button onClick={downloadStatistics} className="adminDashboard__actions__buttonDownload">
          Descargar Estadísticas en Excel
        </button>

        {rol === 0 && (
          <button onClick={downloadPermisosYConvocatorias} className="adminDashboard__actions__buttonDownloadDocs">
            Descargar convocatorias y permisos
          </button>
        )}

        {rol === 0 && (
          <button onClick={handleDeleteDatabase} className="adminDashboard__actions__buttonDelete">
            Eliminar Base de Datos
          </button>
        )}


      </div>
    </div>
  );
};

export default AdminDashboard;
