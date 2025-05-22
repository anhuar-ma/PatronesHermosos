import { useState } from "react";
import { useForm } from "react-hook-form";
import {useNavigate} from "react-router-dom";
import "../../styles/registros.css/";
import axios from "axios";

export default function RegistroGrupos() {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitResult, setSubmitResult] = useState(null);
  const navigate = useNavigate();

  const onSubmit = async (data) => {
    setIsSubmitting(true);
    try {
      const grupoData = {
        idioma: data.idioma_grupo,
        nivel: data.nivel_grupo,
        cupo: data.cupo,
      };

      const response = await axios.post("/api/grupos", grupoData);

      setSubmitResult({
        success: true,
        message: "Grupo registrado correctamente ✅",
      });

      window.alert("Grupo registrado correctamente ✅");
      console.log(response.data);

      navigate("/admin/grupos");
    } catch (error) {
      setSubmitResult({
        success: false,
        message: "Error al registrar el Grupo",
      });

      window.alert("Error en el registro");
      console.error("Error:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="registroMentora__fondoMorado">
      <div className="register-container-mentora">
      <div className="registro_containerForm">
      <h2 className="registro__titulo">Agregando grupo nuevo</h2>
        <form
          className="registro__formulario"
          onSubmit={handleSubmit(onSubmit)}
        >
          <h4 className="registro__tituloSeccionGrupo">Información de grupo</h4>

           <div className="registro__container__2inputsInRow">
                <label>
                  Idioma <span className="registro__obligatorio">*</span>
                  <br />
                  <select
                    className={`registro__select ${
                      errors.idioma_grupo ? "registro__select-error" : ""
                    }`}
                    {...register("idioma_grupo", {
                      required: "Este campo es obligatorio",
                    })}
                  >
                    <option value="">Seleccionar</option>
                    <option value="Español">Español</option>
                    <option value="Inglés">Inglés</option>
                  </select>
                  {errors.idioma_grupo && (
                    <p className="registro__error">{errors.idioma_grupo.message}</p>
                  )}
                </label>

                <label>
                  Nivel de grupo <span className="registro__obligatorio">*</span>
                  <br />
                  <select
                    className={`registro__select ${
                      errors.nivel_grupo ? "registro__select-error" : ""
                    }`}
                    {...register("nivel_grupo", {
                      required: "Este campo es obligatorio",
                    })}
                  >
                    <option value="">Seleccionar</option>
                    <option value="Basico">Básico</option>
                    <option value="Avanzado">Avanzado</option>
                  </select>
                  {errors.nivel_grupo && (
                    <p className="registro__error">{errors.nivel_grupo.message}</p>
                  )}
                </label>
              </div>

              <label>
              Cupo (menor a 25) <span className="registro__obligatorio">*</span>
              <br />
              <input
                className={`registro__input ${errors.cupo ? "registro__input-error" : ""}`}
                type="number"
                {...register("cupo", {
                  required: true,
                  max: {
                    value: 25,
                    message: "El cupo debe ser menor a 25",
                  },
                })}
              />
              {errors.cupo && (
                <p className="registro__error">{errors.cupo.message}</p>
              )}
            </label>

            

          <div className="registro__contenedor__botonSubmit">
            <input
              type="submit"
              className="registro__botonMorado"
              value="Registrar grupo"
            />
          </div>
        </form>
        </div>
      </div>
    </div>
  );
}
