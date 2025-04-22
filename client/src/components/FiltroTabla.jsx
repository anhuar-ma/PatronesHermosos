import { useState } from "react";

export default function FiltroTabla({ titulo, opciones, seleccionados, setSeleccionados }) {
  const [abierto, setAbierto] = useState(true);

  const toggleOpcion = (valor) => {
    if (seleccionados.includes(valor)) {
      setSeleccionados(seleccionados.filter((v) => v !== valor));
    } else {
      setSeleccionados([...seleccionados, valor]);
    }
  };

  return (
    <div className="filtro-acordeon">
      <div className="filtro-header" onClick={() => setAbierto(!abierto)}>
        <span>{titulo} {seleccionados.length > 0 && `(${seleccionados.length})`}</span>
        <span>{abierto ? "▲" : "▼"}</span>
      </div>

      {abierto && (
        <div className="filtro-opciones">
          {opciones.map((opcion) => (
            <label key={opcion} className="filtro-checkbox">
              <input
                type="checkbox"
                checked={seleccionados.includes(opcion)}
                onChange={() => toggleOpcion(opcion)}
              />
              <span>{opcion}</span>
            </label>
          ))}
        </div>
      )}
    </div>
  );
}
