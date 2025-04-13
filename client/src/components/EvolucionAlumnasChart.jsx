import React from "react";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";

const data = [
  { mes: "Ene", alumnas: 800 },
  { mes: "Feb", alumnas: 950 },
  { mes: "Mar", alumnas: 1100 },
  { mes: "Abr", alumnas: 1250 },
];

const EvolucionAlumnasChart = () => {
  return (
    <ResponsiveContainer width="100%" height={300}>
      <LineChart data={data}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="mes" />
        <YAxis />
        <Tooltip />
        <Line type="monotone" dataKey="alumnas" stroke="#8884d8" strokeWidth={2} />
      </LineChart>
    </ResponsiveContainer>
  );
};

export default EvolucionAlumnasChart;
