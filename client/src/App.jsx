import { useState } from "react";
import "./styles/App.css";
import Navbar from "./components/Navbar";
import { Route, Routes } from "react-router-dom";
import RegistroParticipantes from "./pages/RegistroParticipantes";
import RegistroColaboradores from "./pages/RegistroColaboradores";
import RegistroSedes from "./pages/RegistroSedes";
import IniciarSesion from "./pages/IniciarSesion";
import Home from "./pages/Home";
import ListadoColaboradores from "./pages/admin/ViewColaboradores";
import ListadoParticipantes from "./pages/admin/ViewParticipantes"
import AdminNavbar from "./components/AdminNavBar";
import AdminDashboard from "./pages/admin/adminHome";
import DetalleParticipante from "./pages/admin/DetallesParticipantes";
// import AdminSedeDashboard from "./pages/adminSede/adminHome";

import { useLocation } from "react-router-dom";

function App() {
  const location = useLocation();
  const isAdminRoute = location.pathname.startsWith("/admin");
  return (
    <>
      {isAdminRoute ? <AdminNavbar /> : <Navbar />}
      <Routes>
        <Route path="/" element={<Home></Home>}>
          {" "}
        </Route>
        <Route
          path="/participante"
          element={<RegistroParticipantes></RegistroParticipantes>}
        >
          {" "}
        </Route>
        <Route
          path="/colaborador"
          element={<RegistroColaboradores></RegistroColaboradores>}
        >
          {" "}
        </Route>
        <Route path="/sede" element={<RegistroSedes></RegistroSedes>}></Route>
        <Route path="/sesion" element={<IniciarSesion></IniciarSesion>}></Route>

        {/* Admin routes */}
        <Route
          path="/admin/inicio"
          element={<AdminDashboard></AdminDashboard>}
        />
        <Route
          path="/admin/colaboradores"
          element={<ListadoColaboradores></ListadoColaboradores>}
        ></Route>

        <Route
          path="/admin/participantes"
          element={<ListadoParticipantes></ListadoParticipantes>}
        ></Route>
        <Route
          path="/adminSede/inicio"
          element={<AdminDashboard></AdminDashboard>}
        ></Route>

        <Route
          path="/admin/add-person"
          element={<RegistroSedes></RegistroSedes>}
        />

        <Route path="/admin/participantes/:id" element={<DetalleParticipante />} />
      </Routes>

      
    </>
  );
}

export default App;
