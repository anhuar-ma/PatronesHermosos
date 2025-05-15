
import "./styles/App.css";
import Navbar from "./components/Navbar";
import useCurrentRol from "./hooks/useCurrentRol";
import { Route, Routes } from "react-router-dom";
import RegistroParticipantes from "./pages/RegistroParticipantes";
import RegistroColaboradores from "./pages/RegistroColaboradores";
import RegistroSedes from "./pages/RegistroSedes";
import IniciarSesion from "./pages/IniciarSesion";
import Home from "./pages/Home";
import ListadoColaboradores from "./pages/admin/ViewColaboradores";
import ListadoParticipantes from "./pages/admin/ViewParticipantes";
import ListadoSedes from "./pages/admin/ViewSedes.jsx"
import AdminNavbar from "./components/AdminNavBar";
import AdminNavbarSede from "./components/AdminNavBarSede";
import AdminDashboard from "./pages/admin/adminHome";
import ListadoGrupos from "./pages/admin/ViewGrupos";
import RegistroMentora from "./pages/admin/RegistroMentora";
import RegistroCoordinadora from "./pages/admin/RegistroCoordinadoraAsociada";

// import AdminSedeDashboard from "./pages/adminSede/adminHome";

import { useLocation } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext.jsx";
import ProtectedRoute from "./components/ProtectedRoute";
import DetalleParticipante from "./pages/admin/DetallesParticipantes";




// import AdminSedeDashboard from "./pages/adminSede/adminHome";

function App() {
  const location = useLocation();
  const isAdminRoute = location.pathname.startsWith("/admin");

  // const token = localStorage.getItem("token");
  const currentRol    = useCurrentRol(); 

  return (
    <AuthProvider>
      {
        isAdminRoute
          ? (currentRol === 0
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

        {/* Protected admin routes */}
        <Route
          path="/admin/inicio"
          element={
            <ProtectedRoute requiredRoles={[0, 1]}>
              <AdminDashboard></AdminDashboard>
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/colaboradores"
          element={
            <ProtectedRoute requiredRoles={[0, 1]}>
              <ListadoColaboradores />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/agregarMentora"
          element={
            <ProtectedRoute requiredRoles={[1]}>
              <RegistroMentora />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/agregarCoordinadora"
          element={
            <ProtectedRoute requiredRoles={[1]}>
              <RegistroCoordinadora />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/mentoras"
          element={
            <ProtectedRoute requiredRoles={[1]}>
              <ListadoColaboradores />
            </ProtectedRoute>
          }
        />

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
          path="/admin/grupos"
          element={<ListadoGrupos></ListadoGrupos>}
        ></Route>

        <Route
          path="/admin/participantes/:id"
          element={<DetalleParticipante />}
        />
      </Routes>
    </AuthProvider>
  );
}

export default App;

