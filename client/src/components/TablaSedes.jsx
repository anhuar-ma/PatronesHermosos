import { useMemo, useState, useRef, useEffect } from "react";
import useSedes from "../hooks/useSedes";
import { SlidersHorizontal } from "lucide-react";
import Tabla from "./TablaSedesListado";
import LoadingCard from "./LoadingCard";
import FiltroTabla from "./FiltroTabla";

export default function TablaSedes() {
  const { sedes: sedesOriginales, loading, error } = useSedes();
  const [sedes, setSedes] = useState([]);
    
  useEffect(() => {
    setSedes(sedesOriginales);
  }, [sedesOriginales]);

  const [busqueda, setBusqueda] = useState("");
  const containerRef = useRef(null);
  const [sortField, setSortField] = useState(null);
  const [sortOrder, setSortOrder] = useState("asc");
  const [mostrarFiltros, setMostrarFiltros] = useState(false);
  const [tiposSeleccionados, setTiposSeleccionados] = useState([]);
  const [estadosSeleccionados, setEstadosSeleccionados] = useState([]);

  const tiposDisponibles = useMemo(() => {
    const tipos = sedes.map((s) => s.tipo);
    return [...new Set(tipos)].sort();
  }, [sedes]);

  const statusOptions = useMemo(() => {
    const estados = sedes.map((s) => s.estado);
    return [...new Set(estados)].sort();
  }, [sedes]);

  const ordenarSedes = (data) => {
    if (!sortField) return data;

    return [...data].sort((a, b) => {
      const aValue = a[sortField]?.toString().toLowerCase();
      const bValue = b[sortField]?.toString().toLowerCase();

      if (aValue < bValue) return sortOrder === "asc" ? -1 : 1;
      if (aValue > bValue) return sortOrder === "asc" ? 1 : -1;
      return 0;
    });
  };

  const sedesFiltradas = sedes.filter((s) => {
    const nombreSede = s.nombre ? s.nombre.toString().toLowerCase() : "";
    const coincideBusqueda = nombreSede.includes(busqueda.toLowerCase());
    const coincideTipo = tiposSeleccionados.length === 0 || tiposSeleccionados.includes(s.tipo);
    const coincideEstado = estadosSeleccionados.length === 0 || estadosSeleccionados.includes(s.estado);

    return coincideBusqueda && coincideTipo && coincideEstado;
  });

  const sedesOrdenadas = ordenarSedes(sedesFiltradas);

  if (loading) return <LoadingCard mensaje="Cargando sedes..." />;
  if (error) return <LoadingCard mensaje={error} />;

  const handleSort = (field) => {
    if (sortField === field) {
      setSortOrder((prev) => (prev === "asc" ? "desc" : "asc"));
    } else {
      setSortField(field);
      setSortOrder("asc");
    }
  };

  const handleStatusChange = async (id_sede, nuevoEstado) => {
    try {
      const token = localStorage.getItem("token"); // Asegúrate de que el token esté aquí
  
      const response = await fetch(`/api/sedes/estado/${id_sede}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}` // Incluye el token JWT aquí
        },
        body: JSON.stringify({ estado: nuevoEstado }),
      });
  
      if (response.ok) {
        setSedes((prev) =>
          prev.map((p) =>
            p.id_sede === id_sede ? { ...p, estado: nuevoEstado } : p
          )
        );
      } else {
        console.error("Error al actualizar el estado:", await response.text());
      }
    } catch (error) {
      console.error("Error en la solicitud:", error);
    }
  };
  

  return (
    <div className="tabla__containerBlanco">
      <div className="tabla__container__tituloBusqueda">
        <h2 className="tabla__titulo">Listado de Sedes</h2>
        <div className="tabla__contenedor_busquedaFiltros">
          <button
            className="tabla__botonFiltros"
            onClick={() => setMostrarFiltros(true)}
          >
            Filtrar <SlidersHorizontal size={16} />
          </button>
          <input
            type="text"
            placeholder="Buscar por nombre..."
            value={busqueda}
            onChange={(e) => setBusqueda(e.target.value)}
            className="tabla__input-busqueda"
          />
        </div>
      </div>

      {mostrarFiltros && (
        <div className="tabla__overlay-filtros" onClick={() => setMostrarFiltros(false)}>
          <div className="tabla__panel-filtros" onClick={(e) => e.stopPropagation()}>
            <h3>Filtros avanzados</h3>
            <FiltroTabla titulo="Tipo" opciones={tiposDisponibles} seleccionados={tiposSeleccionados} setSeleccionados={setTiposSeleccionados} />
            <FiltroTabla titulo="Estado" opciones={statusOptions} seleccionados={estadosSeleccionados} setSeleccionados={setEstadosSeleccionados} />
            <button onClick={() => { setBusqueda(""); setTiposSeleccionados([]); setEstadosSeleccionados([]); setMostrarFiltros(false); }}>Limpiar todos los filtros</button>
          </div>
        </div>
      )}

      <div className="table_container" ref={containerRef}>
        <Tabla sedes={sedesOrdenadas} onSort={handleSort} statusOptions={statusOptions} sortField={sortField} sortOrder={sortOrder} onStatusChange={handleStatusChange}/>
      </div>
    </div>
  );
}
