import { useState, useRef, useEffect } from "react";
import useGrupoListado from "../hooks/useGrupoListado"; // Hook para obtener datos de grupos
import useGrupoDetalles from "../hooks/useGruposDetalles";
import useGrupoMentora from "../hooks/useGrupoMentora"; // Hook para obtener datos de mentoras
import { SlidersHorizontal } from "lucide-react"; // Ícono para el botón de filtros
import Tabla from "./TablaDetallesGrupoListado"; // Componente de tabla donde se renderizan los grupos
import LoadingCard from "./LoadingCard"; // Componente de carga y errores
import FiltroTabla from "./FiltroTabla"; // Componente para filtros avanzados
import useEliminarIntegrante from "../hooks/useEliminarIntegrante"; // Hook para eliminar integrantes
import AgregarColaborador from "./AgregarColaboradores"; // Importar el componente del pop-up
import AgregarParticipantes from "./AgregarParticipantes";
import AgregarMentoras from "./AgregarMentora";
import { Link, useParams } from "react-router-dom"; // Hook para obtener parámetros de la URL
import useColaboradores from "../hooks/useAddColaboradores"; // Hook para obtener colaboradores
import useParticipantes from "../hooks/useAddParticipantes";
import useMentoras from "../hooks/useAddMentora"; // Hook para obtener mentoras
import axios from "axios";
import { useNavigate } from "react-router-dom"; // Hook para navegación

