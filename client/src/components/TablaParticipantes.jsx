import { useMemo, useState, useRef, useEffect } from "react";
import useParticipantesParents from "../hooks/useParticipantesParents";
import { SlidersHorizontal } from "lucide-react";
import Tabla from "./TablaParticipantesListado";
import LoadingCard from "./LoadingCard";
import FiltroTabla from "./FiltroTabla";
import axios from "axios";

export default function TablaParticipantes() {
  const {
    participantes: participantesOriginales,
    loading,
    error,
  } = useParticipantesParents();
  const [participantes, setParticipantes] = useState([]);

  useEffect(() => {
    setParticipantes(participantesOriginales);
  }, [participantesOriginales]);

  const [busqueda, setBusqueda] = useState("");
  const containerRef = useRef(null);
  const [sortField, setSortField] = useState(null);
  const [sortOrder, setSortOrder] = useState("asc");
  const [mostrarFiltros, setMostrarFiltros] = useState(false);
  const [grupoAsignadoSeleccionado, setGrupoAsignadoSeleccionado] = useState(
    []
  );
  const [estadosSeleccionados, setEstadosSeleccionados] = useState([]);
  const estadosFijos = ["Pendiente", "Aceptado", "Rechazado"];

  // ✅ useMemo deben estar antes de cualquier return
  const gruposDisponibles = useMemo(() => {
    const grupos = participantes.map((p) => p.id_grupo);
    return [...new Set(grupos)].sort();
  }, [participantes]);

  const statusOptions = useMemo(() => {
    const estados = participantes.map((p) => p.estado);
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
    const nombreCompleto = `${p.nombre} ${p.apellido_paterno} ${
      p.apellido_materno || ""
    }`.toLowerCase();
    const coincideBusqueda = nombreCompleto.includes(busqueda.toLowerCase());
    const coincideEstado =
      estadosSeleccionados.length === 0 ||
      estadosSeleccionados.includes(p.estado);
    const estadoGrupo = p.id_grupo ? "Asignado" : "Sin asignar";
    const coincideGrupoAsignado =
      grupoAsignadoSeleccionado.length === 0 ||
      grupoAsignadoSeleccionado.includes(estadoGrupo);

    return (
      coincideBusqueda &&
      coincideEstado &&
      coincideGrupoAsignado
    );
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

  const handleStatusChange = async (id_participante, nuevoEstado) => {
    try {
      let razonRechazo = "";
  
      // Si se selecciona "Rechazado", solicitar la razón
      if (nuevoEstado === "Rechazado") {
        razonRechazo = prompt("Por favor, indica la razón del rechazo:");
        if (!razonRechazo) {
          alert("Debes ingresar una razón para rechazar a la participante.");
          return;
        }
      }
  
      // Actualiza el estado en la base de datos
      const response = await axios.put(
        `/api/participantes/estado/${id_participante}`,
        { estado: nuevoEstado }
      );
  
      if (response.data.success) {
        // Actualiza el estado localmente
        setParticipantes((prev) =>
          prev.map((p) =>
            p.id_participante === id_participante
              ? { ...p, estado: nuevoEstado }
              : p
          )
        );
  
        // Envía el correo, incluyendo la razón si es un rechazo
        const emailResponse = await axios.post(
          `/api/participantes/email/${id_participante}`,
          {
            estado: nuevoEstado,
            razon: razonRechazo || null,
          }
        );
  
        if (emailResponse.data.success) {
          alert(emailResponse.data.message);
        } else {
          console.error("Error al enviar el correo");
        }
      } else {
        console.error("Error al actualizar el estado");
      }
    } catch (error) {
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
          <div
            className="tabla__panel-filtros"
            onClick={(e) => e.stopPropagation()}
          >
            <h3>Filtros avanzados</h3>

            <FiltroTabla
              titulo="Estado"
              opciones={estadosFijos}
              seleccionados={estadosSeleccionados}
              setSeleccionados={setEstadosSeleccionados}
            />
            <FiltroTabla
              titulo="Grupo"
              opciones={["Asignado", "Sin asignar"]}
              seleccionados={grupoAsignadoSeleccionado}
              setSeleccionados={setGrupoAsignadoSeleccionado}
            />

            <button
              className="tabla_boton-limpiar-filtros"
              onClick={() => {
                setBusqueda("");
                setGruposSeleccionados([]);
                setEstadosSeleccionados([]);
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
          statusOptions={estadosFijos}
        />
      </div>
    </div>
  );
}
