import { useForm } from "react-hook-form";
import { useState } from "react";
import axios from "axios";
import "../styles/registros.css";

export default function RegistroParticipantes() {
  const [fileName, setFileName] = useState("");
  const [fileError, setFileError] = useState("");
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitResult, setSubmitResult] = useState(null);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  const onSubmit = async (data) => {
    setIsSubmitting(true);

    // Check for file upload first
    if (!fileName) {
      setFileError("No hay archivo seleccionado");
      setIsSubmitting(false);
      return;
    }

    try {
      const participanteData = {
        nombre_alumna: data.nombre_alumna,
        apellido_paterno: data.apellido_paterno_alumna,
        apellido_materno: data.apellido_materno_alumna,
        edad: data.edad_alumna,
        correo: data.correo_alumna,
        escuela: data.escuela,
        escolaridad: data.escolaridad,
        sede_deseada: data.sede_deseada,
        idioma: data.idioma,
        nombre_tutor: data.nombre_tutor,
        apellido_paterno_tutor: data.apellido_paterno_tutor,
        apellido_materno_tutor: data.apellido_materno_tutor,
        correo_tutor: data.correo_tutor,
        telefono_tutor: data.telefono_tutor,
      };

      await axios.post("/api/participantes", participanteData);

      setSubmitResult({
        success: true,
        message:
          "¡Registro exitoso! La participante ha sido registrada correctamente.",
      });
      setError("");
      setFileError("");
    } catch (error) {
      window.alert("Error en el registro");
      console.error("Error:", error);
      setSubmitResult({
        success: false,
        message: `Error en el registro: ${
          error.response?.data?.message || "No se pudo completar el registro"
        }`,
      });
      console.error("Error:", error);
    } finally {
      setIsSubmitting(false);
    }

    // alert("Formulario enviado correctamente ✅");
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
          <form className="registro__formulario" onSubmit={handleSubmit(onSubmit)} noValidate>
            <h4 className="registro__tituloSeccion">Información personal</h4>
            <p className="registro__instrucciones">
              Llenar con datos como aparecen en un documento oficial.
            </p>
            <label>
              Nombre(s) de la alumna <span className="registro__obligatorio">*</span>
              <br />
              <input
                className={`registro__input ${errors.nombre_alumna ? "registro__input-error" : ""}`}
                {...register("nombre_alumna", {
                  required: true,
                })}
              />
              {errors.nombre_alumna && (
                <p className="registro__error">Este campo es obligatorio</p>
              )}
            </label>
            <label>
              Apellido paterno de la alumna <span className="registro__obligatorio">*</span>
              <br />
              <input
                className={errors.apellido_paterno_alumna ? "registro__input-error" : ""}
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
                className={errors.correo_alumna ? "registro__input-error" : ""}
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
                className={errors.edad_alumna ? "registro__input-error" : ""}
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
                className={errors.escuela ? "registro__input-error" : ""}
                {...register("escuela", {
                  required: true,
                })}
              />
              {errors.escuela && (
                <p className="registro__error">Este campo es obligatorio</p>
              )}
            </label>
            <label>
              Sede deseada para registro <span className="registro__obligatorio">*</span>
              <br />
              <select
                className={` registro__select${
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
            <div className="input-row">
              <label>
                Escolaridad <span className="registro__obligatorio">*</span>
                <br />
                <select
                  className={`select-personalizado ${
                    errors.escolaridad ? "select-error" : ""
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
                Idioma de preferencia <span className="registro__obligatorio">*</span>
                <br />
                <select
                  className={`select-personalizado ${
                    errors.escolaridad ? "select-error" : ""
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
            <h4>
              Información del tutor
              <br />
              <span className="instructions">
                Llenar con datos como aparecen en un documento oficial.
              </span>
            </h4>
            <label>
              Nombre(s) del tutor <span className="registro__obligatorio">*</span>
              <br />
              <input
                className={errors.nombre_tutor ? "registro__input-error" : ""}
                {...register("nombre_tutor", {
                  required: true,
                })}
              />
              {errors.nombre_tutor && (
                <p className="registro__error">Este campo es obligatorio</p>
              )}
            </label>
            <label>
              Apellido paterno del tutor <span className="registro__obligatorio">*</span>
              <br />
              <input
                className={errors.apellido_paterno_tutor ? "registro__input-error" : ""}
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
                className={errors.apellido_materno_tutor ? "registro__input-error" : ""}
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
                className={errors.correo_tutor ? "input-error" : ""}
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
              Teléfono del tutor <span className="registro__obligatorio">*</span>
              <br />
              <input
                className={errors.telefono_tutor ? "registro__input-error" : ""}
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
              Convocatoria de la sede <span className="registro__obligatorio">*</span>
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
            {submitResult && (
              <div
                className={
                  submitResult.success ? "success-message" : "error-message"
                }
              >
                {submitResult.message}
              </div>
            )}
            <div className="registro__contenedor__botonSubmit">
              <button
                type="submit"
                className="registro__botonMorado"
                disabled={isSubmitting}
              >
                {isSubmitting ? "Enviando..." : "Enviar Registro"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
