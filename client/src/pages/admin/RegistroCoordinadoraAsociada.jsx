import { useState } from "react";
import { useForm } from "react-hook-form";
import "../../styles/registros.css/";
import axios from "axios";

export default function RegistroSedes() {
  const [error, setError] = useState("");

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
        nombre_coordinadora: data.nombre_coordinadora,
        apellido_paterno_coordinadora: data.apellido_paterno_coordinadora,
        apellido_materno_coordinadora: data.apellido_materno_coordinadora,
        correo_coordinadora: data.correo_coordinadora,
        contraseña: data.contraseña,

        // Sede
        nombre_sede: data.nombre_sede,
        fecha_inicio: data.fecha_inicio,
        archivo_convocatoria: fileName, // The file name, you might need to handle the actual file upload separately
      };

      await axios.post("/api/sedes", sedeData);

      setError("");
    } catch (error) {
      window.alert("Error en el registro");
      console.error("Error:", error);
    }

    setError("");
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
                  errors.nombre_coordinadoraA ? "registro__input-error" : ""
                }`}
                {...register("nombre_coordinadoraA", { required: true })}
                type="text"
              />
              {errors.nombre_coordinadoraA && (
                <p className="registro__error">Este campo es obligatorio</p>
              )}
            </label>

            <label>
              Apellido paterno de la cordinadora asociada{" "}
              <span className="registro__obligatorio">*</span>
              <br />
              <input
                className={`registro__input ${
                  errors.apellido_paterno_coordinadoraA ? "registro__input-error" : ""
                }`}
                {...register("apellido_paterno_coordinadoraA", {
                  required: true,
                })}
                type="text"
              />
              {errors.apellido_paterno_coordinadoraA && (
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
                  errors.correo_coordinadoraA ? "registro__input-error" : ""
                }`}
                {...register("correo_coordinadoraA", { required: true })}
                type="email"
              />
              {errors.correo_coordinadoraA && (
                <p className="registro__error">Correo inválido o vacío</p>
              )}
            </label>

          <div className="registro__contenedor__botonSubmit">
            <input
              type="submit"
              className="registro__botonMorado"
              value="Registrar coordinadora"
            />
          </div>
        </form>
        </div>
      </div>
    </div>
  );
}
