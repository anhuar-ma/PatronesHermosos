import TablaColaboradores from "../../components/TablaColaboradores";
import "../../styles/Tabla.css"; // Asegúrate de tener los estilos agregados

export default function ViewColaboradores() {
  return (
    <div className="fondo_tablas_admin">
      <div className="container container_tablas">
        <TablaColaboradores />
      </div>
    </div>
  );
}
