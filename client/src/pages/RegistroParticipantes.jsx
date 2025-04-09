import '../styles/registros.css'

export default function RegistroParticipantes(){
    return(
        <>
            <div className="fondo">
                <div className='register-container'>
                    <div className='card'>
                        <h1 className='titulo'>Registro para participantes</h1>
                        <h4>Información personal
                            <br/>
                            <span className='instructions'>Llenar con datos como aparecen en un documento oficial.</span>
                        </h4>
                        <div className='form'>

                            <label>
                                Nombre(s) de la alumna <span className='mandatory'>*</span>
                                <br />
                                <input name="nombre_alumna" />
                            </label>

                            <label>
                                Apellido paterno de la alumna <span className='mandatory'>*</span>
                                <br />
                                <input name="apellido_paterno" />
                            </label>

                            <label>
                                Apellido materno de la alumna <span className='mandatory'>*</span>
                                <br />
                                <input name="apellido_materno" />
                            </label>

                            <label>
                                Correo <span className='mandatory'>*</span>
                                <br />
                                <input name="correo" type="email" />
                            </label>

                            <label>
                                Edad <span className='mandatory'>*</span>
                                <br />
                                <input name="edad" type="number" />
                            </label>

                            
                                <label>
                                    Escuela <span className="mandatory">*</span><br />
                                    <input name="escuela" />
                                </label>
                                <label>
                                    Sede deseada para registro <span className="mandatory">*</span><br />
                                    <select name="sede_deseada" className='select-personalizado' id='sede_deseada'>
                                        <option>ITESM Puebla</option>
                                        <option>ITESM Monterrey</option>
                                    </select>
                                </label>

                               

                            <div className="input-row">
                            <label>
                                    Escolaridad <span className="mandatory">*</span><br />
                                    <select name="escolaridad" className='select-personalizado'>
                                        <option>Secundaria</option>
                                        <option>Preparatoria</option>
                                    </select>
                                </label>
                                
                                
                                <label>
                                    Idioma de preferencia <span className="mandatory">*</span><br />
                                    <select name="idioma" className='select-personalizado'>
                                        <option>Español</option>
                                        <option>Inglés</option>
                                    </select>
                                </label>
                            </div>
                        </div>

                        <h4>Información del tutor
                            <br/>
                            <span className='instructions'>Llenar con datos como aparecen en un documento oficial.</span>
                        </h4>
                        <div className='form'>

                        <label>
                                Nombre(s) del tutor <span className='mandatory'>*</span>
                                <br />
                                <input name="nombre_alumna" />
                            </label>

                            <label>
                                Apellido paterno del tutor <span className='mandatory'>*</span>
                                <br />
                                <input name="apellido_paterno" />
                            </label>

                            <label>
                                Apellido materno del tutor <span className='mandatory'>*</span>
                                <br />
                                <input name="apellido_materno" />
                            </label>

                            <label>
                                Correo del tutor <span className='mandatory'>*</span>
                                <br />
                                <input name="correo" type="email" />
                            </label>

                            <label>
                                Telefono del tutor <span className='mandatory'>*</span>
                                <br />
                                <input name="edad" type="tel" />
                            </label>   
                            <label>
                                Subir archivo del tutor <span className='mandatory'>*</span>
                                <br />
                                <input type="file" name="archivo_tutor" id="archivo_tutor" style={{ display: 'none' }} />
                                <button className="gray-button" onClick={() => document.getElementById('archivo_tutor').click()}>
                                    Subir archivo
                                </button>
                            </label>
                            <div className='submit'>
                            <button className='purple-button'>Enviar Registro</button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    )
}