export default function TablaDetallesGrupos() {
  const navigate = useNavigate(); // Hook para navegación
  const { id } = useParams(); // Obtiene el ID del grupo desde la URL
  const { listado: grupos, loading, error } = useGrupoListado(id); // Usa el hook para obtener los datos
  const { detalles, loading: loadingDetalles, error: errorDetalles } = useGrupoDetalles(id); // Hook para obtener detalles del grupo
  const { mentora, loading: loadingMentora, error: errorMentora } = useGrupoMentora(id); // Hook para obtener mentoras
  // Hook para obtener colaboradores disponibles
  const {
    colaboradores,
    colaboradoresLoading,
    colaboradoresError,
    fetchColaboradores,
    assignColaborador,
  } = useColaboradores(id);
  //Hook para obtener participantes disponibles
  const {
    participantes,
    participantesLoading,
    participantesError,
    fetchParticipantes,
    assignParticipante,
  } = useParticipantes(id);
  // Hook para obtener mentoras disponibles
  const {
    mentoras,
    mentorasLoading,
    mentorasError,
    fetchMentoras,
    assignMentora,
  } = useMentoras(id);

  //Hook para mantener el pop-up abierto
  const [isColaboradorPopupOpen, setIsColaboradorPopupOpen] = useState(false); // Estado para el pop-up de colaboradores
  const [isParticipantePopupOpen, setIsParticipantePopupOpen] = useState(false); // Estado para el pop-up de participantes
  const [isMentoraPopupOpen, setIsMentoraPopupOpen] = useState(false); // Estado para el pop-up de mentoras

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

  // Filtros seleccionados:  cupo, mentora, instructora
  const [cupoSeleccionados, setCupoSeleccionados] = useState([]);
  const [mentoraSeleccionadas, setMentoraSeleccionadas] = useState([]);
  const [rolesSeleccionados, setRolesSeleccionados] = useState([]); // Filtro por rol
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

     const nombreCompleto = grupo.nombre_completo.toLowerCase();
    const coincideBusqueda = nombreCompleto.includes(busqueda.toLowerCase());

    const coincideRol =
      rolesSeleccionados.length === 0 ||
      rolesSeleccionados.includes(grupo.rol);

    return coincideRol && coincideBusqueda;
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
        setGruposList((prev) => prev.filter((grupo) => grupo.id_integrante !== idIntegrante));
        alert(result.message);
      } else {
        alert(result.message);
      }
    };

      // Función para refrescar la tabla de grupos
  const fetchGrupos = async () => {
    try {
      const response = await axios.get(`/api/grupos/${id}/listado`);
      setGruposList(response.data.data); // Actualiza la lista de grupos
    } catch (error) {
      console.error("Error al refrescar los grupos:", error);
    }
  };


      // Función para refrescar la informacion de las mentoras
  const actualizacionMentoras = async () => {
    try {
      const response = await axios.get(`/api/grupos/${id}/mentoras`);
      setMentoraSeleccionadas(response.data.data); // Actualiza la lista de mentoras
    } catch (error) {
      console.error("Error al refrescar las mentoras:", error);
    }
  }

  const handleDeleteMentora = async (idMentora) => {
    if (!idMentora) {
      alert("No se pudo obtener el ID de la mentora.");
      return;
    }
  
    try {
      const response = await axios.delete(`/api/grupos/${id}/mentoras/${idMentora}`);
      if (response.data.success) {
        alert(response.data.message);
        setMentoraSeleccionadas([]); // Limpia la mentora seleccionada
        window.location.reload(); // Recarga la página para reflejar los cambios
      } else {
        alert(response.data.message);
      }
    } catch (error) {
      console.error("Error al eliminar la mentora:", error);
      alert("Ocurrió un error al intentar eliminar la mentora.");
    }
  };

  const handleDeleteGrupo = async () => {
    try {
      const response = await axios.delete(`/api/grupos/${id}`);
      if (response.data.success) {
        alert(response.data.message);
        // Redirige al usuario a otra página después de eliminar el grupo
        navigate("/admin/grupos"); // Cambia la ruta según tu aplicación
      } else {
        alert(response.data.message);
      }
    } catch (error) {
      console.error("Error al eliminar el grupo:", error);
      alert("Ocurrió un error al intentar eliminar el grupo.");
    }
  };


  return (
    <div className="tabla__containerBlancoMentora tabla__containerDetallesGrupo">
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
          <p className="info__grupo__item">
            <span className="info__grupo__label">Mentora: </span>
            {mentora && mentora.length > 0
              ? mentora.map((m) => m.nombre_completo).join(", ")
              : "Sin mentoras asignadas"}
          </p>
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
              titulo="Rol"
              opciones={["Staff", "Instructora", "Facilitadora","Participante"]}
              seleccionados={rolesSeleccionados}
              setSeleccionados={setRolesSeleccionados}
            />

            {/* Botón para limpiar todos los filtros */}
            <button
              className="tabla_boton-limpiar-filtros"
              onClick={() => {
                setBusqueda("");
                setRolesSeleccionados([]);
                setMostrarFiltros(false);
              }}
            >
              Limpiar todos los filtros
            </button>
          </div>
        </div>
      )}

      {/* Renderizado de la tabla con datos filtrados y ordenados */}
      <div className="table_containerMentora table__grupoos" ref={containerRef}>
        <Tabla
          grupos={gruposOrdenados}
          onSort={handleSort}
          sortField={sortField}
          sortOrder={sortOrder}
          onDelete={handleDelete}
        />
      </div>
       <div className="tabla__container__botones">
       <button
          className="btn-agregarPersonaGrupo"
          onClick={() => {
            fetchColaboradores(); // Cargar colaboradores disponibles
            setIsColaboradorPopupOpen(true); // Abrir el pop-up
          }}
        >
          {colaboradoresLoading ? "Cargando colaboradores..." : "Agregar colaborador"}
        </button>

        {/* Pop-up de selección de colaborador */}
        {isColaboradorPopupOpen && (
          <AgregarColaborador
            onClose={() => setIsColaboradorPopupOpen(false)} // Cerrar el pop-up
            onConfirm={(idColaborador) => {
              assignColaborador(idColaborador, fetchGrupos); // Asignar colaborador y refrescar grupos
              setIsColaboradorPopupOpen(false); // Cerrar el pop-up
            }}
            // Reemplaza la propiedad "colaboradores" en el pop-up de AgregarColaborador por el siguiente:
            colaboradores={
              gruposList.some((grupo) => grupo.rol === "Instructora")
                ? colaboradores.filter((colaborador) =>
                    ["Facilitadora", "Staff"].includes(colaborador.rol)
                  )
                : colaboradores.filter((colaborador) =>
                  ["Instructora", "Facilitadora", "Staff"].includes(colaborador.rol)
                )
            }// Filtrar instructoras si ya hay una asignada
            colaboradoresLoading={colaboradoresLoading}
            colaboradoresError={colaboradoresError}
          />
        )}
        <button
          className="btn-agregarPersonaGrupo"
          onClick={() => {
            fetchParticipantes();
            setIsParticipantePopupOpen(true);
          }}
          disabled={participantesLoading}
        >
          {participantesLoading ? "Cargando participantes..." : "Agregar participante"}
        </button>
        
        <button
          className={mentora.length > 0 ? "btn-eliminarMentora" : "btn-agregarPersonaGrupo"}
          onClick={async () => {
            if (mentora.length > 0) {
              const confirmacion = window.confirm(
                "¿Estás seguro de que deseas eliminar a la mentora?"
              );
              if (confirmacion) {
                console.log("Eliminando mentora con ID:", mentora[0]?.id_mentora);
                await handleDeleteMentora(mentora[0]?.id_mentora); // Accede al primer elemento del arreglo
              }
            } else {
              fetchMentoras(); // Cargar mentoras disponibles
              setIsMentoraPopupOpen(true); // Abrir el pop-up de mentoras
            }}
        }
        >
            {mentorasLoading ? "Cargando mentoras" : mentora.length > 0? "Eliminar mentora": "Asignar mentora"}
        </button>
        {/* Pop-up de selección de mentora */}
        {isMentoraPopupOpen && (
          <AgregarMentoras
            onClose={() => setIsMentoraPopupOpen(false)} // Cerrar el pop-up
            onConfirm={async(idMentora) => {
              await assignMentora(idMentora, actualizacionMentoras); // Asignar mentora y refrescar la tabla
              setIsMentoraPopupOpen(false); // Cerrar el pop-up
              window.location.reload(); // Recargar toda la página
            }}
            mentoras={mentoras}
            mentorasLoading={mentorasLoading}
            mentorasError={mentorasError}
          />
        )}

        

        {/* Pop-up de selección de participante */}
      {isParticipantePopupOpen && (
        <AgregarParticipantes
          onClose={() => setIsParticipantePopupOpen(false)} // Cerrar el pop-up
          onConfirm={(id_participante) => {
            assignParticipante(id_participante, fetchGrupos); // Asignar colaborador y refrescar grupos
            setIsParticipantePopupOpen(false); // Cerrar el pop-up
          }}
          participantes={participantes}
          participantesLoading={participantesLoading}
          participantesError={participantesError}
        />
      )}

        <button
          className="btn-eliminarMentora"
          onClick={async () => {
            const confirmacion = window.confirm(
              "¿Estás seguro de que deseas eliminar este grupo y sus asignaciones?"
            );
            if (confirmacion) {
              await handleDeleteGrupo(); // Llama a la función para eliminar el grupo
            }
          }}
        >
          Eliminar grupo
        </button>
      </div>
    </div>
  );
}