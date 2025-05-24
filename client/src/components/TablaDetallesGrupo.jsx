import { useState, useRef, useEffect } from "react";
import useGrupoListado from "../hooks/useGrupoListado"; // Hook para obtener datos de grupos
import useGrupoDetalles from "../hooks/useGruposDetalles";
import useGrupoMentora from "../hooks/useGrupoMentora"; // Hook para obtener datos de mentoras
import { SlidersHorizontal } from "lucide-react"; // Ícono para el botón de filtros
import Tabla from "./TablaDetallesGrupoListado"; // Componente de tabla donde se renderizan los grupos
import LoadingCard from "./LoadingCard"; // Componente de carga y errores
import FiltroTabla from "./FiltroTabla"; // Componente para filtros avanzados
import useEliminarIntegrante from "../hooks/useEliminarIntegrante"; // Hook para eliminar integrantes
import { Link, useParams } from "react-router-dom"; // Hook para obtener parámetros de la URL

export default function TablaDetallesGrupos() {
  const { id } = useParams(); // Obtiene el ID del grupo desde la URL
  const { listado: grupos, loading, error } = useGrupoListado(id); // Usa el hook para obtener los datos
  const { detalles, loading: loadingDetalles, error: errorDetalles } = useGrupoDetalles(id); // Hook para obtener detalles del grupo
  const { mentora, loading: loadingMentora, error: errorMentora } = useGrupoMentora(id); // Hook para obtener mentoras



  // Copia local para poder mutar el estado en cliente
  const [gruposList, setGruposList] = useState([]);
  useEffect(() => {
    setGruposList(grupos || []); // Asegúrate de que sea un array
  }, [grupos]);

  // Extrae los detalles del grupo
  const { idioma = "N/A", nivel = "N/A"} = detalles || {};
  //Extrae la mentora
  const nombreMentora = mentora ? mentora.nombre_completo : "Sin mentora asignada";

  // Estado para el texto de búsqueda
  const [busqueda, setBusqueda] = useState("");

  // Referencia al contenedor de la tabla (útil para scroll, etc.)
  const containerRef = useRef(null);

  // Estado de ordenamiento: campo y dirección ("asc" | "desc")
  const [sortField, setSortField] = useState(null);
  const [sortOrder, setSortOrder] = useState("asc");

  // Control de visibilidad del panel de filtros
  const [mostrarFiltros, setMostrarFiltros] = useState(false);

  // Filtros seleccionados: idiomas, niveles, cupo, mentora, instructora
  const [idiomasSeleccionados, setIdiomasSeleccionados] = useState([]);
  const [nivelesSeleccionados, setNivelesSeleccionados] = useState([]);
  const [cupoSeleccionados, setCupoSeleccionados] = useState([]);
  const [mentoraSeleccionadas, setMentoraSeleccionadas] = useState([]);
  const [instructoraSeleccionadas, setInstructoraSeleccionadas] = useState([]);
  const { eliminarIntegrante, loading: loadingEliminar, error: errorEliminar } = useEliminarIntegrante(); // Usa el hook

  // Función para ordenar un array de grupos según el campo y el orden seleccionado
  const ordenarGrupos = (data) => {
    if (!sortField) return data; // Si no hay campo, devolver sin ordenar

    return [...data].sort((a, b) => {
      const aValue = a[sortField]?.toString().toLowerCase();
      const bValue = b[sortField]?.toString().toLowerCase();

      if (aValue < bValue) return sortOrder === "asc" ? -1 : 1;
      if (aValue > bValue) return sortOrder === "asc" ? 1 : -1;
      return 0;
    });
  };

  // Filtrado combinado
  const gruposFiltrados = gruposList.filter((grupo) => {
    const coincideIdioma =
      idiomasSeleccionados.length === 0 ||
      idiomasSeleccionados.includes(grupo.idioma);
    const coincideNivel =
      nivelesSeleccionados.length === 0 ||
      nivelesSeleccionados.includes(grupo.nivel);

    const estadoCupo = grupo.cupo > 0 ? "Disponible" : "Lleno";
    const coincideCupo =
      cupoSeleccionados.length === 0 ||
      cupoSeleccionados.includes(estadoCupo);

    return coincideIdioma && coincideNivel && coincideCupo;
  });

  // Aplica ordenamiento sobre los filtrados
  const gruposOrdenados = ordenarGrupos(gruposFiltrados);

  // Si está cargando, mostramos indicador
  if (loading) return <LoadingCard mensaje="Cargando grupos..." />;

  // Si hay error, lo mostramos
  if (error) return <LoadingCard mensaje={error} />;

  // Manejador de clic en encabezados para ordenar
  const handleSort = (field) => {
    if (sortField === field) {
      setSortOrder((prev) => (prev === "asc" ? "desc" : "asc"));
    } else {
      setSortField(field);
      setSortOrder("asc");
    }
  };

  //Manejo de eliminaciones en vista detallada
    const handleDelete = async (idIntegrante, rol) => {
      const result = await eliminarIntegrante(id, idIntegrante, rol);
      if (result.success) {
        // Actualizar la lista local después de eliminar
        setGruposList((prev) => prev.filter((grupo) => grupo.id !== idIntegrante));
        alert(result.message);
      } else {
        alert(result.message);
      }
    };

  console.log("Mentora:", mentora);
  return (
    <div className="tabla__containerBlancoMentora">
      {/* Encabezado y búsqueda */}
      <div className="tabla__container__tituloBusquedaGrupos">
        <h2 className="tabla__titulo">Grupo {id}</h2>
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
       <div className="info__grupo">
          <p className="info__grupo__item"><span className="info__grupo__label">Idioma: </span>{idioma}</p>
          <p className="info__grupo__item"><span className="info__grupo__label">Nivel: </span>{nivel}</p>
          <p className="info__grupo__item"><span className="info__grupo__label">Mentora: </span>{nombreMentora}</p>
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

            {/* Filtro por estado de cupo */}
            <FiltroTabla
              titulo="Estado de cupo"
              opciones={["Disponible", "Lleno"]}
              seleccionados={cupoSeleccionados}
              setSeleccionados={setCupoSeleccionados}
            />

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
          onDelete={handleDelete}
        />
      </div>
       <div className="tabla__container__botones">
        <button className="btn-agregarPersonaGrupo">
          Agregar personal
        </button>
        
        <button
          className={mentora ? "btn-eliminarMentora" : "btn-agregarPersonaGrupo"}
          onClick={() => {
            if (mentora) {
              // Acción para eliminar mentora
              // handleDelete(mentora.id, "mentora");
            } else {
              // Acción para asignar mentora
              // openAsignarMentoraModal();
            }
          }}
        >
          {mentora ? "Eliminar mentora" : "Asignar mentora"}
        </button>
        <button className="btn-agregarPersonaGrupo">
          Agregar alumna
        </button>
      </div>
    </div>
  );
}