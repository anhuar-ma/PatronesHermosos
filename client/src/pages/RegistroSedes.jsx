import { useState } from "react";
import { useForm } from "react-hook-form";
import "../styles/registros.css/";

export default function RegistroSedes() {
  const [fileName, setFileName] = useState("");
  const [fileError, setFileError] = useState("");
  const [error, setError] = useState("");

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  const onSubmit = (data) => {
    if (data.contraseña !== data.verificar_contraseña) {
      setError("Las contraseñas no coinciden");
      return;
    }

    if (!fileName) {
      setFileError("No hay archivo seleccionado");
      return;
    }

    setError("");
    setFileError("");
    alert("Formulario enviado correctamente ✅");
    console.log(data);
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
              Nombre(s) de la alumna&nbsp;<span className="registro__obligatorio">*</span>
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
                  errors.apellido_paterno_coordinadora ? "registro__input-error" : ""
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
                  {...register("contraseña", { required: true })}
                />
                {errors.contraseña && (
                  <p className="registro__error">Este campo es obligatorio</p>
                )}
              </label>

              <label>
                Verificar contraseña <span className="registro__obligatorio">*</span>
                <br />
                <input
                  className="registro__input"
                  type="password"
                  autoComplete="new-password"
                  {...register("verificar_contraseña", { required: true })}
                />
                {errors.verificar_contraseña && (
                  <p className="registro__error">Este campo es obligatorio</p>
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
              <input id="nombre_sede"
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
              Convocatoria de la sede <span className="registro__obligatorio">*</span>
              <br />
              <input
                className={`registro__input ${
                  errors.correo_coordinadora ? "registro__input-error" : ""
                }`}
                type="file"
                name="archivo_convocatoria"
                id="archivo_tutor"
                accept="application/pdf"
                style={{ display: "none" }}
                onChange={handleFileChange}
              />
              <button
                type="button"
                className="registro__botonGrisArchivos"
                onClick={() => document.getElementById("archivo_tutor").click()}
              >
                Subir archivo
              </button>
              {fileName && <p className="archivo-nombre">{fileName}</p>}
              {fileError && <p className="registro__error">{fileError}</p>}
            </label>

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
                <option value="7/11/22">7/11/22</option>
                <option value="8/12/22">8/12/22</option>
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
