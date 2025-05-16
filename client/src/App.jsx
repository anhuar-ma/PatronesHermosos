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
import ListadoParticipantes from "./pages/admin/ViewParticipantes";
import ListadoSedes from "./pages/admin/ViewSedes.jsx";
import AdminNavbar from "./components/AdminNavBar";
import AdminDashboard from "./pages/admin/adminHome";
// import AdminSedeDashboard from "./pages/adminSede/adminHome";
import { jwtDecode } from "jwt-decode";
import { useLocation } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext.jsx";
import ProtectedRoute from "./components/ProtectedRoute";
import ProtectedRoutes from "./components/ProtectedRoutes";
import DetalleParticipante from "./pages/admin/DetallesParticipantes";
import DetalleColaborador from "./pages/admin/DetallesColaborador.jsx";
// impor/t AdminSedeDashboard from "./pages/adminSede/adminHome";

function App() {
  const location = useLocation();
  const isAdminRoute = location.pathname.startsWith("/admin");

  const token = localStorage.getItem("token");
  let currentRol = null;
  if (token) {
    try {
      const decoded = jwtDecode(token);
      currentRol = decoded.rol; // aquí tienes el rol
    } catch (err) {
      console.error("Error decodificando token:", err);
    }
  }

  console.log("Current Token");
  console.log(currentRol);

  return (
    <AuthProvider>
      {isAdminRoute ? <AdminNavbar /> : <Navbar />}
      <Routes>
        {/* Public routes */}
        <Route path="/" element={<Home />} />
        <Route path="/participante" element={<RegistroParticipantes />} />
        <Route path="/colaborador" element={<RegistroColaboradores />} />
        <Route path="/sede" element={<RegistroSedes />} />
        <Route path="/sesion" element={<IniciarSesion />} />

        {/* Protected admin routes */}

        <Route element={<ProtectedRoutes requiredRoles={[0, 1]} />}>
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
            path="/admin/colaboradores/:id"
            element={<DetalleColaborador />}
          />

        </Route>
      </Routes>
    </AuthProvider>
  );
}

export default App;
