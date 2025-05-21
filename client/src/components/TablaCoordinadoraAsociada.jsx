import React, { useState } from "react";

const TablaAsignacionMentora = () => {
  // Si ya tienes la mentora en props o contexto, reemplaza este useState
  const [mentora, setMentora] = useState(null);

  const handleAsignar = () => {
    // aquí llamas a tu API o abres un modal para seleccionar mentora
    // por ejemplo, simulamos una asignación:
    setMentora({ nombre: "Juana Pérez", id: 123 });
  };

  const handleEliminar = () => {
    // aquí llamas a tu API para desasignar
    setMentora(null);
  };

  return (
    <div className="adminDashboard__tableSection">
      <h2>Coordinadora asociada</h2>
      <table className="adminDashboard__coodinadoraAsociacionTable">
        <thead>
          <tr>
            <th>Nombre</th>
            <th>Correo</th>
            <th>Eliminar/asignar mentora</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>{mentora ? mentora.nombre : "— Ninguna asignada —"}</td>
            <td>{mentora ? mentora.correo : "— Ninguna asignada —"}</td>
            <td>
              {mentora ? (
                <button
                  className="btn_eliminarCoordinadora"
                  onClick={handleEliminar}
                >
                  Eliminar mentora
                </button>
              ) : (
                <button
                  className="btn-agregarCoordinadora"
                  onClick={handleAsignar}
                >
                  Asignar mentora
                </button>
              )}
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  );
};

export default TablaAsignacionMentora;
