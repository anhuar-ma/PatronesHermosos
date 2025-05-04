import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";

const DetalleParticipante = () => {
  const { id } = useParams();
  const [participante, setParticipante] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetch(`http://localhost:8000/api/participantes/parents/${id}`)
      .then((res) => {
        if (!res.ok) throw new Error("Participante no encontrado");
        return res.json();
      })
      .then((data) => setParticipante(data))
      .catch((err) => setError(err.message));
  }, [id]);

  if (error) return <p>{error}</p>;
  if (!participante) return <p>Cargando...</p>;

  return (
    <div>
      <h1>Detalles del Participante</h1>
      <p><strong>Nombre:</strong> {participante.nombre} {participante.apellido_paterno} {participante.apellido_materno}</p>
      <p><strong>Tutor:</strong> {participante.nombre_tutor} {participante.apellido_paterno_tutor} {participante.apellido_materno_tutor}</p>
      <p><strong>Teléfono del tutor:</strong> {participante.telefono_tutor}</p>
      <p><strong>ID Grupo:</strong> {participante.id_grupo}</p>
      <p><strong>Estado:</strong> {participante.estado}</p>
    </div>
  );
};

export default DetalleParticipante;
