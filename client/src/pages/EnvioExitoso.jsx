import "../styles/EnvioExitosos.css";

export default function EnvioExitoso() {
  return (
    <>
     <div className="registro__fondoMorado">
      <div className="register-container">
        <div className="registro_containerForm">
          <h2 className="envioExitoso__titulo">¡Gracias por registrarse!</h2>
           <p className="envioExitoso__descripcion">
            Su solicitud de registro está en proceso. Le daremos seguimiento y le
            enviaremos cualquier actualización a través del correo electrónico
            que proporcionó.
          </p>
        </div>
      </div>
    </div>
    </>
  );
}