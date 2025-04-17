import { useState, useEffect, useRef } from "react";
import axios from "axios";
import "../styles/registro.css";

export default function ListadoColaboradores() {
  const [colaboradores, setColaboradores] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(8); // Se ajustará dinámicamente

  const containerRef = useRef(null);

  useEffect(() => {
    const fetchColaboradores = async () => {
      try {
        setLoading(true);
        const response = await axios.get(`/api/colaboradores`);
        setColaboradores(response.data.data);
        setError(null);
      } catch (err) {
        setError(
          "Error al cargar los colaboradores: " +
            (err.response?.data?.message || err.message)
        );
        console.error("Error fetching colaboradores:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchColaboradores();
  }, []);

  // Detectar alto del contenedor y ajustar filas por página
  useEffect(() => {
    const calculateItemsPerPage = () => {
      if (containerRef.current) {
        const containerHeight = containerRef.current.getBoundingClientRect().height;
        const rowHeight = 60; // Puedes ajustar esto a tu diseño
        const headerOffset = 1.5; // Dejar espacio para encabezado y padding
        const availableRows = Math.floor(containerHeight / rowHeight - headerOffset);
        setItemsPerPage(Math.max(1, availableRows));
      }
    };

    calculateItemsPerPage(); // Inicial

    const observer = new ResizeObserver(() => {
      calculateItemsPerPage();
    });

    if (containerRef.current) {
      observer.observe(containerRef.current);
    }

    return () => {
      if (containerRef.current) {
        observer.unobserve(containerRef.current);
      }
    };
  }, []);

  const getSedeNombre = (id_sede) => {
    const sedes = {
      1: "ITESM Puebla",
      2: "ITESM Monterrey",
    };
    return sedes[id_sede] || `Sede ${id_sede}`;
  };

  const totalPages = Math.ceil(colaboradores.length / itemsPerPage);
  const paginatedColaboradores = colaboradores.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  if (loading) {
    return (
      <div className="fondo">
        <div className="register-container">
          <div className="card">
            <h2 className="titulo">Cargando colaboradores...</h2>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="fondo">
        <div className="register-container">
          <div className="card">
            <h2 className="titulo">Error</h2>
            <p className="error-message">{error}</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <>
      <div className="table-container" ref={containerRef}>
        <table className="colaboradores-table">
          <thead>
            <tr>
              <th>Nombre</th>
              <th>Apellidos</th>
              <th>Correo</th>
              <th>Universidad</th>
              <th>Rol</th>
              <th>Sede</th>
              <th>Estado</th>
            </tr>
          </thead>
          <tbody>
            {paginatedColaboradores.map((colaborador) => (
              <tr key={colaborador.id_colaborador}>
                <td>{colaborador.nombre}</td>
                <td>{`${colaborador.apellido_paterno} ${colaborador.apellido_materno}`}</td>
                <td>{colaborador.correo}</td>
                <td>{colaborador.universidad}</td>
                <td>{colaborador.rol}</td>
                <td>{getSedeNombre(colaborador.id_sede)}</td>
                <td>{colaborador.estado}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="paginacion">
        {Array.from({ length: totalPages }, (_, index) => (
          <button
            key={index + 1}
            onClick={() => setCurrentPage(index + 1)}
            className={`pagina-btn ${
              currentPage === index + 1 ? "activa" : ""
            }`}
          >
            {index + 1}
          </button>
        ))}
      </div>
    </>
  );
}
