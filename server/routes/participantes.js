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
      sede_deseada,
      idioma,
      nombre_tutor,
      apellido_paterno_tutor,
      apellido_materno_tutor,
      correo_tutor,
      telefono_tutor,
      // archivo_tutor would need file handling
    } = req.body;

    const result = await pool.query(
      `INSERT INTO participante (
        nombre_alumna,
        apellido_paterno,
        apellido_materno,
        correo,
        edad,
        escuela,
        escolaridad,
        sede_deseada,
        idioma,
        nombre_tutor,
        apellido_paterno_tutor,
        apellido_materno_tutor,
        correo_tutor,
        telefono_tutor
      ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14) RETURNING *`,
      [
        nombre_alumna,
        apellido_paterno,
        apellido_materno,
        correo,
        edad,
        escuela,
        escolaridad,
        sede_deseada,
        idioma,
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

export default router;
