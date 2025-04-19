import { useState } from "react";
import useColaboradores from "../hooks/useColaboradores";
import Tabla from "./Tabla";
import Paginacion from "./Paginacion";
import LoadingCard from "./LoadingCard";

export default function TablaColaboradores() {
  const { colaboradores, loading, error } = useColaboradores();
  const [currentPage, setCurrentPage] = useState(1);
  const [busqueda, setBusqueda] = useState(""); // NUEVO: estado de búsqueda
  const [sortField, setSortField] = useState(null);
  const [sortOrder, setSortOrder] = useState("asc"); // o "desc"
  const itemsPerPage = 12;

  const ordenarColaboradores = (data) => {
    if (!sortField) return data;
  
    return [...data].sort((a, b) => {
      const aValue = a[sortField]?.toString().toLowerCase();
      const bValue = b[sortField]?.toString().toLowerCase();
  
      if (aValue < bValue) return sortOrder === "asc" ? -1 : 1;
      if (aValue > bValue) return sortOrder === "asc" ? 1 : -1;
      return 0;
    });
  };
  
  const colaboradoresFiltrados = colaboradores.filter((colaborador) => {
    const nombreCompleto = `${colaborador.nombre} ${colaborador.apellido_paterno} ${colaborador.apellido_materno || ""}`;
    return nombreCompleto.toLowerCase().includes(busqueda.toLowerCase());
  });
  
  const colaboradoresOrdenados = ordenarColaboradores(colaboradoresFiltrados);
  const totalPages = Math.ceil(colaboradoresFiltrados.length / itemsPerPage);
  const paginated = colaboradoresOrdenados.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  if (loading) return <LoadingCard mensaje="Cargando colaboradores..." />;
  if (error) return <LoadingCard mensaje={error} />;

  const handleSort = (field) => {
    if (sortField === field) {
      setSortOrder((prev) => (prev === "asc" ? "desc" : "asc"));
    } else {
      setSortField(field);
      setSortOrder("asc");
    }
  };
  

  return (
    <>
      {/* 🔍 Campo de búsqueda */}
      <div className="titulo-busqueda-container">
      <h2 className="titulo_tabla">Listado de Colaboradores</h2>
        <input
          type="text"
          placeholder="Buscar por nombre..."
          value={busqueda}
          onChange={(e) => {
            setBusqueda(e.target.value);
            setCurrentPage(1); // Reinicia a la primera página al buscar
          }}
          className="input-busqueda"
        />
      </div>
      

      <Tabla
        colaboradores={paginated}
        onSort={handleSort}
        sortField={sortField}
        sortOrder={sortOrder}
      />

      <Paginacion
        totalPages={totalPages}
        currentPage={currentPage}
        setCurrentPage={setCurrentPage}
      />
    </>
  );
}
