import { useMemo, useState, useRef, useEffect, use } from "react";
import { Link } from "react-router-dom";
import useInformantes from "../hooks/useInformantes";
import { SlidersHorizontal } from "lucide-react";
import Tabla from "./TablaContactoListado";
import LoadingCard from "./LoadingCard";
import FiltroTabla from "./FiltroTabla";
import useCurrentRol from "../hooks/useCurrentRol";


export default function TablaInformantes() {
  const { informantes: informantesOriginales, loading, error } = useInformantes();
  // console.log(informantesOriginales);
  const [informantes, setInformantes] = useState([]);

  useEffect(() => {
    setInformantes(informantesOriginales);
  }, [informantesOriginales]);

  const [busqueda, setBusqueda] = useState("");
  const containerRef = useRef(null);
  const [sortField, setSortField] = useState(null);
  const [sortOrder, setSortOrder] = useState("asc");
  const [mostrarFiltros, setMostrarFiltros] = useState(false);
  const [gruposSeleccionados, setGruposSeleccionados] = useState([]);
  const [estadosSeleccionados, setEstadosSeleccionados] = useState([]);
  const { rol } = useCurrentRol();

  const ordenarParticipantes = (data) => {
    if (!sortField) return data;

    return [...data].sort((a, b) => {
      const aValue = a[sortField]?.toString().toLowerCase();
      const bValue = b[sortField]?.toString().toLowerCase();

      if (aValue < bValue) return sortOrder === "asc" ? -1 : 1;
      if (aValue > bValue) return sortOrder === "asc" ? 1 : -1;
      return 0;
    });
  };

  const informantesFiltradas = informantes.filter((m) => {
    const nombreCompleto = `${m.nombre} ${m.apellido_paterno} ${m.apellido_materno || ""}`.toLowerCase();
    return nombreCompleto.includes(busqueda.toLowerCase());
  });

  const participantesOrdenados = ordenarParticipantes(informantesFiltradas);

  if (loading) return <LoadingCard mensaje="Cargando contactos..." />;
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
    <div className="tabla__containerBlancoMentora">
      <div className="tabla__container__tituloBusqueda">
        <h2 className="tabla__titulo">Listado de contactos para informes</h2>
        <div className="tabla__contenedor_busquedaFiltros">
          {rol === 0 ? <button
            className="tabla__botonFiltros"
            onClick={() => setMostrarFiltros(true)}
          >
            Filtrar <SlidersHorizontal size={16} />
          </button> : null}
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
        <div
          className="tabla__overlay-filtros"
          onClick={() => setMostrarFiltros(false)}
        >
          <div className="tabla__panel-filtros" onClick={(e) => e.stopPropagation()}>
            <h3>Filtros avanzados</h3>




            <button
              className="tabla_boton-limpiar-filtros"
              onClick={() => {
                setBusqueda("");
                setGruposSeleccionados([]);
                setEstadosSeleccionados([])
                setMostrarFiltros(false);
              }}
            >
              Limpiar todos los filtros
            </button>
          </div>
        </div>
      )}

      <div className="table_containerMentora" ref={containerRef}>
        <Tabla
          informantes={participantesOrdenados}
          onSort={handleSort}
          sortField={sortField}
          sortOrder={sortOrder}

        />
      </div>
      <Link to="/admin/registro-contacto-informes" className="btn-agregar">
        Agregar contacto
      </Link>

    </div>
  );
}