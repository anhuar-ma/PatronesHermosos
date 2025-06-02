import { useState } from "react";
import { useForm } from "react-hook-form";
import {useNavigate} from "react-router-dom";
import "../../styles/registros.css/";
import { FaArrowLeft } from "react-icons/fa";
import axios from "axios";

export default function RegistroContactoInformes() {
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
        nombre: data.nombre_contacto,
        apellido_paterno: data.apellido_paterno_contacto,
        apellido_materno: data.apellido_materno_contacto,
        correo: data.correo_contacto,
      };

      const response = await axios.post("/api/informantes", mentoraData);

      setSubmitResult({
        success: true,
        message: "Contacto registrada correctamente ✅",
      });

      window.alert("Contacto registrada correctamente ✅");
      console.log(response.data);

      navigate("/admin/contacto");
    } catch (error) {
      setSubmitResult({
        success: false,
        message: "Error al registrar el contacto",
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
      <h2 className="registro__titulo">Registro de contacto para informes</h2>
        <form
          className="registro__formulario"
          onSubmit={handleSubmit(onSubmit)}
        >
          <h4 className="registro__tituloSeccion">Información personal</h4>
            <p className="registro__instrucciones">
              Llenar con datos como aparecen en un documento oficial.
            </p>
            <label>
              Nombre(s) del contacto <span className="registro__obligatorio">*</span>
              <br />
              <input
                className={`registro__input ${
                  errors.nombre_contacto ? "registro__input-error" : ""
                }`}
                {...register("nombre_contacto", { required: true })}
                type="text"
              />
              {errors.nombre_contacto && (
                <p className="registro__error">Este campo es obligatorio</p>
              )}
            </label>

            <label>
              Apellido paterno del contacto{" "}
              <span className="registro__obligatorio">*</span>
              <br />
              <input
                className={`registro__input ${
                  errors.apellido_paterno_contacto ? "registro__input-error" : ""
                }`}
                {...register("apellido_paterno_contacto", {
                  required: true,
                })}
                type="text"
              />
              {errors.apellido_paterno_contacto && (
                <p className="registro__error">Este campo es obligatorio</p>
              )}
            </label>

            <label>
              Apellido materno del contacto
              <br />
              <input
                className="registro__input"
                {...register("apellido_materno_contacto")}
                type="text"
              />
            </label>

            <label>
              Correo <span className="registro__obligatorio">*</span>
              <br />
              <input
                className={`registro__input ${
                  errors.correo_contacto ? "registro__input-error" : ""
                }`}
                {...register("correo_contacto", { required: true })}
                type="email"
              />
              {errors.correo_contacto && (
                <p className="registro__error">Correo inválido o vacío</p>
              )}
            </label>

          <div className="registro__contenedor__botonSubmit">
            <input
              type="submit"
              className="registro__botonMorado"
              value="Registrar contacto"
              navigate={navigate}
            />
          </div>
        </form>
        </div>
      </div>
    </div>
  );
}
