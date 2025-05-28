import React, { useState, useEffect } from "react";
import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import useCurrentRol from "../hooks/useCurrentRol";
import axios from "axios";

// Colores para cada categoría
const COLORS = ["#4BB198 ", "#E75F50", "#F9D864", "#9E629A", "#AA00FF"];

const renderLabel = ({ percent }) =>
  `${(percent * 100).toFixed(0)}%`;

const DistribucionPoblacion = () => {
  const { rol } = useCurrentRol();
  const [dataAlumnas, setDataAlumnas] = useState([]);
  const [dataStaff, setDataStaff] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [dataFetched, setDataFetched] = useState(false);

  useEffect(() => {
    // Only fetch data if we have a valid role
    if (rol === null) {
      return; // Exit early, wait for role to be defined
    }

    const fetchStats = async () => {
      try {
        setLoading(true);
        const token = localStorage.getItem("token");
        const response = await axios.get("/api/estadisticas", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        const data = response.data.data[0];
        console.log("Data received:", data); // Debug log

        // Set data based on user role
        if (rol === 0) {
          // Admin (national data)
          setDataAlumnas([
            { sede: "Aceptadas", valor: parseInt(data.participantes_aceptadas_nacional || 0) },
            { sede: "Rechazadas", valor: parseInt(data.participantes_rechazadas_nacional || 0) },
            { sede: "Pendientes", valor: parseInt(data.participantes_pendientes_nacional || 0) },
          ]);

          setDataStaff([
            { sede: "Instructoras", valor: parseInt(data.instructoras_aceptadas_nacional || 0) },
            { sede: "Facilitadoras", valor: parseInt(data.facilitadoras_aceptadas_nacional || 0) },
            { sede: "Mentoras", valor: parseInt(data.mentoras_nacional || 0) },
            { sede: "Staff", valor: parseInt(data.staff_aceptados_nacional || 0) },
          ]);
        } else {
          // Sede coordinator (local data)
          setDataAlumnas([
            { sede: "Aceptadas", valor: parseInt(data.participantes_aceptadas || 0) },
            { sede: "Rechazadas", valor: parseInt(data.participantes_rechazadas || 0) },
            { sede: "Pendientes", valor: parseInt(data.participantes_pendientes || 0) },
          ]);

          setDataStaff([
            { sede: "Instructoras", valor: parseInt(data.instructoras_aceptadas || 0) },
            { sede: "Facilitadoras", valor: parseInt(data.facilitadoras_aceptadas || 0) },
            { sede: "Mentoras", valor: parseInt(data.mentoras || 0) },
            { sede: "Staff", valor: parseInt(data.staff_aceptados || 0) },
          ]);
        }

        setDataFetched(true);
        setLoading(false);
      } catch (err) {
        console.error("Error fetching statistics:", err);
        setError("Error al cargar los datos");
        setLoading(false);
      }
    };

    fetchStats();
  }, [rol]); // Only re-run when rol changes

  // Show loading while either the role is still loading or data is loading
  if (rol === null || loading) {
    return <div className="loading">Cargando gráficos...</div>;
  }
  
  if (error) return <div className="error">{error}</div>;

  // Only filter data after we've confirmed data has been fetched
  const filteredDataAlumnas = dataAlumnas.filter(item => item.valor > 0);
  const filteredDataStaff = dataStaff.filter(item => item.valor > 0);

  return (
    <div className="adminDashboard__chart-section">
      <div className="adminDashboard__chart-box">
        <h2>Distribución de Alumnas</h2>
        {!dataFetched ? (
          <div className="loading">Cargando datos...</div>
        ) : filteredDataAlumnas.length > 0 ? (
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={filteredDataAlumnas}
                dataKey="valor"
                nameKey="sede"
                outerRadius={100}
                label={renderLabel}
              >
                {filteredDataAlumnas.map((entry, index) => (
                  <Cell key={`cell-a-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip formatter={(value) => [`${value} alumnas`, null]} />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        ) : (
          <div className="no-data">No hay datos disponibles</div>
        )}
      </div>

      <div className="adminDashboard__chart-box">
        <h2>Distribución de Staff</h2>
        {!dataFetched ? (
          <div className="loading">Cargando datos...</div>
        ) : filteredDataStaff.length > 0 ? (
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={filteredDataStaff}
                dataKey="valor"
                nameKey="sede"
                outerRadius={100}
                label={renderLabel}
              >
                {filteredDataStaff.map((entry, index) => (
                  <Cell key={`cell-b-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip formatter={(value) => [`${value} personas`, null]} />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        ) : (
          <div className="no-data">No hay datos disponibles</div>
        )}
      </div>
    </div>
  );
};

export default DistribucionPoblacion;
