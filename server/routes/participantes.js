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

// Get participantes with their parents
router.get("/parents", async (req, res) => {
  try {
    const result = await pool.query(`
    SELECT
        participante.id_participante,
        participante.nombre,
        participante.apellido_paterno,
        participante.apellido_materno,
        padre_o_tutor.nombre AS nombre_tutor,
        padre_o_tutor.apellido_paterno AS apellido_paterno_tutor,
        padre_o_tutor.apellido_materno AS apellido_materno_tutor,
        padre_o_tutor.telefono AS telefono_tutor,
        participante.estado,
        participante.id_grupo
    FROM
        participante
    JOIN
        padre_o_tutor
    ON
        participante.id_padre_o_tutor = padre_o_tutor.id_padre_o_tutor;
    `);

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


// Get un participante con su padre o tutor
router.get("/parents/:id", async (req, res) => {
  const { id } = req.params;

  try {
    const result = await pool.query(`
      SELECT
        participante.id_participante,
        participante.nombre,
        participante.apellido_paterno,
        participante.apellido_materno,
        padre_o_tutor.nombre AS nombre_tutor,
        padre_o_tutor.apellido_paterno AS apellido_paterno_tutor,
        padre_o_tutor.apellido_materno AS apellido_materno_tutor,
        padre_o_tutor.telefono AS telefono_tutor,
        participante.estado,
        participante.id_grupo
      FROM
        participante
      JOIN
        padre_o_tutor
      ON
        participante.id_padre_o_tutor = padre_o_tutor.id_padre_o_tutor
      WHERE
        participante.id_participante = $1
    `, [id]);

    if (result.rows.length === 0) {
      return res.status(404).json({ message: "Participante no encontrado" });
    }

    res.json(result.rows[0]);
  } catch (error) {
    console.error("Error al obtener participante:", error);
    res.status(500).json({ message: "Error del servidor" });
  }
});


export default router;
