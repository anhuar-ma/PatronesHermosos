import { useState } from "react";
import { useForm } from "react-hook-form";
import "../styles/registros.css/";
import axios from "axios";

export default function RegistroSedes() {
  const [fileName, setFileName] = useState("");
  const [fileError, setFileError] = useState("");
  const [error, setError] = useState("");

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  const onSubmit = async (data) => {
    if (!fileName) {
      setFileError("No hay archivo seleccionado");
      return;
    }

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
      setFileError("");
    } catch (error) {
      window.alert("Error en el registro");
      console.error("Error:", error);
    }

    setError("");
    setFileError("");
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
    <div className="fondo">
      <div className="register-container">
        <form className="card" onSubmit={handleSubmit(onSubmit)}>
          <h2 className="titulo">Registro para sedes</h2>

          <h4>
            Información personal
            <br />
            <span className="instructions">
              Llenar con datos como aparecen en un documento oficial.
            </span>
          </h4>

          <div className="form">
            <label>
              Nombre(s) de la coordinadora <span className="mandatory">*</span>
              <br />
              <input
                {...register("nombre_coordinadora", { required: true })}
                type="text"
              />
              {errors.nombre_coordinadora && (
                <p className="error">Este campo es obligatorio</p>
              )}
            </label>

            <label>
              Apellido paterno de la coordinadora{" "}
              <span className="mandatory">*</span>
              <br />
              <input
                {...register("apellido_paterno_coordinadora", {
                  required: true,
                })}
                type="text"
              />
              {errors.apellido_paterno_coordinadora && (
                <p className="error">Este campo es obligatorio</p>
              )}
            </label>

            <label>
              Apellido materno de la coordinadora
              <br />
              <input
                {...register("apellido_materno_coordinadora")}
                type="text"
              />
            </label>

            <label>
              Correo <span className="mandatory">*</span>
              <br />
              <input
                {...register("correo_coordinadora", { required: true })}
                type="email"
              />
              {errors.correo_coordinadora && (
                <p className="error">Correo inválido o vacío</p>
              )}
            </label>

            <div className="input-row">
              <label>
                Contraseña <span className="mandatory">*</span>
                <br />
                <input
                  type="password"
                  autoComplete="new-password"
                  {...register("contraseña", { required: true })}
                />
                {errors.contraseña && (
                  <p className="error">Este campo es obligatorio</p>
                )}
                Verificar contraseña <span className="mandatory">*</span>
                <br />
                <input
                  type="password"
                  autoComplete="new-password"
                  {...register("verificar_contraseña", { required: true })}
                />
                {errors.verificar_contraseña && (
                  <p className="error">Este campo es obligatorio</p>
                )}
              </label>
            </div>

            {error && <p className="error">{error}</p>}
          </div>

          <h4>
            Información de la sede
            <br />
            <span className="instructions">Llenar con datos de la sede.</span>
          </h4>

          <div className="form">
            <label>
              Nombre de Sede (Con este nombre los alumnos seleccionarán la sede){" "}
              <span className="mandatory">*</span>
              <br />
              <input
                {...register("nombre_sede", { required: true })}
                type="text"
              />
              {errors.nombre_sede && (
                <p className="error">Este campo es obligatorio</p>
              )}
            </label>

            <label>
              Convocatoria de la sede <span className="mandatory">*</span>
              <br />
              <input
                type="file"
                name="archivo_convocatoria"
                id="archivo_tutor"
                accept="application/pdf"
                style={{ display: "none" }}
                onChange={handleFileChange}
              />
              <button
                type="button"
                className="gray-button"
                onClick={() => document.getElementById("archivo_tutor").click()}
              >
                Subir archivo
              </button>
              {fileName && <p className="archivo-nombre">{fileName}</p>}
              {fileError && <p className="error">{fileError}</p>}
            </label>

            <label>
              Fecha de inicio <span className="mandatory">*</span>
              <br />
              <select
                {...register("fecha_inicio", { required: true })}
                className="select-personalizado"
              >
                <option value="">Seleccione una fecha</option>
                <option value="7/11/22">7/11/22</option>
                <option value="8/12/22">8/12/22</option>
              </select>
              {errors.fecha_inicio && (
                <p className="error">Este campo es obligatorio</p>
              )}
            </label>
          </div>

          <div className="submit">
            <input
              type="submit"
              className="purple-button"
              value="Enviar Registro"
            />
          </div>
        </form>
      </div>
    </div>
  );
}
