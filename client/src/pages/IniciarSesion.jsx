import { useState } from "react";
import styles from "../styles/inicio_sesion.module.css";

export default function IniciarSesion() {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError("");
        setSuccess("");
        setLoading(true);

        const email = e.target.email.value;
        const password = e.target.password.value;

        if (!email || !password) {
            setError("Por favor, completa todos los campos.");
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
                    <label className={styles.letter_email}>
                        Email
                        <input type="text" name="email" className={styles.box} />
                    </label>
                    <label className={styles.letter_email}>
                        Contraseña
                        <input type="password" name="password" className={styles.box} />
                    </label>
                    <button type="submit" className={styles.box} disabled={loading}>
                        {loading ? "Cargando..." : "Iniciar sesión"}
                    </button>

                    {error && <p className={styles.error}>{error}</p>}
                    {success && <p className={styles.success}>{success}</p>}
                </form>
            </div>
        </div>
    );
}
