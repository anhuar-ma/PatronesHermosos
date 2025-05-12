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
import AdminNavbar from "./components/AdminNavBar";
import AdminDashboard from "./pages/admin/adminHome";
import { useLocation } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext.jsx";
import ProtectedRoute from "./components/ProtectedRoute";

function App() {
  const location = useLocation();
  const isAdminRoute = location.pathname.startsWith("/admin");

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
        <Route
          path="/admin/inicio"
          element={
            <ProtectedRoute requiredRoles={[0, 1]}>
              <AdminDashboard />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/colaboradores"
          element={
            <ProtectedRoute requiredRoles={[0,1]}>
              <ListadoColaboradores />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/add-person"
          element={
            <ProtectedRoute requiredRoles={[0]}>
              <RegistroSedes />
            </ProtectedRoute>
          }
        />
      </Routes>
    </AuthProvider>
  );

}

export default App;
