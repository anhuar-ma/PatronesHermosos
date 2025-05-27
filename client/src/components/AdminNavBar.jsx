import { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import BurguerButton from "./BurguerButton"; // Asegúrate de importar el mismo
import {
  House,
  MapPinHouse,
  Settings,
  Users,
  Compass,
  User,
  BookMarked,
  ChevronRight,
  Contact,
  LogOut,
} from "lucide-react";
import "../styles/Sidebar.css"; // Asegúrate de importar los estilos

export default function AdminNavbar() {
  const [active, setActive] = useState("/");
  const [menuOpen, setMenuOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate(); // Add navigate hook
  const { logout } = useAuth(); // Get logout function from auth context


  useEffect(() => {
    setMenuOpen(false); // Cierra menú al navegar
  }, [location.pathname]);

  const handleLogout = () =>{
    logout();
    navigate("/");

  }

  const navItems = [
    {
      name: "Inicio",
      icon: <House size={20} className="AdminNavBar__icon" />,
      path: "/admin/inicio",
    },
    {
      name: "Sedes",
      icon: <MapPinHouse size={20} className="AdminNavBar__icon" />,
      path: "/admin/sedes",
    },
     {
      name: "Grupos",
      icon: <Users size={20} className="AdminNavBar__icon" />,
      path: "/admin/grupos",
    },
    {
      name: "Participantes",
      icon: <User size={20} className="AdminNavBar__icon " />,
      path: "/admin/participantes",
    },
    {
      name: "Colaboradores",
      icon: <Contact size={20} className="AdminNavBar__icon" />,
      path: "/admin/colaboradores",
    },
     {
      name: "Mentoras",
      icon: <Compass size={20} className="AdminNavBar__icon " />,
      path: "/admin/mentoras",
    },
    {
      name: "Diplomas",
      icon: <BookMarked size={20} className="AdminNavBar__icon " />,
      path: "/admin/diplomas",
    },
  ];

  return (
    <div className="AdminNavbar">
      <div className="AdminNavbar__title">
        <img
          src="../src/assets/logo_patrones.png"
          alt="hola"
          className="AdminNavbar__imgLogoNav"
        />
        <p>Patrones Hermosos</p>
      </div>
      <div className={`AdminNavbar__nav ${menuOpen ? "active" : ""}`}>
        {navItems.map((item) => (
          <Link
            to={item.path}
            key={item.path}
            onClick={() => setActive(item.path)}
            className={`AdminNavbar__button ${
              active === item.path ? "active" : ""
            }`}
          >
            <div className="AdminNavbar__container-icon-name">
              {item.icon}
              <span className="AdminNavbar__buttonLabel">{item.name}</span>
            </div>
            <ChevronRight size={20} />
          </Link>
        ))}

          {/* <div className="AdminNavbar__footer"> */}
      <button
        onClick={handleLogout}
        className="AdminNavbar__button-logout"
      >
        <LogOut size={20} />
        <span className="AdminNavbar__buttonLabel">Cerrar sesión</span>
      </button>
        {/* </div> */}
      </div>

      <div
        className="AdminNavBar__burguerButton"
        onClick={() => setMenuOpen(!menuOpen)}
      >
        <BurguerButton open={menuOpen} />
      </div>
    </div>
  );
}
