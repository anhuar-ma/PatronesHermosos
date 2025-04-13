import { useState } from "react";
import { useLocation } from "react-router-dom";
import { Link } from "react-router-dom";
import { MapPinHouse, Settings, User, BookMarked, ChevronRight} from "lucide-react";
import "../styles/Sidebar.css"; // Asegúrate de importar los estilos

export default function AdminNavbar() {
  const [active, setActive] = useState("/");

  const navItems = [
    { name: "Sedes", icon: <MapPinHouse  size={20} />, path: "/" },
    { name: "Participantes", icon: <User size={20} />, path: "/perfil" },
    { name: "Colaboradores", icon: <Settings size={20} />, path: "/colaboradores" },
    { name: "Diplomas", icon: <BookMarked size={20} />, path: "/configuracion" },
  ];

  return (
    <aside className="sidebar">
      <div className="sidebar-title">
        <img src="./src/assets/logo_patrones.png" alt="hola" className="img-logo-nav"/><p>Patrones Hermosos</p></div>
      <nav className="sidebar-nav">
         <Link to="/admin/viewColaboradores" className='link'>Registro participantes</Link>
          <Link to="/colaborador" className='link'>Registro colaboradores</Link>
          <Link to="/sede" className='link'>Registro sedes</Link>
          <Link to="/sesion" className='link'>Iniciar Sesión</Link>
        {navItems.map((item) => (
          <Link
            key={item.path}
            onClick={() => setActive(item.path)}
            className={`sidebar-button ${active === item.path ? "active" : ""}`}
          >
            {item.icon}
            <span>{item.name}</span>
            <ChevronRight size={20} />
          </Link>
        ))}
      </nav>
    </aside>
  );
}
