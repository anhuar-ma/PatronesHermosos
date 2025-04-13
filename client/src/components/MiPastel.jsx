import { PieChart, Pie, Cell, Tooltip, Legend } from 'recharts';

const data = [
  { name: 'Mentoras', value: 10 },
  { name: 'Participantes', value: 60 },
  { name: 'Coordinadoras', value: 5 },
];

// Puedes usar colores personalizados
const COLORS = ['#8884d8', '#82ca9d', '#ffc658'];

export default function MiPastel() {
  return (
    <div className="flex justify-center items-center">
      <PieChart width={400} height={400}>
        <Pie
          data={data}
          cx="50%"
          cy="50%"
          outerRadius={130}
          label
          dataKey="value"
        >
          {data.map((entry, index) => (
            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
          ))}
        </Pie>
        <Tooltip />
        <Legend />
      </PieChart>
    </div>
  );
}
