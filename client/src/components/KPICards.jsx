import React, { useState, useEffect } from "react";
import useCurrentRol from "../hooks/useCurrentRol";
import axios from "axios";

const KPICards = () => {
  const { rol } = useCurrentRol(); // Destructure to get the rol property
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Set page title based on role
  useEffect(() => {
    if (rol === 0) {
      document.title = "Dashboard Admin";
    } else {
      document.title = "Dashboard Sede";
    }
  }, [rol]);

  // Fetch statistics from API
  useEffect(() => {
    const fetchStats = async () => {
      try {
        setLoading(true);
        const token = localStorage.getItem("token");
        const response = await axios.get("/api/estadisticas", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setStats(response.data.data[0]);
        setLoading(false);
      } catch (err) {
        console.error("Error fetching statistics:", err);
        setError("Error al cargar las estadísticas");
        setLoading(false);
      }
    };

    fetchStats();
  }, []);

  if (loading) return <div className="loading">Cargando estadísticas...</div>;
  if (error) return <div className="error">{error}</div>;
  if (!stats) return <div className="no-data">No hay datos disponibles</div>;

  console.log("Current Rol", rol);

  // Define KPIs based on role and map to API response
  const getKPIs = () => {
    if (rol === 0) {
      // Admin view - national statistics
      return [
        {
          label: "Alumnas aceptadas a nivel nacional",
          value: stats.participantes_aceptadas_nacional || 0,
        },
        { label: "Mentoras a nivel nacional", value: stats.mentoras_nacional || 0 },
             { label: "Sedes aceptadas", value: stats.sedes_aceptadas || 0 },
        // { label: "Sedes activas", value: stats.sedes_activas || 0 }, 
        {
          label: "Colaboradores aceptados a nivel nacional",
          value: stats.colaboradores_aceptados_nacional || 0,
        },
        { label: "Texto intermedio", value: "Distribución de colaboradores" }, // Texto intermedio

        {
          label: "Staff aceptado a nivel nacional",
          value: stats.staff_aceptados_nacional || 0,
        },
        {
          label: "Instructoras aceptadas a nivel nacional",
          value: stats.instructoras_aceptadas_nacional || 0,
        },
        {
          label: "Facilitadoras aceptadas a nivel nacional",
          value: stats.facilitadoras_aceptadas_nacional || 0,
        },
       
   
      ];
    } else if (rol === 1) {
      // Sede view - local statistics
      return [
        { label: "Alumnas aceptadas", value: stats.participantes_aceptadas || 0 },
        { label: "Mentoras", value: stats.mentoras || 0 },
        { label: "Colaboradores aceptados", value: stats.colaboradores_aceptados || 0 },
        { label: "Texto intermedio", value: "Distribución de colaboradores" }, // Texto intermedio
        { label: "Staff aceptado", value: stats.staff_aceptados || 0 },
        { label: "Instructoras aceptadas", value: stats.instructoras_aceptadas || 0 },
        { label: "Facilitadoras aceptadas", value: stats.facilitadoras_aceptadas || 0 },

      ];
    } else {
      // Default case when role is null or unknown
      return [
        { label: "No hay datos disponibles", value: "Sin acceso" },
      ];
    }
  };

  return (
    <div className="adminDashboard__cards">
      {getKPIs().map((kpi, index) => (
        kpi.label === "Texto intermedio" ? (
          <div key={index} className="intermediate-text">
            <p>{kpi.value}</p>
          </div>
        ) : (
          <div 
            key={index} 
            className="adminDashboard__card" 
            id={kpi.label === "Colaboradores aceptados" ? "colaboradores-aceptados" : undefined}
          >
            <h3>{kpi.label}</h3>
            <p>{kpi.value}</p>
          </div>
        )
      ))}
    </div>
  );
};

export default KPICards;
