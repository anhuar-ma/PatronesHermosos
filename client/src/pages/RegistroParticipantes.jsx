import { useForm } from 'react-hook-form';
import { useState } from 'react';
import '../styles/registros.css'

export default function RegistroParticipantes() {
    const [fileName, setFileName] = useState('');
    const [fileError, setFileError] = useState('');
    const [error, setError] = useState('');

    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm();

    const onSubmit = (data) => {
        if (!fileName) {
            setFileError('No hay archivo seleccionado');
            return;
        }

        setError('');
        setFileError('');
        alert('Formulario enviado correctamente ✅');
        console.log(data);
    };

    const handleFileChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setFileName(file.name);
            setFileError('');
        }
    };

    return (
        <div className="fondo">
            <div className='register-container'>
                <div className='card'>
                    <h1 className='titulo'>Registro para participantes</h1>
                    <h4>Información personal
                        <br />
                        <span className='instructions'>Llenar con datos como aparecen en un documento oficial.</span>
                    </h4>
                    <form className='form' onSubmit={handleSubmit(onSubmit)} noValidate>

                        <label>
                            Nombre(s) de la alumna <span className='mandatory'>*</span><br />
                            <input
                                className={errors.nombre_alumna ? 'input-error' : ''}    
                                {...register("nombre_alumna", { 
                                    required: true 
                                })} 
                            />
                            {errors.nombre_alumna && <p className="error">Este campo es obligatorio</p>}
                        </label>

                        <label>
                            Apellido paterno de la alumna <span className='mandatory'>*</span><br />
                            <input 
                                className={errors.apellido_paterno_alumna ? 'input-error' : ''}  
                                {...register("apellido_paterno_alumna", { 
                                    required: true 
                                })} 
                            />
                            {errors.apellido_paterno_alumna && <p className="error">Este campo es obligatorio</p>}
                        </label>

                        <label>
                            Apellido materno de la alumna<br />
                            <input 
                                {...register("apellido_materno_alumna", { 
                                    required: false 
                                })} 
                            />
                            {errors.apellido_materno_alumna && <p className="error">Este campo es obligatorio</p>}
                        </label>

                        <label>
                            Correo <span className='mandatory'>*</span><br />
                            {/* <input type="email" {...register("correo_alumna", { required: true })} />
                            {errors.correo_alumna && <p className="error">Este campo es obligatorio</p>} */}
                            <input
                                className={errors.correo_alumna ? 'input-error' : ''}
                                type="email"
                                {...register("correo_alumna", {
                                    required: "Este campo es obligatorio.",
                                    pattern: {
                                    value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                                    message: "Ingresa un correo electrónico válido."
                                    }
                                })} 
                            />
                            {errors.correo_alumna && (
                            <p className="error">{errors.correo_alumna.message}</p>
                            )}
                        </label>

                        <label>
                            Edad <span className='mandatory'>*</span><br />
                            <input 
                                className={errors.edad_alumna ? 'input-error' : ''}
                                type="number" 
                                {...register("edad_alumna", { 
                                    required: true 
                                })} 
                            />
                            {errors.edad_alumna && <p className="error">Este campo es obligatorio</p>}
                        </label>

                        <label>
                            Escuela <span className="mandatory">*</span><br />
                            <input
                                className={errors.escuela ? 'input-error' : ''} 
                                {...register("escuela", { 
                                    required: true 
                                })} 
                            />
                            {errors.escuela && <p className="error">Este campo es obligatorio</p>}
                        </label>

                        <label>
                            Sede deseada para registro <span className="mandatory">*</span><br />
                            <select 
                                className={`select-personalizado ${errors.sede_deseada ? 'select-error' : ''}`} 
                                {...register("sede_deseada", { 
                                    required: true 
                                })}
                            >
                                <option value="">Seleccionar</option>
                                <option>ITESM Puebla</option>
                                <option>ITESM Monterrey</option>
                            </select>
                            {errors.sede_deseada && <p className="error">Este campo es obligatorio</p>}
                        </label>

                        <div className="input-row">
                            <label>
                                Escolaridad <span className="mandatory">*</span><br />
                                <select 
                                    className={`select-personalizado ${errors.escolaridad ? 'select-error' : ''}`}  
                                    {...register("escolaridad", { 
                                        required: true 
                                    })}
                                >
                                    <option value="">Seleccionar</option>
                                    <option>Secundaria</option>
                                    <option>Preparatoria</option>
                                </select>
                                {errors.escolaridad && <p className="error">Este campo es obligatorio</p>}
                            </label>

                            <label>
                                Idioma de preferencia <span className="mandatory">*</span><br />
                                <select 
                                    className={`select-personalizado ${errors.escolaridad ? 'select-error' : ''}`}  
                                    {...register("idioma", { 
                                        required: true 
                                    })}
                                >
                                    <option value="">Seleccionar</option>
                                    <option>Español</option>
                                    <option>Inglés</option>
                                </select>
                                {errors.idioma && <p className="error">Este campo es obligatorio</p>}
                            </label>
                        </div>

                        <h4>Información del tutor
                            <br />
                            <span className='instructions'>Llenar con datos como aparecen en un documento oficial.</span>
                        </h4>

                        <label>
                            Nombre(s) del tutor <span className='mandatory'>*</span><br />
                            <input   
                                className={errors.nombre_tutor ? 'input-error' : ''} 
                                {...register("nombre_tutor", { 
                                    required: true 
                                })} 
                            />
                            {errors.nombre_tutor && <p className="error">Este campo es obligatorio</p>}
                        </label>

                        <label>
                            Apellido paterno del tutor <span className='mandatory'>*</span><br />
                            <input 
                                className={errors.apellido_paterno_tutor ? 'input-error' : ''} 
                                {...register("apellido_paterno_tutor", { 
                                required: true 
                            })} 
                            />
                            {errors.apellido_paterno_tutor && <p className="error">Este campo es obligatorio</p>}
                        </label>

                        <label>
                            Apellido materno del tutor <br />
                            <input 
                                className={errors.apellido_materno_tutor ? 'input-error' : ''}  
                                {...register("apellido_materno_tutor", { 
                                    required: false 
                                })} 
                            />
                            {errors.apellido_materno_tutor && <p className="error">Este campo es obligatorio</p>}
                        </label>

                        <label>
                            Correo del tutor <span className='mandatory'>*</span><br />
                            {/* <input type="email" {...register("correo_tutor", { required: true })} />
                            {errors.correo_tutor && <p className="error">Este campo es obligatorio</p>} */}

                            <input
                                className={errors.correo_tutor ? 'input-error' : ''}
                                type="email"
                                {...register("correo_tutor", {
                                    required: "Este campo es obligatorio.",
                                    pattern: {
                                    value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                                    message: "Ingresa un correo electrónico válido."
                                    }
                                })}  
                            />
                            {errors.correo_tutor && (
                            <p className="error">{errors.correo_tutor.message}</p>
                            )}
                        </label>

                        <label>
                            Teléfono del tutor <span className='mandatory'>*</span><br />
                            <input 
                                className={errors.telefono_tutor ? 'input-error' : ''}
                                type="tel" 
                                {...register("telefono_tutor", { 
                                    required: true })} 
                                
                            />
                            {errors.telefono_tutor && <p className="error">Este campo es obligatorio</p>}
                        </label>

                        <label>
                            Subir archivo del tutor <span className='mandatory'>*</span><br />
                            <input
                                type="file"
                                name="archivo_tutor"
                                id="archivo_tutor"
                                onChange={handleFileChange}
                                style={{ display: 'none' }}
                            />
                            <button
                                type="button"
                                className="gray-button"
                                onClick={() => document.getElementById('archivo_tutor').click()}
                            >
                                Subir archivo
                            </button>
                            {fileName && <span className="archivo-subido">{fileName}</span>}
                            {fileError && <p className="error">{fileError}</p>}
                        </label>

                        <div className='submit'>
                            <button type="submit" className='purple-button'>Enviar Registro</button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
}
