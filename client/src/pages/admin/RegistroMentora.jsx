import { useState } from "react";
import { useForm } from "react-hook-form";
import {useNavigate} from "react-router-dom";
import "../../styles/registros.css/";
import { FaArrowLeft } from "react-icons/fa";
import axios from "axios";

export default function RegistroMentoras() {
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
      const mentoraData = {
        nombre: data.nombre_mentora,
        apellido_paterno: data.apellido_paterno_mentora,
        apellido_materno: data.apellido_materno_coordinadora,
        correo: data.correo_mentora,
        estado: "Pendiente", // Estado inicial
      };

      const response = await axios.post("/api/mentoras", mentoraData);

      setSubmitResult({
        success: true,
        message: "Mentora registrada correctamente ✅",
      });

      window.alert("Mentora registrada correctamente ✅");
      console.log(response.data);

      navigate("/admin/mentoras");
    } catch (error) {
      setSubmitResult({
        success: false,
        message: "Error al registrar la mentora",
      });

      window.alert("Error en el registro");
      console.error("Error:", error);
    } finally {
      setIsSubmitting(false);
    }
  };
    // Función para regresar
    const handleGoBack = () => {
      navigate(-1);
    };


  return (
    <div className="registroMentora__fondoMorado">
      <div className="register-container-mentora">
      <div className="registro_containerForm">
        <button className="btn-regresar" onClick={handleGoBack}>
            <FaArrowLeft className="btn-regresar__icon" /> Regresar
        </button>
      <h2 className="registro__titulo">Registro de mentora</h2>
        <form
          className="registro__formulario"
          onSubmit={handleSubmit(onSubmit)}
        >
          <h4 className="registro__tituloSeccion">Información personal</h4>
            <p className="registro__instrucciones">
              Llenar con datos como aparecen en un documento oficial.
            </p>
            <label>
              Nombre(s) de la mentora <span className="registro__obligatorio">*</span>
              <br />
              <input
                className={`registro__input ${
                  errors.nombre_mentora ? "registro__input-error" : ""
                }`}
                {...register("nombre_mentora", { required: true })}
                type="text"
              />
              {errors.nombre_mentora && (
                <p className="registro__error">Este campo es obligatorio</p>
              )}
            </label>

            <label>
              Apellido paterno de la mentora{" "}
              <span className="registro__obligatorio">*</span>
              <br />
              <input
                className={`registro__input ${
                  errors.apellido_paterno_mentora ? "registro__input-error" : ""
                }`}
                {...register("apellido_paterno_mentora", {
                  required: true,
                })}
                type="text"
              />
              {errors.apellido_paterno_mentora && (
                <p className="registro__error">Este campo es obligatorio</p>
              )}
            </label>

            <label>
              Apellido materno de la mentora <span className="optional">(opcional)</span>
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
                  errors.correo_mentora ? "registro__input-error" : ""
                }`}
                {...register("correo_mentora", { required: true })}
                type="email"
              />
              {errors.correo_mentora && (
                <p className="registro__error">Correo inválido o vacío</p>
              )}
            </label>

          <div className="registro__contenedor__botonSubmit">
            <input
              type="submit"
              className="registro__botonMorado"
              value="Registrar mentora"
              navigate={navigate}
            />
          </div>
        </form>
        </div>
      </div>
    </div>
  );
}
