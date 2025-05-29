import { useState } from "react";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom"; // Importa useNavigate
import "../styles/registros.css/";
import axios from "axios";

export default function RegistroSedes() {
  const [fileName, setFileName] = useState("");
  const [fileError, setFileError] = useState("");
  const [error, setError] = useState("");
  const [submitResult, setSubmitResult] = useState(null);
  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm();

  const onSubmit = async (data) => {
    if (!fileName) {
      setFileError("No hay archivo seleccionado");
      return;
    }

    try {
      const formData = new FormData();

      // Coordinatora
      formData.append("nombre_coordinadora", data.nombre_coordinadora);
      formData.append(
        "apellido_paterno_coordinadora",
        data.apellido_paterno_coordinadora
      );
      formData.append(
        "apellido_materno_coordinadora",
        data.apellido_materno_coordinadora
      );
      formData.append("correo_coordinadora", data.correo_coordinadora);
      // Correctly append the password using the key from react-hook-form
      formData.append("password", data.password); // Changed from data.contraseña

      // Sede
      formData.append("nombre_sede", data.nombre_sede);
      formData.append("fecha_inicio", data.fecha_inicio);

      // Add the file to FormData
      const fileInput = document.getElementById("convocatoria");
      if (fileInput.files[0]) {
        formData.append("convocatoria", fileInput.files[0]);
      }

      // Send the FormData with file to the server
      const response = await axios.post("/api/sedes", formData, {});

      setSubmitResult({
        success: true,
        message: "¡Registro exitoso! La sede ha sido registrada correctamente.",
      });
      // alert("Formulario enviado correctamente ✅"); // Moved success alert here
      console.log("Server success response:", response.data);
      console.log("Submitted data:", data); // Log data from react-hook-form

      // Clear errors only on success
      setError("");
      setFileError("");
      navigate("/envioExitoso");
    } catch (error) {
      window.alert("Error en el registro");
      console.error("Error submitting form:", error);
      let errorMessage = "Error desconocido durante el registro.";
      if (error.response) {
        console.error("Server response data:", error.response.data);
        console.error("Server response status:", error.response.status);
        errorMessage = `Error del servidor: ${
          error.response.data.message ||
          error.response.statusText ||
          "Error desconocido"
        }`;
      } else if (error.request) {
        console.error("No response received:", error.request);
        errorMessage =
          "No se recibió respuesta del servidor. Verifique su conexión.";
      } else {
        console.error("Error setting up request:", error.message);
        errorMessage = `Error al enviar la solicitud: ${error.message}`;
      }
      setSubmitResult({
        success: false,
        message: errorMessage,
      });
      // Do not clear errors or show general success alert here
    }
    // Removed general success alert and error clearing from here
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.type !== "application/pdf") {
        setFileError("Solo se permiten archivos PDF");
        setFileName("");
        return;
      }
      setFileName(file.name);
      setFileError("");
    }
  };

  return (
    <div className="registro__fondoMorado">
      <div className="register-container">
        <div className="registro_containerForm">
          <h2 className="registro__titulo">Registro para sedes</h2>
          <form
            className="registro__formulario"
            onSubmit={handleSubmit(onSubmit)}
          >
            <h4 className="registro__tituloSeccion">Información personal</h4>
            <p className="registro__instrucciones">
              Llenar con datos como aparecen en un documento oficial.
            </p>
            <label>
              Nombre(s) de la coordinadora
              <span className="registro__obligatorio">*</span>
              <br />
              <input
                className={`registro__input ${
                  errors.nombre_coordinadora ? "registro__input-error" : ""
                }`}
                {...register("nombre_coordinadora", { required: true })}
                type="text"
              />
              {errors.nombre_coordinadora && (
                <p className="registro__error">Este campo es obligatorio</p>
              )}
            </label>

            <label>
              Apellido paterno de la coordinadora{" "}
              <span className="registro__obligatorio">*</span>
              <br />
              <input
                className={`registro__input ${
                  errors.apellido_paterno_coordinadora
                    ? "registro__input-error"
                    : ""
                }`}
                {...register("apellido_paterno_coordinadora", {
                  required: true,
                })}
                type="text"
              />
              {errors.apellido_paterno_coordinadora && (
                <p className="registro__error">Este campo es obligatorio</p>
              )}
            </label>

            <label>
              Apellido materno de la coordinadora
              <br />
              <input
                className="registro__input"
                {...register("apellido_materno_coordinadora")}
                type="text"
              />
            </label>

            <label>
              Correo <span className="registro__obligatorio">*</span>
              <br />
              <input
                className={`registro__input ${
                  errors.correo_coordinadora ? "registro__input-error" : ""
                }`}
                {...register("correo_coordinadora", { required: true })}
                type="email"
              />
              {errors.correo_coordinadora && (
                <p className="registro__error">Correo inválido o vacío</p>
              )}
            </label>

            <div className="input-row">
              <label>
                Contraseña <span className="registro__obligatorio">*</span>
                <br />
                <input
                  className="registro__input"
                  type="password"
                  autoComplete="new-password"
                  {...register("password", { required: true })}
                />
                {errors.password && (
                  <p className="registro__error">Este campo es obligatorio</p>
                )}
              </label>
              <label>
                Verificar contraseña{" "}
                <span className="registro__obligatorio">*</span>
                <br />
                <input
                  className="registro__input"
                  type="password"
                  autoComplete="new-password"
                  {...register("verificar_contraseña", {
                    required: "La verificación de contraseña es obligatoria",
                    validate: (value) =>
                      value === watch("password") ||
                      "Las contraseñas no coinciden",
                  })}
                />
                {errors.verificar_contraseña && (
                  <p className="registro__error">
                    {errors.verificar_contraseña.message}
                  </p>
                )}
              </label>
            </div>

            {error && <p className="error">{error}</p>}

            <h4 className="registro__tituloSeccion">Información de la sede</h4>
            <p className="registro__instrucciones">
              Llenar con datos de la sede.
            </p>

            <label>
              Nombre de Sede (Con este nombre los alumnos seleccionarán la sede){" "}
              <span className="registro__obligatorio">*</span>
              <input
                id="nombre_sede"
                className={`registro__input ${
                  errors.nombre_sede ? "registro__input-error" : ""
                }`}
                {...register("nombre_sede", { required: true })}
                type="text"
              />
              {errors.nombre_sede && (
                <p className="registro__error">Este campo es obligatorio</p>
              )}
            </label>

            <label>
              Convocatoria de la sede{" "}
              <span className="registro__obligatorio">*</span>
              <br />
              <input
                className={`registro__input ${
                  errors.correo_coordinadora ? "registro__input-error" : ""
                }`}
                type="file"
                name="convocatoria"
                id="convocatoria"
                accept="application/pdf"
                style={{ display: "none" }}
                onChange={handleFileChange}
              />
              <button
                type="button"
                className="registro__botonGrisArchivos"
                onClick={() => document.getElementById("convocatoria").click()}
              >
                Subir archivo
              </button>
              {fileName && <p className="archivo-nombre">{fileName}</p>}
              {fileError && <p className="registro__error">{fileError}</p>}
            </label>
            {submitResult && (
              <div
                className={
                  submitResult.success ? "success-message" : "error-message"
                }
              >
                {submitResult.message}
              </div>
            )}
            <label>
              Fecha de inicio <span className="registro__obligatorio">*</span>
              <br />
              <select
                className={`registro__select ${
                  errors.escolaridad ? "registro__select-error" : ""
                }`}
                {...register("fecha_inicio", { required: true })}
              >
                <option value="">Seleccione una fecha</option>
                <option value="06/16/25">16/06/25</option>
                <option value="06/23/25">23/06/25</option>
                <option value="06/30/25">30/06/25</option>
                <option value="07/07/25">07/07/25</option>
                <option value="07/14/25">14/07/25</option>
              </select>
              {errors.fecha_inicio && (
                <p className="registro__error">Este campo es obligatorio</p>
              )}
            </label>

            <div className="registro__contenedor__botonSubmit">
              <input
                type="submit"
                className="registro__botonMorado"
                value="Enviar Registro"
              />
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
