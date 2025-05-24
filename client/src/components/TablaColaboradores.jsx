import { useMemo, useState, useRef, useEffect } from "react";
import { getSedeNombre } from "../utils/sedeUtils"; // Función auxiliar para obtener el nombre de la sede a partir de su ID
import useColaboradores from "../hooks/useColaboradores"; // Hook personalizado para obtener datos de colaboradores
import { SlidersHorizontal } from "lucide-react"; // Ícono para el botón de filtros
import Tabla from "./TablaColaboradoresListado"; // Componente de tabla donde se renderizan los colaboradores
import LoadingCard from "./LoadingCard"; // Componente de carga y errores
import FiltroTabla from "./FiltroTabla"; // Componente para filtros avanzados
import axios from "axios"; // Librería para hacer peticiones HTTP
import useCurrentRol from "../hooks/useCurrentRol";

/**
 * Componente que muestra un listado de colaboradores con:
 * - Búsqueda por nombre
 * - Ordenamiento por campos
 * - Filtros avanzados (rol, estado, sede)
 *
 * @component
 */
export default function TablaColaboradores() {
  // Obtiene datos, estado de carga y posibles errores
  const {
    colaboradores: colaboradoresOriginales,
    loading,
    error,
  } = useColaboradores();
    const currentRol = useCurrentRol();
  

  // 1. Copia local para poder mutar el estado en cliente
  const [colaboradores, setColaboradores] = useState([]);
  useEffect(() => {
    setColaboradores(colaboradoresOriginales);
  }, [colaboradoresOriginales]);

  // 2. Opciones de estado dinámicas
  const statusOptions = useMemo(() => {
    const estados = colaboradores.map((c) => c.estado);
    return [...new Set(estados)].sort();
  }, [colaboradores]);

  //  const rolesDisponibles = useMemo(() => {
  //   const roles = colaboradores.map((c) => c.rol);
  //   return [...new Set(roles)].sort();
  // }, [colaboradores]);

  // Estado para el texto de búsqueda
  const [busqueda, setBusqueda] = useState("");

  // Referencia al contenedor de la tabla (útil para scroll, etc.)
  const containerRef = useRef(null);

  // Estado de ordenamiento: campo y dirección ("asc" | "desc")
  const [sortField, setSortField] = useState(null);
  const [sortOrder, setSortOrder] = useState("asc");

  // Control de visibilidad del panel de filtros
  const [mostrarFiltros, setMostrarFiltros] = useState(false);

  // Filtros seleccionados: roles, estados y sedes
  const [rolesSeleccionados, setRolesSeleccionados] = useState([]);
  const [estadosSeleccionados, setEstadosSeleccionados] = useState([]);
  const [sedesSeleccionadas, setSedesSeleccionadas] = useState([]);

  //Filtro para tener siempre los estados que se requieren
  const estadosFijos = ["Pendiente", "Aceptado", "Rechazado"];

  /**
   * Lista de roles únicos extraídos de los colaboradores.
   * Se memoriza para no recalcular en cada render si 'colaboradores' no cambia.
   */
  const rolesDisponibles = ["Staff", "Instructora", "Facilitadora"];

  /**
   * Lista de IDs de sede únicos de los colaboradores, ordenados alfabéticamente
   * según su nombre (usando getSedeNombre).
   */
  const sedesDisponibles = useMemo(() => {
    const sedes = colaboradores.map((c) => c.id_sede);
    return [...new Set(sedes)].sort((a, b) =>
      getSedeNombre(a).localeCompare(getSedeNombre(b))
    );
  }, [colaboradores]);

  /**
   * Función para ordenar un array de colaboradores según el campo y el orden seleccionado.
   *
   * @param {Array} data - Array de colaboradores a ordenar.
   * @returns {Array} - Nuevo array ordenado.
   */
  const ordenarColaboradores = (data) => {
    if (!sortField) return data; // Si no hay campo, devolver sin ordenar

    return [...data].sort((a, b) => {
      const aValue = a[sortField]?.toString().toLowerCase();
      const bValue = b[sortField]?.toString().toLowerCase();

      if (aValue < bValue) return sortOrder === "asc" ? -1 : 1;
      if (aValue > bValue) return sortOrder === "asc" ? 1 : -1;
      return 0;
    });
  };

  /**
   * Filtrado combinado:
   * - Coincidencia de texto en nombre completo
   * - Coincidencia de rol (si hay roles seleccionados)
   * - Coincidencia de estado (si hay estados seleccionados)
   * - Coincidencia de sede (si hay sedes seleccionadas)
   */
  const colaboradoresFiltrados = colaboradores.filter((colaborador) => {
    const nombreCompleto = `${colaborador.nombre} ${
      colaborador.apellido_paterno
    } ${colaborador.apellido_materno || ""}`.toLowerCase();
    const coincideBusqueda = nombreCompleto.includes(busqueda.toLowerCase());
    const coincideRol =
      rolesSeleccionados.length === 0 ||
      rolesSeleccionados.includes(colaborador.rol);
    const coincideEstado =
      estadosSeleccionados.length === 0 ||
      estadosSeleccionados.includes(colaborador.estado);
    const coincideSede =
      sedesSeleccionadas.length === 0 ||
      sedesSeleccionadas.includes(getSedeNombre(colaborador.id_sede));

    return coincideBusqueda && coincideRol && coincideEstado && coincideSede;
  });

  // Aplica ordenamiento sobre los filtrados
  const colaboradoresOrdenados = ordenarColaboradores(colaboradoresFiltrados);

  // Si está cargando, mostramos indicador
  if (loading) return <LoadingCard mensaje="Cargando colaboradores..." />;

  // Si hay error, lo mostramos
  if (error) return <LoadingCard mensaje={error} />;

  /**
   * Manejador de clic en encabezados para ordenar:
   * - Si ya estamos ordenando por el mismo campo, invierte la dirección
   * - Si es un campo nuevo, fija orden ascendente
   *
   * @param {string} field - Nombre del campo por el que ordenar
   */
  const handleSort = (field) => {
    if (sortField === field) {
      setSortOrder((prev) => (prev === "asc" ? "desc" : "asc"));
    } else {
      setSortField(field);
      setSortOrder("asc");
    }
  };

  const handleStatusChange = async (id_colaborador, nuevoEstado) => {
    try {
      const response = await axios.put(
        `/api/colaboradores/estado/${id_colaborador}`,
        {
          estado: nuevoEstado,
        }
      );

      if (response.data.success) {
        setColaboradores((prev) =>
          prev.map((c) =>
            c.id_colaborador === id_colaborador
              ? { ...c, estado: nuevoEstado }
              : c
          )
        );
      } else {
        console.error("Error al actualizar el estado");
      }
    } catch (error) {
      // Display the specific error message from the server
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

  // //Funcion para manejo de cambio de estado en colaboradores
  // const handleStatusChange = async (id_colaborador, nuevoEstado) => {
  //   try {
  //     // Actualiza el estado del colaborador
  //     const response = await fetch(`/api/colaboradores/estado/${id_colaborador}`, {
  //       method: "PUT",
  //       headers: { "Content-Type": "application/json" },
  //       body: JSON.stringify({ estado: nuevoEstado }),
  //     });

  //     if (response.ok) {
  //       setColaboradores((prev) =>
  //         prev.map((c) =>
  //           c.id_colaborador === id_colaborador ? { ...c, estado: nuevoEstado } : c
  //         )
  //       );

  //       // Si el estado es "Aceptado", envía el correo
  //       if (nuevoEstado === "Aceptado") {
  //         const emailResponse = await fetch(`/api/colaboradores/email/${id_colaborador}`, {
  //           method: "POST",
  //         });

  //         if (!emailResponse.ok) {
  //           console.error("Error al enviar el correo");
  //         }
  //       }
  //     } else {
  //       console.error("Error al actualizar el estado");
  //     }
  //   } catch (error) {
  //     console.error("Error en la solicitud:", error);
  //   }
  // };

  return (
    <div className="tabla__containerBlanco">
      {/* Encabezado y búsqueda */}
      <div className="tabla__container__tituloBusqueda">
        <h2 className="tabla__titulo">Listado de Colaboradores</h2>
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
            onChange={(e) => {
              setBusqueda(e.target.value);
            }}
            className="tabla__input-busqueda"
          />
        </div>
      </div>

      {/* Panel de filtros avanzados (modal) */}
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

            {/* Filtro por rol */}
            <FiltroTabla
              titulo="Rol"
              opciones={rolesDisponibles}
              seleccionados={rolesSeleccionados}
              setSeleccionados={setRolesSeleccionados}
            />

            {/* Filtro por estado */}
            <FiltroTabla
              titulo="Estado"
              opciones={estadosFijos}
              seleccionados={estadosSeleccionados}
              setSeleccionados={setEstadosSeleccionados}
            />

            {/* Filtro por sede */}

            {currentRol === 0 ? (
              <FiltroTabla
                titulo="Sede"
                opciones={sedesDisponibles.map(getSedeNombre)}
                seleccionados={sedesSeleccionadas}
                setSeleccionados={setSedesSeleccionadas}
              />
            ) : null}

            {/* Botón para limpiar todos los filtros */}
            <button
              className="tabla_boton-limpiar-filtros"
              onClick={() => {
                setBusqueda("");
                setRolesSeleccionados([]);
                setEstadosSeleccionados([]);
                setSedesSeleccionadas([]);
                setMostrarFiltros(false);
              }}
            >
              Limpiar todos los filtros
            </button>
          </div>
        </div>
      )}

      {/* Renderizado de la tabla con datos filtrados y ordenados */}
      <div className="table_container" ref={containerRef}>
        <Tabla
          colaboradores={colaboradoresOrdenados}
          onSort={handleSort}
          sortField={sortField}
          sortOrder={sortOrder}
          // 6. Pasamos las props nuevas al componente Tabla
          statusOptions={estadosFijos}
          onStatusChange={handleStatusChange}
        />
      </div>
    </div>
  );
}
