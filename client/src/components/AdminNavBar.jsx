import { useState } from "react";
import { Home, Settings, User } from "lucide-react";
import "../styles/Sidebar.css"; // Asegúrate de importar los estilos

export default function AdminNavbar() {
  const [active, setActive] = useState("/");

  const navItems = [
    { name: "Inicio", icon: <Home size={20} />, path: "/" },
    { name: "Perfil", icon: <User size={20} />, path: "/perfil" },
    { name: "Configuración", icon: <Settings size={20} />, path: "/configuracion" },
  ];

  return (
    <aside className="sidebar">
      <div className="sidebar-title">MiApp</div>
      <nav className="sidebar-nav">
        {navItems.map((item) => (
          <button
            key={item.path}
            onClick={() => setActive(item.path)}
            className={`sidebar-button ${active === item.path ? "active" : ""}`}
          >
            {item.icon}
            <span>{item.name}</span>
          </button>
        ))}
      </nav>
    </aside>
  );
}
