import './registros.css'


export default function RegistroColaboradores(){
    return(
        <>
            <div className="fondo">
                <div className='register-container'>
                    <div className='card'>
                        <h2 className='titulo'>Registro para staff/ instructoras/facilitadoras</h2>
                        <h4>Información personal
                            <br/>
                            <span className='instructions'>Llenar con datos como aparecen en un documento oficial.</span>
                        </h4>
                        <div className='form'>

                            <label>
                                Nombre(s) del colaborador <span className='mandatory'>*</span>
                                <br />
                                <input name="nombre_colaborador" type="text"/>
                            </label>

                            <label>
                                Apellido paterno del colaborador <span className='mandatory'>*</span>
                                <br />
                                <input name="apellido_paterno_colaborador" type="text"/>
                            </label>

                            <label>
                                Apellido materno del colaborador <span className='mandatory'>*</span>
                                <br />
                                <input name="apellido_materno_colaborador" type="text"/>
                            </label>

                            <label>
                                Correo <span className='mandatory'>*</span>
                                <br />
                                <input name="correo_colaborador" type="email" />
                            </label>

                            <label>
                                Universidad <span className='mandatory'>*</span>
                                <br />
                                <input name="universidad" type="text" />
                            </label>

                            <label>
                                Sede en la que se desea participar <span className="mandatory">*</span><br />
                                <select name="sede_participar">
                                    <option>ITESM Puebla</option>
                                    <option>ITESM Monterrey</option>
                                </select>
                             </label>


                            <div className="input-row">
                                <label>
                                    Idioma de preferencia <span className="mandatory">*</span><br />
                                    <select name="idioma_preferencia">
                                        <option>Español</option>
                                        <option>Inglés</option>
                                    </select>
                                </label>
                                <label>
                                    Nivel de dominio <span className="mandatory">*</span><br />
                                    <select name="nivel_dominio">
                                        <option>Basico</option>
                                        <option>Avanzado</option>
                                    </select>
                                </label>
                            </div>

                            <label>
                                Carrera <span className='mandatory'>*</span>
                                <br />
                                <input name="carrera" type="text" />
                            </label>
                            
                            <label>
                                    Rol <span className="mandatory">*</span><br />
                                    <select name="rol">
                                        <option>Instructora</option>
                                        <option>Facilitadora</option>
                                        <option>Staff</option>
                                    </select>
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