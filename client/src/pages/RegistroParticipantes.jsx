import { useForm } from "react-hook-form";
import { useState } from "react";
import "../styles/registros.css";

export default function RegistroParticipantes() {
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
          <h2 className="registro__titulo">Registro para participantes</h2>
          <form
            className="registro__formulario"
            onSubmit={handleSubmit(onSubmit)}
            noValidate
          >
            <h4 className="registro__tituloSeccion">Información personal</h4>
            <p className="registro__instrucciones">
              Llenar con datos como aparecen en un documento oficial.
            </p>

            <label>
              Nombre(s) de la alumna{" "}
              <span className="registro__obligatorio">*</span>
              <br />
              <input
                className={`registro__input ${
                  errors.nombre_alumna ? "registro__input-error" : ""
                }`}
                {...register("nombre_alumna", {
                  required: true,
                })}
              />
              {errors.nombre_alumna && (
                <p className="registro__error">Este campo es obligatorio</p>
              )}
            </label>

            <label>
              Apellido paterno de la alumna{" "}
              <span className="registro__obligatorio">*</span>
              <br />
              <input
                className={`registro__input ${
                  errors.apellido_paterno_alumna ? "registro__input-error" : ""
                }`}
                {...register("apellido_paterno_alumna", {
                  required: true,
                })}
              />
              {errors.apellido_paterno_alumna && (
                <p className="registro__error">Este campo es obligatorio</p>
              )}
            </label>

            <label>
              Apellido materno de la alumna
              <br />
              <input
                className="registro__input"
                {...register("apellido_materno_alumna", {
                  required: false,
                })}
              />
              {errors.apellido_materno_alumna && (
                <p className="registro__error">Este campo es obligatorio</p>
              )}
            </label>

            <label>
              Correo <span className="registro__obligatorio">*</span>
              <br />
              {/* <input type="email" {...register("correo_alumna", { required: true })} />
                            {errors.correo_alumna && <p className="error">Este campo es obligatorio</p>} */}
              <input
                className={`registro__input ${
                  errors.correo_tutor ? "registro__input-error" : ""
                }`}
                type="email"
                {...register("correo_alumna", {
                  required: "Este campo es obligatorio.",
                  pattern: {
                    value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                    message: "Ingresa un correo electrónico válido.",
                  },
                })}
              />
              {errors.correo_alumna && (
                <p className="registro__error">{errors.correo_alumna.message}</p>
              )}
            </label>

            <label>
              Edad <span className="registro__obligatorio">*</span>
              <br />
              <input
                className={`registro__input ${
                  errors.edad_alumna ? "registro__input-error" : ""
                }`}
                type="number"
                {...register("edad_alumna", {
                  required: true,
                })}
              />
              {errors.edad_alumna && (
                <p className="registro__error">Este campo es obligatorio</p>
              )}
            </label>

            <label>
              Escuela <span className="registro__obligatorio">*</span>
              <br />
              <input
                className={`registro__input ${
                  errors.escuela ? "registro__input-error" : ""
                }`}
                {...register("escuela", {
                  required: true,
                })}
              />
              {errors.escuela && (
                <p className="registro__error">Este campo es obligatorio</p>
              )}
            </label>

            <label>
              Sede deseada para registro{" "}
              <span className="registro__obligatorio">*</span>
              <br />
              <select
                className={`registro__select-personalizado registro__select${
                  errors.sede_deseada ? "registro__select-error" : ""
                }`}
                {...register("sede_deseada", {
                  required: true,
                })}
              >
                <option value="">Seleccionar</option>
                <option>ITESM Puebla</option>
                <option>ITESM Monterrey</option>
              </select>
              {errors.sede_deseada && (
                <p className="registro__error">Este campo es obligatorio</p>
              )}
            </label>

            <div className="registro__container__2inputsInRow">
              <label>
                Escolaridad <span className="registro__obligatorio">*</span>
                <br />
                <select
                  className={`registro__select ${
                    errors.escolaridad ? "registro__select-error" : ""
                  }`}
                  {...register("escolaridad", {
                    required: true,
                  })}
                >
                  <option value="">Seleccionar</option>
                  <option>Secundaria</option>
                  <option>Preparatoria</option>
                </select>
                {errors.escolaridad && (
                  <p className="registro__error">Este campo es obligatorio</p>
                )}
              </label>

              <label>
                Idioma de preferencia{" "}
                <span className="registro__obligatorio">*</span>
                <br />
                <select
                  className={`registro__select${
                    errors.escolaridad ? "registro__select-error" : ""
                  }`}
                  {...register("idioma", {
                    required: true,
                  })}
                >
                  <option value="">Seleccionar</option>
                  <option>Español</option>
                  <option>Inglés</option>
                </select>
                {errors.idioma && (
                  <p className="registro__error">Este campo es obligatorio</p>
                )}
              </label>
            </div>

            <h4 className="registro__tituloSeccion">Información del tutor</h4>
            <p className="registro__instrucciones">
              Llenar con datos como aparecen en un documento oficial.
            </p>

            <label>
              Nombre(s) del tutor{" "}
              <span className="registro__obligatorio">*</span>
              <br />
              <input
                className={`registro__input ${
                  errors.nombre_tutor ? "registro__input-error" : ""
                }`}
                {...register("nombre_tutor", {
                  required: true,
                })}
              />
              {errors.nombre_tutor && (
                <p className="registro__error">Este campo es obligatorio</p>
              )}
            </label>

            <label>
              Apellido paterno del tutor{" "}
              <span className="registro__obligatorio">*</span>
              <br />
              <input
                className={`registro__input ${
                  errors.apellido_paterno_tutor ? "registro__input-error" : ""
                }`}
                {...register("apellido_paterno_tutor", {
                  required: true,
                })}
              />
              {errors.apellido_paterno_tutor && (
                <p className="registro__error">Este campo es obligatorio</p>
              )}
            </label>

            <label>
              Apellido materno del tutor <br />
              <input
                className={`registro__input ${
                  errors.apellido_materno_tutor ? "registro__input-error" : ""
                }`}
                {...register("apellido_materno_tutor", {
                  required: false,
                })}
              />
              {errors.apellido_materno_tutor && (
                <p className="registro__error">Este campo es obligatorio</p>
              )}
            </label>

            <label>
              Correo del tutor <span className="registro__obligatorio">*</span>
              <br />
              {/* <input type="email" {...register("correo_tutor", { required: true })} />
                            {errors.correo_tutor && <p className="error">Este campo es obligatorio</p>} */}
              <input
                className={`registro__input ${
                  errors.correo_tutor ? "registro__input-error" : ""
                }`}
                type="email"
                {...register("correo_tutor", {
                  required: "Este campo es obligatorio.",
                  pattern: {
                    value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                    message: "Ingresa un correo electrónico válido.",
                  },
                })}
              />
              {errors.correo_tutor && (
                <p className="registro__error">{errors.correo_tutor.message}</p>
              )}
            </label>

            <label>
              Teléfono del tutor{" "}
              <span className="registro__obligatorio">*</span>
              <br />
              <input
                className={`registro__input ${
                  errors.telefono_tutor ? "registro__input-error" : ""
                }`}
                type="tel"
                {...register("telefono_tutor", {
                  required: true,
                })}
              />
              {errors.telefono_tutor && (
                <p className="registro__error">Este campo es obligatorio</p>
              )}
            </label>

            <label>
              Convocatoria de la sede{" "}
              <span className="registro__obligatorio">*</span>
              <br />
              <input
                type="file"
                name="archivo_tutor"
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

            <div className="registro__contenedor__botonSubmit">
              <button type="submit" className="registro__botonMorado">
                Enviar Registro
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
