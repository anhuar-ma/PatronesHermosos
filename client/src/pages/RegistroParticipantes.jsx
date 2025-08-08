import { useForm } from "react-hook-form";
import { useState } from "react";
import { useNavigate } from "react-router-dom"; // Importa useNavigate
import axios from "axios";
import "../styles/registros.css";
import useSedesNames from "../hooks/useSedesNombres";
import PhoneInput from "react-phone-input-2";
import 'react-phone-input-2/lib/plain.css'; // Usa el tema más limpio
import { useEffect } from "react";

export default function RegistroParticipantes() {
  const [fileName, setFileName] = useState("");
  const [fileError, setFileError] = useState("");
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitResult, setSubmitResult] = useState(null);
  const { sedes, loading: sedesLoading, error: sedesError } = useSedesNames();
  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    formState: { errors },
    watch, // Agrega watch aquí
    setValue, // Asegúrate de incluir setValue si lo usas
  } = useForm();

  useEffect(() => {
    register("telefono_tutor", {
      required: "Este campo es obligatorio.",
      validate: (value) => {
        const digitsOnly = value.replace(/\D/g, ""); // Elimina cualquier cosa que no sea número
        const match = digitsOnly.match(/^(\d{1,4})(\d{10})$/); // Lada de 1 a 4 dígitos y 10 dígitos restantes
        return match ? true : "El número debe incluir una lada válida y 10 dígitos adicionales.";
      },
    });
  }, [register]);

  const onSubmit = async (data) => {
    setIsSubmitting(true);

    // Check for file upload first
    if (!fileName) {
      setFileError("No hay archivo seleccionado");
      setIsSubmitting(false);
      return;
    }

    try {
      // Create FormData object for file upload
      const formData = new FormData();

      // Add all form fields to FormData
      formData.append("nombre_alumna", data.nombre_alumna);
      formData.append("apellido_paterno", data.apellido_paterno_alumna);
      formData.append("apellido_materno", data.apellido_materno_alumna || "");
      formData.append("edad", data.edad_alumna);
      formData.append("correo", data.correo_alumna);
      formData.append("escuela", data.escuela);
      formData.append("escolaridad", data.escolaridad);
      formData.append("sede_deseada", data.sede_deseada);
      formData.append("idioma", data.idioma);
      formData.append("nombre_tutor", data.nombre_tutor);
      formData.append("apellido_paterno_tutor", data.apellido_paterno_tutor);
      formData.append(
        "apellido_materno_tutor",
        data.apellido_materno_tutor || ""
      );
      formData.append("correo_tutor", data.correo_tutor);
      formData.append("telefono_tutor", data.telefono_tutor);

      // Add the file to FormData
      const fileInput = document.getElementById("archivo_tutor");
      if (fileInput.files[0]) {
        formData.append("archivo_tutor", fileInput.files[0]);
      }

      // Send the FormData with file to the server
      const response = await axios.post("/api/participantes", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      setSubmitResult({
        success: true,
        message:
          "¡Registro exitoso! La participante ha sido registrada correctamente.",
      });
      setError("");
      setFileError("");
      // window.alert("Registro exitoso!");
      navigate("/envioExitoso");
    } catch (error) {
      window.alert("Error en el registro");
      console.error("Error:", error);
      setSubmitResult({
        success: false,
        message: `Error en el registro: ${error.response?.data?.message || "No se pudo completar el registro"
          }`,
      });
    } finally {
      setIsSubmitting(false);
    }

    // alert("Formulario enviado correctamente ✅");
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
              Nombre(s) de la alumna{" "} <span className="registro__obligatorio">*</span>
              <br />
              <input
                className={`registro__input ${errors.nombre_alumna ? "registro__input-error" : ""
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
              Apellido paterno de la alumna{" "} <span className="registro__obligatorio">*</span>
              <br />
              <input
                className={`registro__input ${errors.apellido_paterno_alumna ? "registro__input-error" : ""
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
              <span className="optional">(opcional)</span>
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
                className={`registro__input ${errors.correo_alumna ? "registro__input-error" : ""
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
                <p className="registro__error">
                  {errors.correo_alumna.message}
                </p>
              )}
            </label>
            <label>
              Edad <span className="registro__obligatorio">*</span>
              <br />
              <input
                className={`registro__input ${errors.edad_alumna ? "registro__input-error" : ""
                  }`}
                type="number"
                {...register("edad_alumna", {
                  required: "Este campo es obligatorio.",
                  validate: {
                    positive: (value) =>
                      value > 0 || "La edad debe ser un número positivo.",
                    maxLimit: (value) =>
                      value < 100 || "La edad debe ser menor a 100.",
                  },
                })}
              />
              {errors.edad_alumna && (
                <p className="registro__error">{errors.edad_alumna.message}</p>
              )}
            </label>
            <label>
              Escuela <span className="registro__obligatorio">*</span>
              <br />
              <input
                className={`registro__input ${errors.escuela ? "registro__input-error" : ""
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
              Sede deseada para registro <span className="registro__obligatorio">*</span>
              <br />
              <select
                className={`registro__select${errors.sede_deseada ? " select-error" : ""
                  }`}
                {...register("sede_deseada", {
                  required: true,
                })}
              >
                <option value="">Seleccionar</option>
                {sedes.map((sede) => (
                  <option key={sede.id_sede} value={sede.id_sede}>
                    {sede.nombre}
                  </option>
                ))}
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
                  className={`registro__select ${errors.escolaridad ? "select-error" : ""
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
                Idioma de preferencia{" "} <span className="registro__obligatorio">*</span>
                <br />
                <select
                  className={`registro__select ${errors.idioma ? "select-error" : ""
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
              Nombre(s) del tutor{" "} <span className="registro__obligatorio">*</span>
              <br />
              <input
                className={`registro__input ${errors.nombre_tutor ? "registro__input-error" : ""
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
              Apellido paterno del tutor{" "} <span className="registro__obligatorio">*</span>
              <br />
              <input
                className={`registro__input ${errors.apellido_paterno_tutor ? "registro__input-error" : ""
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
              Apellido materno del tutor
              <span className="optional">(opcional)</span>
              <br />
              <input
                className={`registro__input ${errors.apellido_materno_tutor ? "registro__input-error" : ""
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
                className={`registro__input ${errors.correo_tutor ? "input-error" : ""
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
              Teléfono del tutor{" "} <span className="registro__obligatorio">*</span>
              <br />
              <PhoneInput
                country={"mx"}
                value={watch("telefono_tutor")}
                onChange={(value) => setValue("telefono_tutor", value, { shouldValidate: true })}
                inputClass="mi-input-telefono"
                buttonClass="mi-boton-bandera"
                containerClass="mi-contenedor-phone"
              />
              {errors.telefono_tutor && (
                <p className="registro__error">{errors.telefono_tutor.message}</p>
              )}
            </label>
            <label>
              Permiso Firmado <span className="registro__obligatorio">*</span>
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
