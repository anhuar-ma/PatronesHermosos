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
  { sede: "Buenos Aires", valor: 350 },
  { sede: "Rosario", valor: 200 },
  { sede: "Mendoza", valor: 150 },
  { sede: "Córdoba", valor: 100 },
  { sede: "Salta", valor: 50 },
];

const dataStaff = [
  { sede: "Buenos Aires", valor: 25 },
  { sede: "Rosario", valor: 18 },
  { sede: "Mendoza", valor: 12 },
  { sede: "Córdoba", valor: 10 },
  { sede: "Salta", valor: 5 },
];

const renderLabel = ({ percent }) =>
  `${(percent * 100).toFixed(0)}%`;

const DistribucionPoblacion = () => {
  return (
    <div className="chart-section">
      <div className="chart-box">
        <h2>👩‍🎓 Distribución de Alumnas</h2>
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

      <div className="chart-box">
        <h2>👥 Distribución de Staff</h2>
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
