import "../styles/registros.css";
import { useForm } from "react-hook-form";
import { useState } from "react";
import useSedesNames from "../hooks/useSedesNombres";
import { useNavigate } from "react-router-dom"; // Importa useNavigate
import axios from "axios";

export default function RegistroColaboradores() {
    const navigate = useNavigate(); // Inicializa el hook

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitResult, setSubmitResult] = useState(null);
  const { sedes, loading: sedesLoading, error: sedesError } = useSedesNames();

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
        id_sede: data.sede_participar, // Example mapping
        nivel: data.nivel_dominio,
        carrera: data.carrera,
        rol: data.rol,
        estado: "Pendiente", // Default value
        id_grupo: null, // Optional value
      };

      // const API_URL =
      //   window.location.hostname === "localhost"
      //     ? "http://localhost:5000"
      //     : "http://10.50.126.14:5000";

      const response = await axios.post(`/api/colaboradores`, colaboradorData);

      setSubmitResult({
        success: true,
        // message: "Registro exitoso",
      });

      // window.alert("Registro exitoso!");

        // Redirige a EnvioExitoso.jsx
      navigate("/envioExitoso");
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
      <div className="registro__fondoMorado">
        <div className="register-container">
          <div className="registro_containerForm">
            <h2 className="registro__titulo">
              Registro para staff/ instructoras/facilitadoras
            </h2>
            <form
              className="registro__formulario"
              onSubmit={handleSubmit(onSubmit)}
            >
              <h4 className="registro__tituloSeccion">Información personal</h4>
              <p className="registro__instrucciones">
                Llenar con datos como aparecen en un documento oficial.
              </p>
              <label>
                Nombre(s) del colaborador
                <br />
                <input
                  className={`registro__input ${
                    errors.nombre_colaborador ? "registro__input-error" : ""
                  }`}
                  {...register("nombre_colaborador", {
                    required: "Este campo es obligatorio",
                  })}
                  type="text"
                />
                {errors.nombre_colaborador && (
                  <p className="registro__error">{errors.nombre_colaborador.message}</p>
                )}
              </label>

              <label>
                Apellido paterno del colaborador
                <br />
                <input
                  className={`registro__input ${
                    errors.apellido_paterno_colaborador ? "registro__input-error" : ""
                  }`}
                  {...register("apellido_paterno_colaborador", {
                    required: "Este campo es obligatorio",
                  })}
                  type="text"
                />
                {errors.apellido_paterno_colaborador && (
                  <p className="registro__error">
                    {errors.apellido_paterno_colaborador.message}
                  </p>
                )}
              </label>

              <label>
                Apellido materno del colaborador   
                <span className="optional">(opcional)</span>
                <br />
                <input
                  className={`registro__input ${
                    errors.apellido_materno_colaborador ? "registro__input-error" : ""
                  }`}
                  {...register("apellido_materno_colaborador", {
                    required: false,
                  })}
                  type="text"
                />
                {errors.apellido_materno_colaborador && (
                  <p className="registro__error">
                    {errors.apellido_materno_colaborador.message}
                  </p>
                )}
              </label>

              <label>
                Correo
                <br />
                <input
                  className={`registro__input ${
                    errors.correo_colaborador ? "registro__input-error" : ""
                  }`}
                  {...register("correo_colaborador", {
                    required: "Este campo es obligatorio",
                    pattern: {
                      value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                      message: "Correo electrónico inválido",
                    },
                  })}
                  // type="email"
                />
                {errors.correo_colaborador && (
                  <p className="registro__error">{errors.correo_colaborador.message}</p>
                )}
              </label>

              <label>
                Universidad
                <br />
                <input
                  className={`registro__input ${
                    errors.universidad ? "registro__input-error" : ""
                  }`}
                  {...register("universidad", {
                    required: "Este campo es obligatorio",
                  })}
                  type="text"
                />
                {errors.universidad && (
                  <p className="registro__error">{errors.universidad.message}</p>
                )}
              </label>

              <label>
                Sede en la que se desea participar
                <br />
                <select
                  className={`registro__select ${
                    errors.sede_participar ? "registro__select-error" : ""
                  }`}
                  {...register("sede_participar", {
                    required: "Este campo es obligatorio",
                  })}
                >
                <option value="">Seleccionar</option>
                {sedes.map((sede) => (
                  <option key={sede.id_sede} value={sede.id_sede}>
                    {sede.nombre}
                  </option>
                ))}
                </select>
                {errors.sede_participar && (
                  <p className="registro__error">{errors.sede_participar.message}</p>
                )}
              </label>

              {/* <div className="registro__container__2inputsInRow"> */}
                <label>
                  Idioma de preferencia 
                  <br />
                  <select
                    className={`registro__select ${
                      errors.idioma_preferencia ? "registro__select-error" : ""
                    }`}
                    {...register("idioma_preferencia", {
                      required: "Este campo es obligatorio",
                    })}
                  >
                    <option value="">Seleccionar</option>
                    <option value="Español">Español</option>
                    <option value="Inglés">Inglés</option>
                  </select>
                  {errors.idioma_preferencia && (
                    <p className="registro__error">{errors.idioma_preferencia.message}</p>
                  )}
                </label>

                <label>
                  Nivel del grupo que quieres impartir 
                  <br />
                  <select
                    className={`registro__select ${
                      errors.nivel_dominio ? "registro__select-error" : ""
                    }`}
                    {...register("nivel_dominio", {
                      required: "Este campo es obligatorio",
                    })}
                  >
                    <option value="">Seleccionar</option>
                    <option value="Basico">Básico (HTML)</option>
                    <option value="Avanzado">Avanzado (Python)</option>
                  </select>
                  {errors.nivel_dominio && (
                    <p className="registro__error">{errors.nivel_dominio.message}</p>
                  )}
                </label>
              {/* </div> */}

              <label>
                Carrera 
                <br />
                <input
                  className={`registro__input ${
                    errors.carrera ? "registro__input-error" : ""
                  }`}
                  {...register("carrera", {
                    required: "Este campo es obligatorio",
                  })}
                  type="text"
                />
                {errors.carrera && (
                  <p className="registro__error">{errors.carrera.message}</p>
                )}
              </label>

              <label>
                Rol 
                <br />
                <select
                  className={`registro__select ${
                    errors.rol ? "registro__select-error" : ""
                  }`}
                  {...register("rol", {
                    required: "Este campo es obligatorio",
                  })}
                >
                  <option value="">Seleccionar</option>
                  <option value="Instructora">Instructora</option>
                  <option value="Facilitadora">Facilitadora</option>
                  <option value="Staff">Staff</option>
                </select>
                {errors.rol && <p className="registro__error">{errors.rol.message}</p>}
              </label>

              <div className="registro__contenedor__botonSubmit">
                <button
                  type="submit"
                  className="registro__botonMorado"
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
            </form>
          </div>
        </div>
      </div>
    </>
  );
}
