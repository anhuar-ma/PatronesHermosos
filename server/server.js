import express from "express";
import pkg from "pg";
const { Pool } = pkg;
import cors from "cors";
import bodyParser from "body-parser";

const app = express();
const port = 5000;

// Middleware
app.use(cors());
app.use(bodyParser.json());

// PostgreSQL connection
const pool = new Pool({
  user: "anhuar",
  host: "localhost",
  database: "patroneshermosos",
  password: "",
});

// API endpoint to handle colaborador registration
app.post("/api/colaboradores", async (req, res) => {
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
        null,
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

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
