import React from "react";
import "../../styles/AdminDashboard.css";

import MiGrafica from '../../components/MiGrafica.jsx';
import MiPastelito from '../../components/MiPastel.jsx';


const AdminDashboard = () => {
  return (
    <div className="admin-dashboard-content">
      <h1>Dashboard de Admin</h1>
      <p>¡Bienvenido! Elegí una opción del menú para comenzar.</p>

      <div className="">
      <MiGrafica />
      <MiPastelito />
    </div>
    </div>
  );
};

export default AdminDashboard;
