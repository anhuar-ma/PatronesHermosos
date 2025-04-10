import { useState } from 'react';
import { useForm } from 'react-hook-form';
import '../styles/registros.css';

export default function RegistroSedes() {
    const [fileName, setFileName] = useState('');
    const [error, setError] = useState('');

    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm();

    const onSubmit = (data) => {
        if (data.contraseña !== data.verificar_contraseña) {
            setError('Las contraseñas no coinciden');
            return;
        }

        setError('');
        alert('Formulario enviado correctamente ✅');
        console.log(data);
    };

    return (
        <div className="fondo">
            <div className='register-container'>
                <form className='card' onSubmit={handleSubmit(onSubmit)}>
                    <h2 className='titulo'>Registro para sedes</h2>

                    <h4>Información personal
                        <br />
                        <span className='instructions'>
                            Llenar con datos como aparecen en un documento oficial.
                        </span>
                    </h4>

                    <div className='form'>
                        <label>
                            Nombre(s) de la coordinadora <span className='mandatory'>*</span>
                            <br />
                            <input 
                                className={errors.nombre_coordinadora ? 'input-error' : ''}
                                {...register("nombre_coordinadora", { required: true })}
                                type="text" 
                            />
                            {errors.nombre_coordinadora && <p className="error">Este campo es obligatorio</p>}
                        </label>

                        <label>
                            Apellido paterno de la coordinadora <span className='mandatory'>*</span>
                            <br />
                            <input
                                className={errors.apellido_paterno_coordinadora ? 'input-error' : ''} 
                                {...register("apellido_paterno_coordinadora", { required: true })} 
                                type="text" 
                            />
                            {errors.apellido_paterno_coordinadora && <p className="error">Este campo es obligatorio</p>}
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
                            Correo <span className='mandatory'>*</span>
                            <br />
                            <input
                                {...register("correo_coordinadora", {
                                    required: "Este campo es obligatorio.",
                                    pattern: {
                                        value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                                        message: "Ingresa un correo electrónico válido."
                                    }
                                })}
                                type="email"
                                className={errors.correo_coordinadora ? 'input-error' : ''}
                            />
                            {errors.correo_coordinadora && (
                                <p className="error">{errors.correo_coordinadora.message}</p>
                            )}
                        </label>

                        <div className="input-row">
                            <label>
                                Contraseña <span className='mandatory'>*</span>
                                <br />
                                <input
                                    className={errors.contraseña ? 'input-error' : ''}
                                    {...register("contraseña", { required: true })}
                                    type="password"
                                    autoComplete="new-password"
                                />
                                {errors.contraseña && <p className="error">Este campo es obligatorio</p>}
                            </label>

                            <label>
                                Verificar contraseña <span className='mandatory'>*</span>
                                <br />
                                <input
                                    className={errors.verificar_contraseña ? 'input-error' : ''}
                                    {...register("verificar_contraseña", { required: true })}
                                    type="password"
                                    autoComplete="new-password"     
                                />
                                {errors.verificar_contraseña && <p className="error">Este campo es obligatorio</p>}
                            </label>
                        </div>

                        {error && <p className="error">{error}</p>}

                        <label>
                            Carrera <span className='mandatory'>*</span>
                            <br />
                            <input 
                                className={errors.carrera ? 'input-error' : ''}
                                {...register("carrera", { required: true })} 
                                type="text" 
                            />
                            {errors.carrera && <p className="error">Este campo es obligatorio</p>}
                        </label>
                    </div>

                    <h4>Información de la sede
                        <br />
                        <span className='instructions'>Llenar con datos de la sede.</span>
                    </h4>

                    <div className='form'>
                        <label>
                            Nombre de Sede (Con este nombre los alumnos seleccionarán la sede) <span className='mandatory'>*</span>
                            <br />
                            <input
                                className={errors.nombre_sede ? 'input-error' : ''}
                                {...register("nombre_sede", { required: true })} 
                                type="text" 
                            />
                            {errors.nombre_sede && <p className="error">Este campo es obligatorio</p>}
                        </label>

                        <label>
                            Convocatoria de la sede <span className='mandatory'>*</span>
                            <br />
                            <input
                                type="file"
                                accept="application/pdf"
                                id="archivo_tutor"
                                style={{ display: 'none' }}
                                {...register("archivo_convocatoria", {
                                    required: "Este campo es obligatorio.",
                                    validate: {
                                        isPdf: (files) => {
                                            const file = files[0];
                                            if (!file) return "No hay archivo seleccionado";
                                            return file.type === "application/pdf" || "Solo se permiten archivos PDF";
                                        }
                                    }
                                })}
                                onChange={(e) => {
                                    const file = e.target.files[0];
                                    if (file) setFileName(file.name);
                                }}
                            />
                            <button
                                type="button"
                                className="gray-button"
                                onClick={() => document.getElementById('archivo_tutor').click()}
                            >
                                Subir archivo
                            </button>
                            {fileName && <p className="archivo-nombre">{fileName}</p>}
                            {errors.archivo_convocatoria && (
                                <p className="error">{errors.archivo_convocatoria.message}</p>
                            )}
                        </label>

                        <label>
                            Fecha de inicio <span className="mandatory">*</span>
                            <br />
                            <select 
                                className={`select-personalizado ${errors.fecha_inicio ? 'select-error' : ''}`}
                                {...register("fecha_inicio", { required: true })} 
                            >
                                <option value="">Seleccione una fecha</option>
                                <option value="7/11/22">7/11/22</option>
                                <option value="8/12/22">8/12/22</option>
                            </select>
                            {errors.fecha_inicio && <p className="error">Este campo es obligatorio</p>}
                        </label>
                    </div>

                    <div className='submit'>
                        <input type="submit" className='purple-button' value="Enviar Registro" />
                    </div>
                </form>
            </div>
        </div>
    );
}
