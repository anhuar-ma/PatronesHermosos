import express from "express";
import { pool } from "../server.js";

const router = express.Router();

// Handle participant registration
router.post("/", async (req, res) => {
  try {
    const {
      nombre_coordinadora,
      apellido_paterno_coordinadora,
      apellido_materno_coordinadora,
      correo_coordinadora,
      contraseña,
      nombre_sede,
      fecha_inicio,
      archivo_convocatoria,
    } = req.body;

    const result = await pool.query(
      `CALL registro_sede_con_coordinadora(
       $1, $2, $3, $4, $5, $6, $7, $8)`,
      [
        nombre_coordinadora,
        apellido_paterno_coordinadora,
        apellido_materno_coordinadora,
        correo_coordinadora,
        contraseña,
        nombre_sede,
        fecha_inicio,
        //archivo convocatorias es null
        null,
      ],
    );

    res.status(201).json({
      success: true,
      data: result.rows[0],
    });
  } catch (error) {
    console.error("Error saving participant:", error);
    res.status(500).json({
      success: false,
      message: "Error al guardar los datos",
      error: error.message,
    });
  }
});

// Get all participantes
router.get("/", async (req, res) => {
  try {
    const result = await pool.query("SELECT * FROM sede");
    res.status(200).json({
      success: true,
      data: result.rows,
    });
  } catch (error) {
    console.error("Error fetching colaboradores:", error);
    res.status(500).json({
      success: false,
      message: "Error al obtener los datos",
      error: error.message,
    });
  }
});

export default router;
