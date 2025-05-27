import { useState } from "react";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import "../../styles/registros.css/";
import axios from "axios";

export default function RegistroSedes() {
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm();
  

  const onSubmit = async (data) => {

    try {
      const sedeData = {
        // Coordinatora
        nombre: data.nombre_coordinadora,
        apellido_paterno: data.apellido_paterno_coordinadora,
        apellido_materno: data.apellido_materno_coordinadora,
        correo: data.correo_coordinadora,
      };

      await axios.post("/api/coordinadoras_asociadas", sedeData);

      setError("");

      // Redirigir a la tabla y forzar actualización
      navigate("/admin/inicio", { state: { refresh: true } });
    } catch (error) {
      window.alert("Error en el registro");
      console.error("Error:", error);
    }

    setError("");
    console.log(data);
  };


  return (
    <div className="registroMentora__fondoMorado">
      <div className="register-container-mentora">
      <div className="registro_containerForm">
      <h2 className="registro__titulo">Registro de coordinadora asociada</h2>
        <form
          className="registro__formulario"
          onSubmit={handleSubmit(onSubmit)}
        >
          <h4 className="registro__tituloSeccion">Información personal</h4>
            <p className="registro__instrucciones">
              Llenar con datos como aparecen en un documento oficial.
            </p>
            <label>
              Nombre(s) de la coordinadora asociada <span className="registro__obligatorio">*</span>
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
              Apellido paterno de la cordinadora asociada{" "}
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
              Apellido materno de la coordinadora asociada
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

          <div className="registro__contenedor__botonSubmit">
            <input
              type="submit"
              className="registro__botonMorado"
              value="Registrar coordinadora"
              onClick={() => navigate(`/admin/inicio`)}
            />
          </div>
        </form>
        </div>
      </div>
    </div>
  );
}
