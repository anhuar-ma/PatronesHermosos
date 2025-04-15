import "../styles/registros.css";
import { useForm } from "react-hook-form";
import { useState } from "react";
import axios from "axios";

export default function RegistroColaboradores() {
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
      // Map form field names to expected API field names
      const colaboradorData = {
        nombre: data.nombre_colaborador,
        apellido_paterno: data.apellido_paterno_colaborador,
        apellido_materno: data.apellido_materno_colaborador,
        correo: data.correo_colaborador,
        universidad: data.universidad,
        idioma: data.idioma_preferencia,
        id_sede: data.sede_participar === "ITESM Puebla" ? 1 : 2, // Example mapping
        nivel: data.nivel_dominio,
        carrera: data.carrera,
        rol: data.rol,
        estado: "Activo", // Default value
        id_grupo: null, // Optional value
      };

      // const API_URL =
      //   window.location.hostname === "localhost"
      //     ? "http://localhost:5000"
      //     : "http://10.50.126.14:5000";

      const API_URL = "http://localhost:5000";

      window.alert("Formulario enviado correctamente ✅");
      // Then update the axios call to use this variable
      const response = await axios.post(
        `${API_URL}/api/colaboradores`,
        colaboradorData,
      );

      setSubmitResult({
        success: true,
        // message: "Registro exitoso",
      });
      console.log(response.data);
    } catch (error) {
      window.alert("Error en el registro");
      setSubmitResult({
        success: false,
        // message: error.response?.data?.message || "Error al enviar el registro",
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
            <h2 className="titulo">
              Registro para staff/ instructoras/facilitadoras
            </h2>
            <h4>
              Información personal
              <br />
              <span className="instructions">
                Llenar con datos como aparecen en un documento oficial.
              </span>
            </h4>
            <form onSubmit={handleSubmit(onSubmit)}>
              <div className="form">
                <label>
                  Nombre(s) del colaborador <span className="mandatory">*</span>
                  <br />
                  <input
                    className={errors.nombre_colaborador ? "input-error" : ""}
                    {...register("nombre_colaborador", {
                      required: "Este campo es obligatorio",
                    })}
                    type="text"
                  />
                  {errors.nombre_colaborador && (
                    <p className="error">{errors.nombre_colaborador.message}</p>
                  )}
                </label>

                <label>
                  Apellido paterno del colaborador
                  <span className="mandatory">*</span>
                  <br />
                  <input
                    className={
                      errors.apellido_paterno_colaborador ? "input-error" : ""
                    }
                    {...register("apellido_paterno_colaborador", {
                      required: "Este campo es obligatorio",
                    })}
                    type="text"
                  />
                  {errors.apellido_paterno_colaborador && (
                    <p className="error">
                      {errors.apellido_paterno_colaborador.message}
                    </p>
                  )}
                </label>

                <label>
                  Apellido materno del colaborador
                  <br />
                  <input
                    className={
                      errors.apellido_materno_colaborador ? "input-error" : ""
                    }
                    {...register("apellido_materno_colaborador", {
                      required: false,
                    })}
                    type="text"
                  />
                  {errors.apellido_materno_colaborador && (
                    <p className="error">
                      {errors.apellido_materno_colaborador.message}
                    </p>
                  )}
                </label>

                <label>
                  Correo <span className="mandatory">*</span>
                  <br />
                  <input
                    className={errors.correo_colaborador ? "input-error" : ""}
                    {...register("correo_colaborador", {
                      required: "Este campo es obligatorio",
                      pattern: {
                        value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                        message: "Correo electrónico inválido",
                      },
                    })}
                    type="email"
                  />
                  {errors.correo_colaborador && (
                    <p className="error">{errors.correo_colaborador.message}</p>
                  )}
                </label>

                <label>
                  Universidad <span className="mandatory">*</span>
                  <br />
                  <input
                    className={errors.universidad ? "input-error" : ""}
                    {...register("universidad", {
                      required: "Este campo es obligatorio",
                    })}
                    type="text"
                  />
                  {errors.universidad && (
                    <p className="error">{errors.universidad.message}</p>
                  )}
                </label>

                <label>
                  Sede en la que se desea participar
                  <span className="mandatory">*</span>
                  <br />
                  <select
                    className={`select-personalizado ${errors.sede_participar ? "select-error" : ""}`}
                    {...register("sede_participar", {
                      required: "Este campo es obligatorio",
                    })}
                  >
                    <option value="">Seleccionar</option>
                    <option value="ITESM Puebla">ITESM Puebla</option>
                    <option value="ITESM Monterrey">ITESM Monterrey</option>
                  </select>
                  {errors.sede_participar && (
                    <p className="error">{errors.sede_participar.message}</p>
                  )}
                </label>

                <div className="input-row">
                  <label>
                    Idioma de preferencia <span className="mandatory">*</span>
                    <br />
                    <select
                      className={`select-personalizado ${errors.idioma_preferencia ? "select-error" : ""}`}
                      {...register("idioma_preferencia", {
                        required: "Este campo es obligatorio",
                      })}
                    >
                      <option value="">Seleccionar</option>
                      <option value="Español">Español</option>
                      <option value="Inglés">Inglés</option>
                    </select>
                    {errors.idioma_preferencia && (
                      <p className="error">
                        {errors.idioma_preferencia.message}
                      </p>
                    )}
                  </label>

                  <label>
                    Nivel de dominio <span className="mandatory">*</span>
                    <br />
                    <select
                      className={`select-personalizado ${errors.nivel_dominio ? "select-error" : ""}`}
                      {...register("nivel_dominio", {
                        required: "Este campo es obligatorio",
                      })}
                    >
                      <option value="">Seleccionar</option>
                      <option value="Basico">Básico</option>
                      <option value="Avanzado">Avanzado</option>
                    </select>
                    {errors.nivel_dominio && (
                      <p className="error">{errors.nivel_dominio.message}</p>
                    )}
                  </label>
                </div>

                <label>
                  Carrera <span className="mandatory">*</span>
                  <br />
                  <input
                    className={errors.carrera ? "input-error" : ""}
                    {...register("carrera", {
                      required: "Este campo es obligatorio",
                    })}
                    type="text"
                  />
                  {errors.carrera && (
                    <p className="error">{errors.carrera.message}</p>
                  )}
                </label>

                <label>
                  Rol <span className="mandatory">*</span>
                  <br />
                  <select
                    className={`select-personalizado ${errors.rol ? "select-error" : ""}`}
                    {...register("rol", {
                      required: "Este campo es obligatorio",
                    })}
                  >
                    <option value="">Seleccionar</option>
                    <option value="Instructora">Instructora</option>
                    <option value="Facilitadora">Facilitadora</option>
                    <option value="Staff">Staff</option>
                  </select>
                  {errors.rol && <p className="error">{errors.rol.message}</p>}
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
