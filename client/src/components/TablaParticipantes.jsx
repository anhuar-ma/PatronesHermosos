import { useMemo, useState, useRef } from "react";
import useParticipantesParents from "../hooks/useParticipantesParents";
import { SlidersHorizontal } from "lucide-react";
import Tabla from "./TablaParticipantesListado";
import LoadingCard from "./LoadingCard";
import FiltroTabla from "./FiltroTabla";

export default function TablaParticipantes() {
  const { participantes, loading, error } = useParticipantesParents();

  const [busqueda, setBusqueda] = useState("");
  const containerRef = useRef(null);
  const [sortField, setSortField] = useState(null);
  const [sortOrder, setSortOrder] = useState("asc");
  const [mostrarFiltros, setMostrarFiltros] = useState(false);
  const [gruposSeleccionados, setGruposSeleccionados] = useState([]);

  // ✅ useMemo deben estar antes de cualquier return
  const gruposDisponibles = useMemo(() => {
    const grupos = participantes.map((p) => p.id_grupo);
    return [...new Set(grupos)].sort();
  }, [participantes]);

  const statusOptions = useMemo(() => {
    const estados = participantes.map((c) => c.estado);
    return [...new Set(estados)].sort();
  }, [participantes]);

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

  const participantesFiltrados = participantes.filter((p) => {
    const nombreCompleto = `${p.nombre} ${p.apellido_paterno} ${p.apellido_materno || ""}`.toLowerCase();
    const coincideBusqueda = nombreCompleto.includes(busqueda.toLowerCase());
    const coincideGrupo =
      gruposSeleccionados.length === 0 || gruposSeleccionados.includes(p.id_grupo);

    return coincideBusqueda && coincideGrupo;
  });

  const participantesOrdenados = ordenarParticipantes(participantesFiltrados);

  if (loading) return <LoadingCard mensaje="Cargando participantes..." />;
  if (error) return <LoadingCard mensaje={error} />;

  const handleSort = (field) => {
    if (sortField === field) {
      setSortOrder((prev) => (prev === "asc" ? "desc" : "asc"));
    } else {
      setSortField(field);
      setSortOrder("asc");
    }
  };

  const handleStatusChange = (id_participante, nuevoEstado) => {
    // Aquí podrías enviar una petición para actualizar el estado del participante
    console.log(`Cambiar estado del participante ${id_participante} a ${nuevoEstado}`);
  };

  return (
    <div className="tabla__containerBlanco">
      <div className="tabla__container__tituloBusqueda">
        <h2 className="tabla__titulo">Listado de Participantes</h2>
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
        <div
          className="tabla__overlay-filtros"
          onClick={() => setMostrarFiltros(false)}
        >
          <div className="tabla__panel-filtros" onClick={(e) => e.stopPropagation()}>
            <h3>Filtros avanzados</h3>

            <FiltroTabla
              titulo="Grupo"
              opciones={gruposDisponibles}
              seleccionados={gruposSeleccionados}
              setSeleccionados={setGruposSeleccionados}
            />

            <button
              className="tabla_boton-limpiar-filtros"
              onClick={() => {
                setBusqueda("");
                setGruposSeleccionados([]);
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
          participantes={participantesOrdenados}
          onSort={handleSort}
          sortField={sortField}
          sortOrder={sortOrder}
          onStatusChange={handleStatusChange}
          statusOptions={statusOptions}
        />
      </div>
    </div>
  );
}
