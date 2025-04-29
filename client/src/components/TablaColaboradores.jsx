import { useMemo, useState,useRef } from "react";
import { getSedeNombre } from "../utils/sedeUtils"; // ya lo usas en Tabla
import useColaboradores from "../hooks/useColaboradores";
import {SlidersHorizontal} from "lucide-react";
import Tabla from "./Tabla";

import LoadingCard from "./LoadingCard";
import FiltroTabla from "./FiltroTabla";

export default function TablaColaboradores() {
  const { colaboradores, loading, error } = useColaboradores();
  const [busqueda, setBusqueda] = useState(""); 
  const containerRef = useRef(null); 
  const [sortField, setSortField] = useState(null);
  const [sortOrder, setSortOrder] = useState("asc"); 
  const [filtroEstado, setFiltroEstado] = useState("");
const [filtroRol, setFiltroRol] = useState("");
const [filtroSede, setFiltroSede] = useState("");
const [mostrarFiltros, setMostrarFiltros] = useState(false);

const [rolesSeleccionados, setRolesSeleccionados] = useState([]);
const [estadosSeleccionados, setEstadosSeleccionados] = useState([]);
const [sedesSeleccionadas, setSedesSeleccionadas] = useState([]);


const rolesDisponibles = useMemo(() => {
  const roles = colaboradores.map(c => c.rol);
  return [...new Set(roles)].sort();
}, [colaboradores]);

const sedesDisponibles = useMemo(() => {
  const sedes = colaboradores.map(c => c.id_sede);
  return [...new Set(sedes)].sort((a, b) =>
    getSedeNombre(a).localeCompare(getSedeNombre(b))
  );
}, [colaboradores]);

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
    const nombreCompleto = `${colaborador.nombre} ${colaborador.apellido_paterno} ${colaborador.apellido_materno || ""}`.toLowerCase();
    const coincideBusqueda = nombreCompleto.includes(busqueda.toLowerCase());
  
    const coincideRol =
      rolesSeleccionados.length === 0 || rolesSeleccionados.includes(colaborador.rol);
  
    const coincideEstado =
      estadosSeleccionados.length === 0 || estadosSeleccionados.includes(colaborador.estado);
  
    const coincideSede =
      sedesSeleccionadas.length === 0 || sedesSeleccionadas.includes(getSedeNombre(colaborador.id_sede));
  
    return coincideBusqueda && coincideRol && coincideEstado && coincideSede;
  });
  
  
  // const colaboradoresFiltrados = colaboradores.filter((colaborador) => {
    
  
  //   const coincideBusqueda = nombreCompleto.includes(busqueda.toLowerCase());
  //   const coincideEstado = filtroEstado === "" || colaborador.estado === filtroEstado;
  //   const coincideRol = filtroRol === "" || colaborador.rol === filtroRol;
  //   const coincideSede = filtroSede === "" || String(colaborador.id_sede) === filtroSede;
  
  //   return coincideBusqueda && coincideEstado && coincideRol && coincideSede;
  // });
  
  const colaboradoresOrdenados = ordenarColaboradores(colaboradoresFiltrados);

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
    <div className="container_tablas"> 
      {/* 🔍 Campo de búsqueda */}
      <div className="titulo-busqueda-container">
        <h2 className="titulo_tabla">Listado de Colaboradores</h2>
        <div className="contenedor_busqueda_filtros">
          <button className="abrir-filtros" onClick={() => setMostrarFiltros(true)}>
            Filtrar <SlidersHorizontal size={16} />
          </button>
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
      </div>
      

{mostrarFiltros && (
  <div className="overlay-filtros" onClick={() => setMostrarFiltros(false)}>
    <div className="panel-filtros" onClick={(e) => e.stopPropagation()}>
      <h3>Filtros avanzados</h3>

      {/* <label>Estado:</label>
      <select value={filtroEstado} onChange={(e) => setFiltroEstado(e.target.value)}>
        <option value="">Todos</option>
        <option value="Aceptado">Aceptado</option>
        <option value="Pendiente">Pendiente</option>
        <option value="Rechazado">Rechazado</option>
      </select>

      <label>Rol:</label>
      <select value={filtroRol} onChange={(e) => setFiltroRol(e.target.value)}>
        <option value="">Todos</option>
        {rolesDisponibles.map((rol) => (
          <option key={rol} value={rol}>{rol}</option>
        ))}
      </select>

      <label>Sede:</label>
      <select value={filtroSede} onChange={(e) => setFiltroSede(e.target.value)}>
        <option value="">Todas</option>
        {sedesDisponibles.map((id_sede) => (
          <option key={id_sede} value={id_sede}>{getSedeNombre(id_sede)}</option>
        ))}
      </select> */}



<FiltroTabla
  titulo="Rol"
  opciones={rolesDisponibles}
  seleccionados={rolesSeleccionados}
  setSeleccionados={setRolesSeleccionados}
/>

<FiltroTabla
  titulo="Estado"
  opciones={["Activo", "Inactivo"]}
  seleccionados={estadosSeleccionados}
  setSeleccionados={setEstadosSeleccionados}
/>

<FiltroTabla
  titulo="Sede"
  opciones={sedesDisponibles.map(getSedeNombre)}
  seleccionados={sedesSeleccionadas}
  setSeleccionados={setSedesSeleccionadas}
/>

<button
  className="boton-limpiar"
  onClick={() => {
    // Limpiar texto de búsqueda
    setBusqueda("");

    // Limpiar filtros tipo select (si los sigues usando)
    setFiltroEstado("");
    setFiltroRol("");
    setFiltroSede("");

    // Limpiar filtros tipo checkbox múltiple
    setRolesSeleccionados([]);
    setEstadosSeleccionados([]);
    setSedesSeleccionadas([]);

    // Cerrar panel si es modal
    setMostrarFiltros(false);
  }}
>
  Limpiar todos los filtros
</button>

    </div>
  </div>
)}

      <div className="table_container" ref={containerRef}>
        <Tabla
          colaboradores={colaboradoresOrdenados}
          onSort={handleSort}
          sortField={sortField}
          sortOrder={sortOrder}
        />
      </div>

     
      </div>
      
    </>
  );
}
