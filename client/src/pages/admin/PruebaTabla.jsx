import { useState, useEffect } from "react";
import axios from "axios";
import "../../styles/Tabla.css"; // Asegúrate de tener los estilos agregados
import tablaColaboradores from '../../ListadoColaboradores.jsx';

export default function ListadoColaboradores() {
  const [colaboradores, setColaboradores] = useState([]);
  // const [currentPage, setCurrentPage] = useState(1);
  // const itemsPerPage = 8;

  useEffect(() => {
    const datosEjemplo = [
      {
        id_colaborador: 1,
        nombre: "Ana",
        apellido_paterno: "Gómez",
        apellido_materno: "López",
        correo: "ana.gomez@example.com",
        universidad: "ITESM Puebla",
        rol: "Coordinador",
        id_sede: 1,
        estado: "Activo",
      },
      {
        id_colaborador: 2,
        nombre: "Luis",
        apellido_paterno: "Martínez",
        apellido_materno: "Ramos",
        correo: "luis.martinez@example.com",
        universidad: "ITESM Monterrey",
        rol: "Asistente",
        id_sede: 2,
        estado: "Inactivo",
      },
      {
        id_colaborador: 3,
        nombre: "Sofía",
        apellido_paterno: "Hernández",
        apellido_materno: "Cruz",
        correo: "sofia.hernandez@example.com",
        universidad: "UNAM",
        rol: "Mentor",
        id_sede: 3,
        estado: "Activo",
      },
      {
        id_colaborador: 4,
        nombre: "Carlos",
        apellido_paterno: "Ramírez",
        apellido_materno: "Díaz",
        correo: "carlos.ramirez@example.com",
        universidad: "IPN",
        rol: "Asistente",
        id_sede: 4,
        estado: "Activo",
      },
      {
        id_colaborador: 5,
        nombre: "Elena",
        apellido_paterno: "Torres",
        apellido_materno: "Moreno",
        correo: "elena.torres@example.com",
        universidad: "UANL",
        rol: "Coordinador",
        id_sede: 2,
        estado: "Inactivo",
      },{
        id_colaborador: 6,
        nombre: "Ana",
        apellido_paterno: "Gómez",
        apellido_materno: "López",
        correo: "ana.gomez@example.com",
        universidad: "ITESM Puebla",
        rol: "Coordinador",
        id_sede: 1,
        estado: "Activo",
      },
      {
        id_colaborador: 7,
        nombre: "Luis",
        apellido_paterno: "Martínez",
        apellido_materno: "Ramos",
        correo: "luis.martinez@example.com",
        universidad: "ITESM Monterrey",
        rol: "Asistente",
        id_sede: 2,
        estado: "Inactivo",
      },
      {
        id_colaborador: 8,
        nombre: "Sofía",
        apellido_paterno: "Hernández",
        apellido_materno: "Cruz",
        correo: "sofia.hernandez@example.com",
        universidad: "UNAM",
        rol: "Mentor",
        id_sede: 3,
        estado: "Activo",
      },
      {
        id_colaborador: 9,
        nombre: "Carlos",
        apellido_paterno: "Ramírez",
        apellido_materno: "Díaz",
        correo: "carlos.ramirez@example.com",
        universidad: "IPN",
        rol: "Asistente",
        id_sede: 4,
        estado: "Activo",
      },
      {
        id_colaborador: 10,
        nombre: "Elena",
        apellido_paterno: "Torres",
        apellido_materno: "Moreno",
        correo: "elena.torres@example.com",
        universidad: "UANL",
        rol: "Coordinador",
        id_sede: 2,
        estado: "Inactivo",
      },
      {
        id_colaborador: 11,
        nombre: "Carlos",
        apellido_paterno: "Ramírez",
        apellido_materno: "Díaz",
        correo: "carlos.ramirez@example.com",
        universidad: "IPN",
        rol: "Asistente",
        id_sede: 4,
        estado: "Activo",
      },
      {
        id_colaborador: 12,
        nombre: "Elena",
        apellido_paterno: "Torres",
        apellido_materno: "Moreno",
        correo: "elena.torres@example.com",
        universidad: "UANL",
        rol: "Coordinador",
        id_sede: 2,
        estado: "Inactivo",
      },
    ];
    setColaboradores(datosEjemplo);
  }, []);

  const getSedeNombre = (id_sede) => {
    const sedes = {
      1: "ITESM Puebla",
      2: "ITESM Monterrey",
      3: "UNAM",
      4: "IPN",
    };
    return sedes[id_sede] || `Sede ${id_sede}`;
  };

  // const totalPages = Math.ceil(colaboradores.length / itemsPerPage);
  // const paginatedColaboradores = colaboradores.slice(
  //   (currentPage - 1) * itemsPerPage,
  //   currentPage * itemsPerPage
  // );

  return (
    <div className="fondo_tablas_admin">
      <div className="container">
        <h2 className="titulo_tabla">Listado de Colaboradores</h2>

        <tablaColaboradores />

        {/* {colaboradores.length === 0 ? (
          <p>No hay colaboradores registrados.</p>
        ) : (
          <>
            <div className="table_container">
              <table className="colaboradores-table">
                <thead>
                  <tr>
                    <th>Nombre</th>
                    <th>Rol</th>
                    <th>Universidad</th>
                    <th>Sede</th>
                    <th>Ver Detalles</th>
                    <th>Estado</th>
                  </tr>
                </thead>
                <tbody>
                  {paginatedColaboradores.map((colaborador) => (
                    <tr key={colaborador.id_colaborador}>
                      <td data-label="Nombre">{`${colaborador.nombre} ${colaborador.apellido_paterno} ${colaborador.apellido_materno}`}</td>
                      <td data-label="Rol">{colaborador.rol}</td>
                      <td data-label="Universidad">{colaborador.universidad}</td>
                      <td data-label="Sede">{getSedeNombre(colaborador.id_sede)}</td>
                      <td data-label="Ver Detalles">
                        <button
                          className="btn-detalles"
                          onClick={() =>
                            alert(`Detalles de: ${colaborador.nombre}`)
                          }
                        >
                          Ver
                        </button>
                      </td>
                      <td data-label="Estado">{colaborador.estado}</td>
                      
                    </tr>
                  ))}
                </tbody>
              </table>
            </div> */}

            {/* Paginación */}
            {/* <div className="paginacion">
              {Array.from({ length: totalPages }, (_, index) => (
                <button
                  key={index + 1}
                  onClick={() => setCurrentPage(index + 1)}
                  className={`pagina-btn ${
                    currentPage === index + 1 ? "activa" : ""
                  }`}
                >
                  {index + 1}
                </button>
              ))}
            </div> */}
          {/* </> */}
        {/* )} */}
      </div>
    </div>
  );
}