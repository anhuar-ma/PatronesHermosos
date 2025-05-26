import React from "react";
import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";

// Colores para cada sede
const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042", "#AA00FF"];

const dataAlumnas = [
  { sede: "Aceptadas", valor: 350 },
  { sede: "Rechazadas", valor: 200 },
  { sede: "Pendientes", valor: 150 },
];

const dataStaff = [
  { sede: "Instructoras", valor: 25 },
  { sede: "Mentoras", valor: 18 },
  { sede: "Colaboradoras", valor: 12 },
  { sede: "Staff", valor: 10 },
];

const renderLabel = ({ percent }) =>
  `${(percent * 100).toFixed(0)}%`;

const DistribucionPoblacion = () => {
  return (
    <div className="adminDashboard__chart-section">
      <div className="adminDashboard__chart-box">
        <h2>Distribución de Alumnas</h2>
        <ResponsiveContainer width="100%" height={300}>
          <PieChart>
            <Pie
              data={dataAlumnas}
              dataKey="valor"
              nameKey="sede"
              outerRadius={100}
              label={renderLabel}
            >
              {dataAlumnas.map((entry, index) => (
                <Cell key={`cell-a-${index}`} fill={COLORS[index % COLORS.length]} />
              ))}
            </Pie>
            <Tooltip />
            <Legend />
          </PieChart>
        </ResponsiveContainer>
      </div>

      <div className="adminDashboard__chart-box">
        <h2>Distribución de Staff</h2>
        <ResponsiveContainer width="100%" height={300}>
          <PieChart>
            <Pie
              data={dataStaff}
              dataKey="valor"
              nameKey="sede"
              outerRadius={100}
              label={renderLabel}
            >
              {dataStaff.map((entry, index) => (
                <Cell key={`cell-b-${index}`} fill={COLORS[index % COLORS.length]} />
              ))}
            </Pie>
            <Tooltip />
            <Legend />
          </PieChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default DistribucionPoblacion;
