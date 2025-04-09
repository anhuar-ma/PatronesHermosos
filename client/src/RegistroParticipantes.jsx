import "./registros.css";
import { useForm } from "react-hook-form";
import { useState } from "react";
import axios from "axios";

export default function RegistroParticipantes() {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitResult, setSubmitResult] = useState(null);

  const onSubmit = async (data) => {
    setIsSubmitting(true);
    try {
      // Assuming we'll create a similar endpoint for participants
      const response = await axios.post(
        "http://localhost:5000/api/participantes",
        data,
      );
      setSubmitResult({
        success: true,
        message: "Registro exitoso",
      });
      console.log(response.data);
    } catch (error) {
      setSubmitResult({
        success: false,
        message: error.response?.data?.message || "Error al enviar el registro",
      });
      console.error("Error:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <>
      <div className="fondo">
        <div className="register-container">
          <div className="card">
            <h1 className="titulo">Registro para participantes</h1>
            <form onSubmit={handleSubmit(onSubmit)}>
              <h4>
                Información personal
                <br />
                <span className="instructions">
                  Llenar con datos como aparecen en un documento oficial.
                </span>
              </h4>
              <div className="form">
                <label>
                  Nombre(s) de la alumna <span className="mandatory">*</span>
                  <br />
                  <input
                    {...register("nombre_alumna", {
                      required: "Este campo es obligatorio",
                    })}
                  />
                  {errors.nombre_alumna && (
                    <span className="error">
                      {errors.nombre_alumna.message}
                    </span>
                  )}
                </label>

                <label>
                  Apellido paterno de la alumna{" "}
                  <span className="mandatory">*</span>
                  <br />
                  <input
                    {...register("apellido_paterno", {
                      required: "Este campo es obligatorio",
                    })}
                  />
                  {errors.apellido_paterno && (
                    <span className="error">
                      {errors.apellido_paterno.message}
                    </span>
                  )}
                </label>

                <label>
                  Apellido materno de la alumna{" "}
                  <span className="mandatory">*</span>
                  <br />
                  <input
                    {...register("apellido_materno", {
                      required: "Este campo es obligatorio",
                    })}
                  />
                  {errors.apellido_materno && (
                    <span className="error">
                      {errors.apellido_materno.message}
                    </span>
                  )}
                </label>

                <label>
                  Correo <span className="mandatory">*</span>
                  <br />
                  <input
                    type="email"
                    {...register("correo", {
                      required: "Este campo es obligatorio",
                      pattern: {
                        value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                        message: "Correo electrónico inválido",
                      },
                    })}
                  />
                  {errors.correo && (
                    <span className="error">{errors.correo.message}</span>
                  )}
                </label>

                <label>
                  Edad <span className="mandatory">*</span>
                  <br />
                  <input
                    type="number"
                    {...register("edad", {
                      required: "Este campo es obligatorio",
                      min: {
                        value: 8,
                        message: "La edad mínima es 8 años",
                      },
                    })}
                  />
                  {errors.edad && (
                    <span className="error">{errors.edad.message}</span>
                  )}
                </label>

                <div className="input-row">
                  <label>
                    Escuela <span className="mandatory">*</span>
                    <br />
                    <select
                      {...register("escuela", {
                        required: "Este campo es obligatorio",
                      })}
                    >
                      <option value="">Seleccionar</option>
                      <option value="ITESM Puebla">ITESM Puebla</option>
                      <option value="ITESM Monterrey">ITESM Monterrey</option>
                    </select>
                    {errors.escuela && (
                      <span className="error">{errors.escuela.message}</span>
                    )}
                  </label>

                  <label>
                    Escolaridad <span className="mandatory">*</span>
                    <br />
                    <select
                      {...register("escolaridad", {
                        required: "Este campo es obligatorio",
                      })}
                    >
                      <option value="">Seleccionar</option>
                      <option value="Secundaria">Secundaria</option>
                      <option value="Preparatoria">Preparatoria</option>
                    </select>
                    {errors.escolaridad && (
                      <span className="error">
                        {errors.escolaridad.message}
                      </span>
                    )}
                  </label>
                </div>

                <div className="input-row">
                  <label>
                    Sede deseada para registro{" "}
                    <span className="mandatory">*</span>
                    <br />
                    <select
                      {...register("sede_deseada", {
                        required: "Este campo es obligatorio",
                      })}
                    >
                      <option value="">Seleccionar</option>
                      <option value="ITESM Puebla">ITESM Puebla</option>
                      <option value="ITESM Monterrey">ITESM Monterrey</option>
                    </select>
                    {errors.sede_deseada && (
                      <span className="error">
                        {errors.sede_deseada.message}
                      </span>
                    )}
                  </label>

                  <label>
                    Idioma de preferencia <span className="mandatory">*</span>
                    <br />
                    <select
                      {...register("idioma", {
                        required: "Este campo es obligatorio",
                      })}
                    >
                      <option value="">Seleccionar</option>
                      <option value="Español">Español</option>
                      <option value="Inglés">Inglés</option>
                    </select>
                    {errors.idioma && (
                      <span className="error">{errors.idioma.message}</span>
                    )}
                  </label>
                </div>
              </div>

              <h4>
                Información del tutor
                <br />
                <span className="instructions">
                  Llenar con datos como aparecen en un documento oficial.
                </span>
              </h4>
              <div className="form">
                <label>
                  Nombre(s) del tutor <span className="mandatory">*</span>
                  <br />
                  <input
                    {...register("nombre_tutor", {
                      required: "Este campo es obligatorio",
                    })}
                  />
                  {errors.nombre_tutor && (
                    <span className="error">{errors.nombre_tutor.message}</span>
                  )}
                </label>

                <label>
                  Apellido paterno del tutor{" "}
                  <span className="mandatory">*</span>
                  <br />
                  <input
                    {...register("apellido_paterno_tutor", {
                      required: "Este campo es obligatorio",
                    })}
                  />
                  {errors.apellido_paterno_tutor && (
                    <span className="error">
                      {errors.apellido_paterno_tutor.message}
                    </span>
                  )}
                </label>

                <label>
                  Apellido materno del tutor{" "}
                  <span className="mandatory">*</span>
                  <br />
                  <input
                    {...register("apellido_materno_tutor", {
                      required: "Este campo es obligatorio",
                    })}
                  />
                  {errors.apellido_materno_tutor && (
                    <span className="error">
                      {errors.apellido_materno_tutor.message}
                    </span>
                  )}
                </label>

                <label>
                  Correo del tutor <span className="mandatory">*</span>
                  <br />
                  <input
                    type="email"
                    {...register("correo_tutor", {
                      required: "Este campo es obligatorio",
                      pattern: {
                        value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                        message: "Correo electrónico inválido",
                      },
                    })}
                  />
                  {errors.correo_tutor && (
                    <span className="error">{errors.correo_tutor.message}</span>
                  )}
                </label>

                <label>
                  Teléfono del tutor <span className="mandatory">*</span>
                  <br />
                  <input
                    type="tel"
                    {...register("telefono_tutor", {
                      required: "Este campo es obligatorio",
                      pattern: {
                        value: /^[0-9]{10}$/,
                        message: "Debe contener 10 dígitos",
                      },
                    })}
                  />
                  {errors.telefono_tutor && (
                    <span className="error">
                      {errors.telefono_tutor.message}
                    </span>
                  )}
                </label>

                <label>
                  Subir archivo del tutor <span className="mandatory">*</span>
                  <br />
                  <input
                    type="file"
                    id="archivo_tutor"
                    style={{ display: "none" }}
                    {...register("archivo_tutor", {
                      required: "Este archivo es obligatorio",
                    })}
                  />
                  <button
                    type="button"
                    className="gray-button"
                    onClick={() =>
                      document.getElementById("archivo_tutor").click()
                    }
                  >
                    Subir archivo
                  </button>
                  {errors.archivo_tutor && (
                    <span className="error">
                      {errors.archivo_tutor.message}
                    </span>
                  )}
                </label>

                <div className="submit">
                  <button
                    type="submit"
                    className="purple-button"
                    disabled={isSubmitting}
                  >
                    {isSubmitting ? "Enviando..." : "Enviar Registro"}
                  </button>
                </div>

                {submitResult && (
                  <div
                    className={
                      submitResult.success ? "success-message" : "error-message"
                    }
                  >
                    {submitResult.message}
                  </div>
                )}
              </div>
            </form>
          </div>
        </div>
      </div>
    </>
  );
}
