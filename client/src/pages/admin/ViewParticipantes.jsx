import TablaParticipantes from "../../components/TablaParticipantes";
import "../../styles/Tabla.css"; // Asegúrate de tener los estilos agregados

export default function ViewParticipantes() {
  return (
    <div className="fondo_tablas_admin">
        <TablaParticipantes />
    </div>
  );
}
