import { useMemo, useState, useRef, useEffect } from "react";
import { Link } from "react-router-dom";
import useMentoras from "../hooks/useMentoras";
import { SlidersHorizontal } from "lucide-react";
import Tabla from "./TablaMentorasListado";
import LoadingCard from "./LoadingCard";
import FiltroTabla from "./FiltroTabla";
import useCurrentRol from "../hooks/useCurrentRol";
import axios from "axios";


export default function TablaMentoras() {
  const { mentoras: mentorasOriginales, loading, error } = useMentoras();
  // console.log(mentorasOriginales);
  const [mentoras, setMentoras] = useState([]);

  useEffect(() => {
    setMentoras(mentorasOriginales);
  }, [mentorasOriginales]);

  const [busqueda, setBusqueda] = useState("");
  const containerRef = useRef(null);
  const [sortField, setSortField] = useState(null);
  const [sortOrder, setSortOrder] = useState("asc");
  const [mostrarFiltros, setMostrarFiltros] = useState(false);
  const [gruposSeleccionados, setGruposSeleccionados] = useState([]);
  const [estadosSeleccionados, setEstadosSeleccionados] = useState([]);
  const [sedeSeleccionada, setSedeSeleccionada] = useState([]);
  const estadosFijos = ["Pendiente", "Aceptado", "Rechazado"];
  const sedesDisponibles = useMemo(() => {
    const sedes = mentoras.map((m) => m.nombre_sede);
    return [...new Set(sedes)].sort();
  }, [mentoras]);
  // const currentRol = useCurrentRol();
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

  const statusOptions = useMemo(() => {
    const estados = mentoras.map((m) => m.estado);
    return [...new Set(estados)].sort();
  }, [mentoras]);


  const mentorasFiltradas = mentoras.filter((m) => {
    const nombreCompleto = `${m.nombre} ${m.apellido_paterno} ${m.apellido_materno || ""}`.toLowerCase();
    const coincideBusqueda = nombreCompleto.includes(busqueda.toLowerCase());
    const coincideSede =
      sedeSeleccionada.length === 0 ||
      sedeSeleccionada.includes(m.nombre_sede);
    return coincideBusqueda && coincideSede;
  });

  const participantesOrdenados = ordenarParticipantes(mentorasFiltradas);

  if (loading) return <LoadingCard mensaje="Cargando mentoras..." />;
  if (error) return <LoadingCard mensaje={error} />;

  const handleSort = (field) => {
    if (sortField === field) {
      setSortOrder((prev) => (prev === "asc" ? "desc" : "asc"));
    } else {
      setSortField(field);
      setSortOrder("asc");
    }
  };

  const handleStatusChange = async (id_mentora, nuevoEstado) => {
    try {
      // Actualiza el estado del colaborador
      const response = await axios.put(
        `/api/mentoras/estado/${id_mentora}`,
        { estado: nuevoEstado, }
      );

      if (response.data.success) {
        // Actualiza el estado localmente
        setMentoras((prev) =>
          prev.map((m) =>
            m.id_mentora === id_mentora
              ? { ...m, estado: nuevoEstado }
              : m
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
    <div className="tabla__containerBlancoMentora">
      <div className="tabla__container__tituloBusqueda">
        <h2 className="tabla__titulo">Listado de mentoras</h2>
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


            <FiltroTabla
              titulo="Sede"
              opciones={sedesDisponibles}
              seleccionados={sedeSeleccionada}
              setSeleccionados={setSedeSeleccionada}
            />


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

      <div className={rol === 0 ? "table_container" : "table_containerMentora"} ref={containerRef}>
        <Tabla
          mentoras={participantesOrdenados}
          onSort={handleSort}
          sortField={sortField}
          sortOrder={sortOrder}
          statusOptions={estadosFijos}
          onStatusChange={handleStatusChange}
        />
      </div>
      {rol === 1 && (
        <Link to="/admin/registro-mentoras" className="btn-agregar">
          Agregar mentora
        </Link>
      )}

    </div>
  );
}