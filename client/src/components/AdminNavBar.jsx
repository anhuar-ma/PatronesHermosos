import { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import { Link } from "react-router-dom";
import BurguerButton from './BurguerButton'; // Asegúrate de importar el mismo
import {House, MapPinHouse, Settings, User, BookMarked, ChevronRight,Contact, LogOut} from "lucide-react";
import "../styles/Sidebar.css"; // Asegúrate de importar los estilos

export default function AdminNavbar() {
  const [active, setActive] = useState("/");
  const [menuOpen, setMenuOpen] = useState(false);
  const location = useLocation();

  useEffect(() => {
    setMenuOpen(false); // Cierra menú al navegar
  }, [location.pathname]);

  const navItems = [
    { name: "Inicio", icon: <House size={20} className="icon"/>, path: "/admin/inicio" },
    { name: "Sedes", icon: <MapPinHouse  size={20} className="icon"/>, path: "/admin/sedes" },
    { name: "Participantes", icon: <User size={20} className="icon"/>, path: "/admin/participantes" },
    { name: "Colaboradores", icon: <Contact size={20} className="icon"/>, path: "/admin/colaboradores" },
    { name: "Diplomas", icon: <BookMarked size={20} className="icon"/>, path: "/admin/diplomas" },

  ];

  return (
    <div className="sidebar">
      <div className="sidebar-title">
        <img src="../src/assets/logo_patrones.png" alt="hola" className="img-logo-nav"/><p>Patrones Hermosos</p>
        </div>
      <div className={`sidebar-nav ${menuOpen ? "active" : ""}`}>
        {navItems.map((item) => (
          <Link
            to={item.path}
            key={item.path}
            onClick={() => setActive(item.path)}
            className={`sidebar-button ${active === item.path ? "active" : ""}`}
          >
            <div className="sidebar-icon-name">
            {item.icon}
            <span>{item.name}</span>
            </div>
            <ChevronRight size={20} />
          </Link>
        ))}

        <div className="sidebar-footer">
          <Link to="/" className="sidebar-button-logout">
            <LogOut size={20} />
            <span>Cerrar sesión</span>
          </Link>
        </div>
      </div>

      <div className="burguer" onClick={() => setMenuOpen(!menuOpen)}>
        <BurguerButton open={menuOpen} />
      </div>
     
    </div>
  );
}
