import express from "express";
import { pool } from "../server.js";

const router = express.Router();

// Handle colaborador registration
router.post("/", async (req, res) => {
  try {
    const {
      nombre,
      apellido_paterno,
      apellido_materno,
      correo,
      universidad,
      idioma,
      id_sede,
      nivel,
      id_grupo,
      carrera,
      rol,
      estado,
    } = req.body;

    const result = await pool.query(
      `INSERT INTO colaborador (
        nombre, 
        apellido_paterno, 
        apellido_materno, 
        correo, 
        universidad, 
        idioma, 
        id_sede, 
        nivel, 
        id_grupo, 
        carrera, 
        rol,
        estado
      ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12) RETURNING *`,
      [
        nombre,
        apellido_paterno,
        apellido_materno,
        correo,
        universidad,
        idioma,
        id_sede, // Fixing the issue from original code where id_sede was set to null
        nivel,
        id_grupo,
        carrera,
        rol,
        estado,
      ],
    );

    res.status(201).json({
      success: true,
      data: result.rows[0],
    });
  } catch (error) {
    console.error("Error saving colaborador:", error);
    res.status(500).json({
      success: false,
      message: "Error al guardar los datos",
      error: error.message,
    });
  }
});

// Get all colaboradores
router.get("/", async (req, res) => {
  try {
    const result = await pool.query("SELECT * FROM colaborador");
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
