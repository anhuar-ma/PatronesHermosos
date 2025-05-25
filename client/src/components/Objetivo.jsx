export default function Objetivo({ imagen, alt, descripcion }) {
  return (
    <div className="objetivo">
      <img src={imagen} alt={alt} className="objetivo__imagen" />
      <p className="objetivo__descripcion">{descripcion}</p>
    </div>
  );
}