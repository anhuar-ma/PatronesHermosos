import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import axios from "axios";
import LoadingCard from "../../components/LoadingCard";

export default function DetalleParticipante() {
  const { id } = useParams();
  const [participante, setParticipante] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    axios
      .get(`/api/participantes/parents/${id}`)
      .then((res) => {
        setParticipante(res.data);
        setLoading(false);
      })
      .catch((err) => {
        setError(err.response?.data?.message || err.message);
        setLoading(false);
      });
  }, [id]);

  if (loading) return <LoadingCard mensaje="Cargando participante..." />;
  if (error)   return <LoadingCard mensaje={error} />;

  return (
    <div className="detalle-participante">
      <h2>Detalle de {participante.nombre} {participante.apellido_paterno}</h2>
      <ul>
        <li><strong>Nombre completo:</strong> {participante.nombre} {participante.apellido_paterno} {participante.apellido_materno}</li>
        <li><strong>Tutor:</strong> {participante.nombre_tutor} {participante.apellido_paterno_tutor}</li>
        <li><strong>Teléfono:</strong> {participante.telefono_tutor}</li>
        <li><strong>Grupo:</strong> {participante.id_grupo}</li>
        <li><strong>Estado:</strong> {participante.estado}</li>
      </ul>
    </div>
  );
}
