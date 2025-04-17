import { useState } from "react";
import styles from "../styles/inicio_sesion.module.css";

export default function IniciarSesion() {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");
    const [emailError, setEmailError] = useState("");
    const [passwordError, setPasswordError] = useState("");

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError("");
        setSuccess("");
        setEmailError("");
        setPasswordError("");
        setLoading(true);

        const email = e.target.email.value.trim();
        const password = e.target.password.value;

        let hasError = false;

        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

        if (!email) {
            setEmailError("El email es requerido.");
            hasError = true;
        } else if (!emailRegex.test(email)) {
            setEmailError("El email no tiene un formato válido.");
            hasError = true;
        }

        if (!password) {
            setPasswordError("La contraseña es requerida.");
            hasError = true;
        }

        if (hasError) {
            setLoading(false);
            return;
        }

        try {
            const res = await fetch("/api/login", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ email, password }),
            });

            const data = await res.json();

            if (data.success) {
                setSuccess("Inicio de sesión exitoso");
                // Aquí podrías redirigir, guardar token, etc.
            } else {
                setError(data.message || "Error al iniciar sesión.");
            }
        } catch (err) {
            setError("Ocurrió un error en el servidor.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className={styles.contenedor}>
            <div className={styles.fondo_vertical}>
                <h1 className={styles.bienvenida}>¡Bienvenida de nuevo!</h1>
            </div>

            <div className={styles.formulario_contenedor}>
                <form className={styles.formulario} onSubmit={handleSubmit}>
                    <div className={styles.instructions}>
                        <h4 className={styles.login}>Login</h4>
                        <p className={styles.instr}>
                            Bienvenida de nuevo! por favor ingresa tu cuenta.
                        </p>
                    </div>

                    <label className={styles.letter_email}>
                        Email
                        <input type="text" name="email" className={styles.box} />
                        {emailError && <p className={styles.error}>{emailError}</p>}
                    </label>

                    <label className={styles.letter_email}>
                        Contraseña
                        <input type="password" name="password" className={styles.box} />
                        {passwordError && <p className={styles.error}>{passwordError}</p>}
                    </label>

                    <div style={{ display: "flex", justifyContent: "center" }}>
                        <button type="submit" className={styles.boton} disabled={loading}>
                            {loading ? "Cargando..." : "Iniciar sesión"}
                        </button>
                    </div>

                    {error && <p className={styles.error}>{error}</p>}
                    {success && <p className={styles.success}>{success}</p>}
                </form>
            </div>
        </div>
    );
}
