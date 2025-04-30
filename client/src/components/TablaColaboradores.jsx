import { useMemo, useState, useRef } from "react";
import { getSedeNombre } from "../utils/sedeUtils"; // Función auxiliar para obtener el nombre de la sede a partir de su ID
import useColaboradores from "../hooks/useColaboradores"; // Hook personalizado para obtener datos de colaboradores
import { SlidersHorizontal } from "lucide-react"; // Ícono para el botón de filtros
import Tabla from "./TablaColaboradoresListado"; // Componente de tabla donde se renderizan los colaboradores
import LoadingCard from "./LoadingCard"; // Componente de carga y errores
import FiltroTabla from "./FiltroTabla"; // Componente para filtros avanzados

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
  const { colaboradores, loading, error } = useColaboradores();

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

  /**
   * Lista de roles únicos extraídos de los colaboradores.
   * Se memoriza para no recalcular en cada render si 'colaboradores' no cambia.
   */
  const rolesDisponibles = useMemo(() => {
    const roles = colaboradores.map((c) => c.rol);
    return [...new Set(roles)].sort();
  }, [colaboradores]);

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
    const nombreCompleto = `${colaborador.nombre} ${colaborador.apellido_paterno} ${colaborador.apellido_materno || ""}`.toLowerCase();
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
          <div className="tabla__panel-filtros" onClick={(e) => e.stopPropagation()}>
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
              opciones={["Activo", "Inactivo"]}
              seleccionados={estadosSeleccionados}
              setSeleccionados={setEstadosSeleccionados}
            />

            {/* Filtro por sede */}
            <FiltroTabla
              titulo="Sede"
              opciones={sedesDisponibles.map(getSedeNombre)}
              seleccionados={sedesSeleccionadas}
              setSeleccionados={setSedesSeleccionadas}
            />

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
        />
      </div>
    </div>
  );
}
