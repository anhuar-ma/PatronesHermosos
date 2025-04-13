import React from "react";

const TablaComparativa = () => {
  const sedes = [
    {
      sede: "Buenos Aires",
      aceptadas: 120,
      rechazadas: 30,
      pendientes: 15,
      staff: 10,
    },
    {
      sede: "Rosario",
      aceptadas: 90,
      rechazadas: 25,
      pendientes: 20,
      staff: 6,
    },
    {
      sede: "Mendoza",
      aceptadas: 80,
      rechazadas: 10,
      pendientes: 10,
      staff: 5,
    },
    // Podés agregar más sedes acá
  ];

  return (
    <div className="table-section">
      <h2>Información de sedes aceptadas</h2>
      <table className="comparison-table">
        <thead>
          <tr>
            <th>Sede</th>
            <th>✅ Aceptadas</th>
            <th>❌ Rechazadas</th>
            <th>⏳ Pendientes</th>
            <th>👥 Staff</th>
          </tr>
        </thead>
        <tbody>
          {sedes.map((sede, idx) => (
            <tr key={idx}>
              <td>{sede.sede}</td>
              <td>{sede.aceptadas}</td>
              <td>{sede.rechazadas}</td>
              <td>{sede.pendientes}</td>
              <td>{sede.staff}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default TablaComparativa;
