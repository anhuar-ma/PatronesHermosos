import {useMemo, useState, useRef, useEffect } from "react";
import useGrupos from "../hooks/useGrupos"; // Hook personalizado para obtener datos de grupos
import { SlidersHorizontal } from "lucide-react"; // Ícono para el botón de filtros
import Tabla from "./TablaGruposListado"; // Componente de tabla donde se renderizan los grupos
import LoadingCard from "./LoadingCard"; // Componente de carga y errores
import FiltroTabla from "./FiltroTabla"; // Componente para filtros avanzados
import { Link } from "react-router-dom";
import useCurrentRol from "../hooks/useCurrentRol";

/**
 * Componente que muestra un listado de Grupos con:
 * - Búsqueda por nombre
 * - Ordenamiento por campos
 * - Filtros avanzados (rol, estado, sede)
 *
 * @component
 */
export default function TablaGrupos() {
  // Obtiene datos, estado de carga y posibles errores
  const { grupos, loading, error } = useGrupos();

  // 1. Copia local para poder mutar el estado en cliente
   const [gruposList, setGruposList] = useState([]);
   useEffect(() => {
    setGruposList(grupos);
   }, [grupos]);

//   const [grupos, setGruposList] = useState(dummyGrupos);

  // Estado para el texto de búsqueda
  const [busqueda, setBusqueda] = useState("");

  // Referencia al contenedor de la tabla (útil para scroll, etc.)
  const containerRef = useRef(null);

  // Estado de ordenamiento: campo y dirección ("asc" | "desc")
  const [sortField, setSortField] = useState(null);
  const [sortOrder, setSortOrder] = useState("asc");

  // Control de visibilidad del panel de filtros
  const [mostrarFiltros, setMostrarFiltros] = useState(false);

  // Filtros seleccionados: idiomas, estados y sedes
  const [idiomasSeleccionados, setIdiomasSeleccionados] = useState([]);
  const [nivelesSeleccionados, setNivelesSeleccionados] = useState([]);
  const [cupoSeleccionados, setCupoSeleccionados] = useState([]);
  const [mentoraSeleccionadas, setMentoraSeleccionadas] = useState([]);
  const [instructoraSeleccionadas, setInstructoraSeleccionadas] = useState([]);
  const [sedeSeleccionada, setSedeSeleccionada] = useState([]);
  const { rol } = useCurrentRol();

    const sedesDisponibles = useMemo(() => {
      const sedes = grupos.map((p) => p.nombre_sede);
      return [...new Set(sedes)].sort();
    }, [grupos]);


  /**
   * Función para ordenar un array de grupos según el campo y el orden seleccionado.
   *
   * @param {Array} data - Array de grupos a ordenar.
   * @returns {Array} - Nuevo array ordenado.
   */
  const ordenarGrupos = (data) => {
    if (!sortField) return data; // Si no hay campo, devolver sin ordenar

    return [...data].sort((a, b) => {
      if (sortField === "id_grupo") {
        // Ordenamiento numérico
        return sortOrder === "asc"
          ? a.id_grupo - b.id_grupo
          : b.id_grupo - a.id_grupo;
      }
      // Ordenamiento lexicográfico para otros campos
      const aValue = a[sortField]?.toString().toLowerCase();
      const bValue = b[sortField]?.toString().toLowerCase();

      if (aValue < bValue) return sortOrder === "asc" ? -1 : 1;
      if (aValue > bValue) return sortOrder === "asc" ? 1 : -1;
      return 0;
    });
  };

  /**
   * Filtrado combinado:
   * - Coincidencia de idioma (si hay idiomas seleccionados)
   * - Coincidencia de nivel (si hay niveles seleccionados)
   */
  const gruposFiltrados = grupos.filter(grupo => {
    const coincideIdioma =
      idiomasSeleccionados.length === 0 ||
      idiomasSeleccionados.includes(grupo.idioma);
    const coincideNivel =
      nivelesSeleccionados.length === 0 ||
      nivelesSeleccionados.includes(grupo.nivel);
  
    // → Nuevo filtro de cupo
    const estadoCupo = grupo.cupo > 0 ? "Disponible" : "Lleno";
    const coincideCupo =
      cupoSeleccionados.length === 0 ||
      cupoSeleccionados.includes(estadoCupo);

      // Filtro de mentora
  const estadoMentora =
    grupo.nombre_mentora && grupo.nombre_mentora.trim() !== ""
      ? "Asignada"
      : "No asignada";
  const coincideMentora =
    mentoraSeleccionadas.length === 0 ||
    mentoraSeleccionadas.includes(estadoMentora);

  


  // Filtro de instructora
  const estadoInstructora =
    grupo.nombre_instructora && grupo.nombre_instructora.trim() !== ""
      ? "Asignada"
      : "No asignada";
  const coincideInstructora =
    instructoraSeleccionadas.length === 0 ||
    instructoraSeleccionadas.includes(estadoInstructora);

    const coincideSede =
      sedeSeleccionada.length === 0 ||
      sedeSeleccionada.includes(grupo.nombre_sede);

//       const estadoMentora =
//     grupo.mentora.nombre === "***no asignada***"
//       ? "No asignada"
//       : "Asignada";

//   const coincideMentora =
//     mentoraSeleccionadas.length === 0 ||
//     mentoraSeleccionadas.includes(estadoMentora);

//     const estadoInstructora =
//     grupo.instructora.nombre === "***no asignada***"
//       ? "No asignada"
//       : "Asignada";

//   const coincideInstructora =
//     instructoraSeleccionadas.length === 0 ||
//     instructoraSeleccionadas.includes(estadoInstructora);

    return (
      coincideIdioma &&
    coincideNivel &&
    coincideCupo &&
    coincideMentora &&
    coincideInstructora &&
    coincideSede
    //   &&
    //   coincideMentora &&
    //   coincideInstructora
    );
  
  });

  // Aplica ordenamiento sobre los filtrados
  const gruposOrdenados = ordenarGrupos(gruposFiltrados);

  // Si está cargando, mostramos indicador
  if (loading) return <LoadingCard mensaje="Cargando grupos..." />;

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
    <div className="tabla__containerBlancoMentora">
      {/* Encabezado y búsqueda */}
      <div className="tabla__container__tituloBusqueda">
        <h2 className="tabla__titulo">Listado de grupos</h2>
        <div className="tabla__contenedor_busquedaFiltros">
          <button
            className="tabla__botonFiltros"
            onClick={() => setMostrarFiltros(true)}
          >
            Filtrar <SlidersHorizontal size={16} />
          </button>
          {/* <input
            type="text"
            placeholder="Buscar nombre de mentora/instructora..."
            value={busqueda}
            onChange={(e) => {
              setBusqueda(e.target.value);
            }}
            className="tabla__input-busqueda"
          /> */}
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

            {/* Filtro por idioma */}
            <FiltroTabla
              titulo="Idioma de grupo"
              // opciones={idiomasDisponibles}
              opciones={["Inglés", "Español"]}
              seleccionados={idiomasSeleccionados}
              setSeleccionados={setIdiomasSeleccionados}
            />

            {/* Filtro por nivel */}
            <FiltroTabla
              titulo="Nivel de grupo"
              opciones={["Básico", "Avanzado"]}
              seleccionados={nivelesSeleccionados}
              setSeleccionados={setNivelesSeleccionados}
            />
            {/* Filtro por nivel */}
            <FiltroTabla
              titulo="Estado de cupo"
              opciones={["Disponible", "Lleno"]}
              seleccionados={cupoSeleccionados}
              setSeleccionados={setCupoSeleccionados}
            />
            {/* Filtro por mentora */}
            <FiltroTabla
              titulo="Mentora"
              opciones={["Asignada", "No asignada"]}
              seleccionados={mentoraSeleccionadas}
              setSeleccionados={setMentoraSeleccionadas}
            />
            {/* Filtro por instructora */}
            <FiltroTabla
              titulo="Instructora"
              opciones={["Asignada", "No asignada"]}
              seleccionados={instructoraSeleccionadas}
              setSeleccionados={setInstructoraSeleccionadas}
            />

            {rol === 0 && (
                          <FiltroTabla
                            titulo="Sede"
                            opciones={sedesDisponibles}
                            seleccionados={sedeSeleccionada}
                            setSeleccionados={setSedeSeleccionada}
                          />
                        )}

            {/* Botón para limpiar todos los filtros */}
            <button
              className="tabla_boton-limpiar-filtros"
              onClick={() => {
                setBusqueda("");
                setIdiomasSeleccionados([]);
                setNivelesSeleccionados([]);
                setCupoSeleccionados([]);
                setMentoraSeleccionadas([]);
                setInstructoraSeleccionadas([]);
                setMostrarFiltros(false);
              }}
            >
              Limpiar todos los filtros
            </button>
          </div>
        </div>
      )}

      {/* Renderizado de la tabla con datos filtrados y ordenados */}
      <div className="table_containerMentora" ref={containerRef}>
        <Tabla
          grupos={gruposOrdenados}
          onSort={handleSort}
          sortField={sortField}
          sortOrder={sortOrder}
        />
      </div>
      {rol === 1 && (
        <Link to="/admin/registro-grupos" className="btn-agregar">
          Agregar grupo
        </Link>
      )}
    </div>
  );
}