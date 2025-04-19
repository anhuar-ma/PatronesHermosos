export const getSedeNombre = (id_sede) => {
    const sedes = {
      1: "ITESM Puebla",
      2: "ITESM Monterrey",
    };
    return sedes[id_sede] || `Sede ${id_sede}`;
  };
  