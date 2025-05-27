import { useState } from "react";
import "./styles/App.css";
import useCurrentRol from "./hooks/useCurrentRol";
import Navbar from "./components/Navbar";
import { Route, Routes } from "react-router-dom";
import RegistroParticipantes from "./pages/RegistroParticipantes";
import RegistroColaboradores from "./pages/RegistroColaboradores";
import RegistroSedes from "./pages/RegistroSedes";
import IniciarSesion from "./pages/IniciarSesion";
import Home from "./pages/Home";
import ListadoColaboradores from "./pages/admin/ViewColaboradores";
import ListadoParticipantes from "./pages/admin/ViewParticipantes";
import ListadoSedes from "./pages/admin/ViewSedes.jsx";
import ListadoGrupos from "./pages/admin/ViewGrupos.jsx";
import ListadoMentoras from "./pages/admin/ViewMentoras.jsx";
import AdminNavbar from "./components/AdminNavBar";
import AdminNavbarSede from "./components/AdminNavBarSede";
import RegistroMentoras from "./pages/admin/RegistroMentora.jsx";
import RegistroCoordinadoraAsociada from "./pages/admin/RegistroCoordinadoraAsociada.jsx";
import RegistroGrupos from "./pages/admin/RegistroGrupo";
import DetallesGrupo from "./pages/admin/DetallesGrupo";
import EnvioExitoso from "./pages/EnvioExitoso.jsx";

import AdminDashboard from "./pages/admin/adminHome";
// import AdminSedeDashboard from "./pages/adminSede/adminHome";
import { jwtDecode } from "jwt-decode";
import { useLocation } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext.jsx";
import ProtectedRoute from "./components/ProtectedRoute";
import ProtectedRoutes from "./components/ProtectedRoutes";
import DetalleParticipante from "./pages/admin/DetallesParticipantes";
import GenerateDiplomas from "./pages/admin/GenerateDiplomas.jsx";
import DetalleColaborador from "./pages/admin/DetallesColaborador.jsx";
import DetalleSede from "./pages/admin/DetallesSedes.jsx";
import DetalleMentora from "./pages/admin/DetallesMentora.jsx";
// impor/t AdminSedeDashboard from "./pages/adminSede/adminHome";

function App() {
  const location = useLocation();
  const isAdminRoute = location.pathname.startsWith("/admin");

  // const token = localStorage.getItem("token");
  const { rol } = useCurrentRol();

  return (
    <AuthProvider>
      {
        isAdminRoute
          ? (rol === 0
            ? <AdminNavbar />
            : <AdminNavbarSede />)
          : <Navbar />
      }
      <Routes>
        {/* Public routes */}
        <Route path="/" element={<Home />} />
        <Route path="/participante" element={<RegistroParticipantes />} />
        <Route path="/colaborador" element={<RegistroColaboradores />} />
        <Route path="/sede" element={<RegistroSedes />} />
        <Route path="/sesion" element={<IniciarSesion />} />
        <Route path="/envioExitoso" element={<EnvioExitoso />} />

        {/* Protected admin routes */}

        <Route element={<ProtectedRoutes requiredRoles={[0, 1]} />}>
          <Route
            path="/admin/"
          />
          <Route
            path="/admin/inicio"
            element={<AdminDashboard></AdminDashboard>}
          />
          <Route
            path="/admin/colaboradores"
            element={<ListadoColaboradores />}
          />
          <Route path="/admin/add-person" element={<RegistroSedes />} />
          <Route
            path="/admin/participantes"
            element={<ListadoParticipantes></ListadoParticipantes>}
          ></Route>

          <Route
            path="/admin/sedes"
            element={<ListadoSedes></ListadoSedes>}
          ></Route>

          <Route
            path="/adminSede/inicio"
            element={<AdminDashboard></AdminDashboard>}
          ></Route>

          <Route
            path="/admin/participantes/:id"
            element={<DetalleParticipante />}
          />

          <Route
            path="/admin/diplomas"
            element={<GenerateDiplomas />}
          />

          <Route
            path="/admin/colaboradores/:id"
            element={<DetalleColaborador />}
          />

          <Route
            path="/admin/sedes/:id"
            element={<DetalleSede />}
          />

          <Route
            path="/admin/mentoras/:id"
            element={<DetalleMentora />}
          />

          <Route
            path="/admin/mentoras"
            element={<ListadoMentoras />}
          />
          <Route
            path="/admin/registro-mentoras"
            element={<RegistroMentoras />}
          />
          <Route
            path="/admin/registro-grupos"
            element={<RegistroGrupos />}
          />
          <Route
            path="/admin/registro-coordinadora-asociada"
            element={<RegistroCoordinadoraAsociada />}
          />

          <Route
            path="/admin/grupos"
            element={<ListadoGrupos />}
          />
          <Route
            path="/admin/grupos/:id/listado"
            element={<DetallesGrupo />}
          />

        </Route>
      </Routes>
    </AuthProvider>
  );
}

export default App;
