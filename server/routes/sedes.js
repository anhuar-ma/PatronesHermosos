import express from "express";
import { pool } from "../server.js";
import bcrypt from "bcrypt";

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

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(contraseña, salt);

    const result = await pool.query(
      `CALL registro_sede_con_coordinadora(
       $1, $2, $3, $4, $5, $6, $7, $8)`,
      [
        nombre_coordinadora,
        apellido_paterno_coordinadora,
        apellido_materno_coordinadora,
        correo_coordinadora,
        hashedPassword,
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

// Get sedes and their respective coordinadoras
router.get("/", async (req, res) => {
  try {
    const result = await pool.query(
      `SELECT
          CONCAT(coordinadora.nombre, ' ', coordinadora.apellido_paterno, ' ', coordinadora.apellido_materno) AS nombre_completo_coordinadora,
          sede.id_sede,   
          coordinadora.correo AS correo_coordinadora,
          sede.nombre AS nombre_sede,
          sede.fecha_inicio,
          sede.estado
      FROM
          coordinadora
      JOIN
          sede
      ON
          coordinadora.id_coordinadora = sede.id_coordinadora;
      `,
    );
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

// Get the names from sedes that are accepeted
router.get("/nombres", async (req, res) => {
  try {
    const result = await pool.query(
      "SELECT nombre FROM sede WHERE estado = 'Aceptado'",
    );
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
