// MiGrafica.jsx
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from 'recharts';

const data = [
  { mes: 'Enero', visitas: 400 },
  { mes: 'Febrero', visitas: 300 },
  { mes: 'Marzo', visitas: 500 },
  { mes: 'Abril', visitas: 200 },
];

export default function MiGrafica() {
  return (
    <LineChart
      width={600}
      height={300}
      data={data}
      margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
    >
      <CartesianGrid strokeDasharray="3 3" />
      <XAxis dataKey="mes" />
      <YAxis />
      <Tooltip />
      <Legend />
      <Line type="monotone" dataKey="visitas" stroke="#8884d8" />
    </LineChart>
  );
}
