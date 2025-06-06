import React from "react";
import useAxiosFetch from "../hooks/useAxiosFetch";

const TablaComparativa = () => {
  const { data, loading, error } = useAxiosFetch("/api/estadisticas/sedes");

  // Si la respuesta tiene success, se asume que data.data contiene la información deseada
  const sedes = data && data.success ? data.data : [];

  return (
    <div className="adminDashboard__tableSection">
      <h2>Información de sedes aceptadas</h2>
      {loading ? (
        <p>Cargando...</p>
      ) : error ? (
        <p>{error}</p>
      ) : (
        <table className="adminDashboard__comparisonTable">
          <thead>
            <tr>
              <th>Sede</th>
              <th>Alumnas aceptadas</th>
              <th>Alumnas rechazadas</th>
              <th>Alumnas pendientes</th>
              <th>Colaboradores aceptados</th>
            </tr>
          </thead>
          <tbody>
            {sedes.map((sede, idx) => (
              <tr key={idx}>
                <td className="nombre_sede">{sede.nombre_sede}</td>
                <td>{sede.alumnas_aceptadas}</td>
                <td>{sede.alumnas_rechazadas}</td>
                <td>{sede.alumnas_pendientes}</td>
                <td>{sede.colaboradores_aceptados}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default TablaComparativa;