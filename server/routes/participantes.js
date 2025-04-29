import express from "express";
import { pool } from "../server.js";

const router = express.Router();

// Handle participant registration
router.post("/", async (req, res) => {
  try {
    const {
      nombre_alumna,
      apellido_paterno,
      apellido_materno,
      correo,
      edad,
      escuela,
      escolaridad,
      // sede deseada
      sede,
      idioma,
      nombre_tutor,
      apellido_paterno_tutor,
      apellido_materno_tutor,
      correo_tutor,
      telefono_tutor,
      // archivo_tutor would need file handling
    } = req.body;

    const result = await pool.query(
      `CALL registro_participante_con_tutor(
       $1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14)`,
      [
        nombre_alumna,
        apellido_paterno,
        apellido_materno,
        edad,
        correo,
        escuela,
        escolaridad,
        // permiso es null
        null,
        idioma,
        //sede es null
        null,
        nombre_tutor,
        apellido_paterno_tutor,
        apellido_materno_tutor,
        correo_tutor,
        telefono_tutor,
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
    const result = await pool.query("SELECT * FROM participante");
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
