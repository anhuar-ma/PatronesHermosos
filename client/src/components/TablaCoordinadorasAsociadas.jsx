import { useMemo, useState, useRef, useEffect } from "react";
import useCoordinadoras from "../hooks/useCoordinadoras";
import axios from "axios";
import { SlidersHorizontal } from "lucide-react";
import Tabla from "./TablaCoordinadorasAsociadasListado";
import LoadingCard from "./LoadingCard";
import FiltroTabla from "./FiltroTabla";

export default function TablaCoordinadorasAsociadas() {
  const { coordinadoras: coordinadorasOriginales, loading, error } = useCoordinadoras();
  const [coordinadoras, setCoordinadoras] = useState([]);
    
  useEffect(() => {
    setCoordinadoras(coordinadorasOriginales);
  }, [coordinadorasOriginales]);

  const [busqueda, setBusqueda] = useState("");
  const containerRef = useRef(null);
  const [sortField, setSortField] = useState(null);
  const [sortOrder, setSortOrder] = useState("asc");
  const [mostrarFiltros, setMostrarFiltros] = useState(false);
  const [tiposSeleccionados, setTiposSeleccionados] = useState([]);
  const [estadosSeleccionados, setEstadosSeleccionados] = useState([]);
  const estadosFijos = ["Pendiente", "Aceptado", "Rechazado"];

  const tiposDisponibles = useMemo(() => {
    const tipos = coordinadoras.map((c) => c.tipo);
    return [...new Set(tipos)].sort();
  }, [coordinadoras]);

  const statusOptions = useMemo(() => {
    const estados = coordinadoras.map((c) => c.estado);
    return [...new Set(estados)].sort();
  }, [coordinadoras]);

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

  const coordinadorasFiltradas = coordinadoras.filter((c) => {
    const nombreCoordinadora = c.nombre_sede ? c.nombre_sede.toString().toLowerCase() : "";
    const coincideBusqueda = nombreCoordinadora.includes(busqueda.toLowerCase());
    const coincideTipo = tiposSeleccionados.length === 0 || tiposSeleccionados.includes(c.tipo);
    const coincideEstado = estadosSeleccionados.length === 0 || estadosSeleccionados.includes(c.estado);

    return coincideBusqueda && coincideTipo && coincideEstado;
  });

  const coordinadorasOrdenadas = ordenarSedes(coordinadorasFiltradas);

  if (loading) return <LoadingCard mensaje="Cargando coordinadoras..." />;
  if (error) return <LoadingCard mensaje={error} />;

  const handleSort = (field) => {
    if (sortField === field) {
      setSortOrder((prev) => (prev === "asc" ? "desc" : "asc"));
    } else {
      setSortField(field);
      setSortOrder("asc");
    }
  };

  const handleStatusChange = async (id_coordinadora_asociada, nuevoEstado) => {
    try {
      // Actualiza el estado del colaborador
      const response = await axios.put(
        `/api/coordinadoras_asociadas/estado/${id_coordinadora_asociada}`,
        {estado: nuevoEstado,}
      );
  
      if (response.data.success) {
        // Actualiza el estado localmente
        setCoordinadoras((prev) =>
          prev.map((c) =>
            c.id_coordinadora_asociada === id_coordinadora_asociada
              ? { ...c, estado: nuevoEstado }
              : c
          )
        );
      } else {
        console.error("Error al actualizar el estado");
      }
    } catch (error) {
      // Manejo de errores
      if (
        error.response &&
        error.response.data &&
        error.response.data.message
      ) {
        alert(error.response.data.message);
      } else {
        alert("Error al actualizar el estado del participante");
      }
      console.error("Error en la solicitud:", error);
    }
  };
  

  return (
    <div className="tabla__containerBlanco">
      <div className="tabla__container__tituloBusqueda">
        <h2 className="tabla__titulo">Listado de coordinadoras asociadas</h2>
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
            <FiltroTabla titulo="Estado" opciones={statusOptions} seleccionados={estadosSeleccionados} setSeleccionados={setEstadosSeleccionados} />
            <button className="tabla_boton-limpiar-filtros" onClick={() => { setBusqueda(""); setTiposSeleccionados([]); setEstadosSeleccionados([]); setMostrarFiltros(false); }}>Limpiar todos los filtros</button>
          </div>
        </div>
      )}

       <div className="table_container titulo2filas" ref={containerRef}>
        <Tabla coordinadoras={coordinadorasOrdenadas} onSort={handleSort} statusOptions={estadosFijos} sortField={sortField} sortOrder={sortOrder} onStatusChange={handleStatusChange}/>
      </div>
    </div>
  );
}
