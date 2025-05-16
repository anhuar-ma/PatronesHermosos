import express from "express";
import { pool } from "../server.js";
import jwt from "jsonwebtoken";
import { JWT_SECRET } from "../config/jwtConfig.js";

const router = express.Router();

// Handle colaborador registration
router.post("/", async (req, res) => {
  try {
    // Extract the token from Authorization header
    const token = req.header("Authorization")?.replace("Bearer ", "");

    if (!token) {
      return res.status(401).json({
        success: false,
        message: "Authentication required",
      });
    }

    // Verify and decode the token
    const decoded = jwt.verify(token, JWT_SECRET);

    let id_sede = decoded.id_sede;

    if (id_sede === null) {
      res.status(400).json({
        success: false,
        message: "Error al obtener los de la sede de la coordinadora",
      });
    }

    const { nombre, apellido_paterno, apellido_materno, correo } = req.body;

    const result = await pool.query(
      `INSERT INTO mentora (
        nombre,
        apellido_paterno,
        apellido_materno,
        correo,
       id_sede
      ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12) RETURNING *`,
      [nombre, apellido_paterno, apellido_materno, correo, id_sede],
    );

    res.status(201).json({
      success: true,
      data: result.rows[0],
    });
  } catch (error) {
    console.error("Error saving mentora:", error);
    res.status(500).json({
      success: false,
      message: "Error al guardar los datos",
      error: error.message,
    });
  }
});

router.get("/", async (req, res) => {
  try {
    // Extract the token from Authorization header
    const token = req.header("Authorization")?.replace("Bearer ", "");

    if (!token) {
      return res.status(401).json({
        success: false,
        message: "Authentication required",
      });
    }

    // Verify and decode the token
    const decoded = jwt.verify(token, JWT_SECRET);

    let result;

    // Role 0 can see all colaboradores
    if (decoded.rol === 0) {
      result = await pool.query(
        `
      SELECT
          CONCAT(m.nombre, ' ', m.apellido_paterno, ' ', m.apellido_materno) AS nombre_completo_mentora,
          m.*,
          s.nombre AS nombre_sede
      FROM
          mentora m
      LEFT JOIN
          sede s
      ON
          m.id_sede = s.id_sede
      `,
      );
    }
    // Role 1 can only see colaboradores from their sede
    else if (decoded.rol === 1 && decoded.id_sede) {
      result = await pool.query(
        `
      SELECT
          CONCAT(m.nombre, ' ', m.apellido_paterno, ' ', m.apellido_materno) AS nombre_completo_mentora,
          m.*,
          s.nombre AS nombre_sede
      FROM
          mentora m
      LEFT JOIN
          sede s
      ON
          m.id_sede = s.id_sede
      WHERE
          m.id_sede = $1;
      `,
        [decoded.id_sede],
      );
    } else {
      return res.status(403).json({
        success: false,
        message: "Insufficient permissions",
      });
    }

    res.status(200).json({
      success: true,
      data: result.rows,
    });
  } catch (error) {
    console.error("Error fetching mentoras:", error);

    // Check if error is from JWT verification
    if (error.name === "JsonWebTokenError") {
      return res.status(401).json({
        success: false,
        message: "Invalid token",
      });
    }

    res.status(500).json({
      success: false,
      message: "Error al obtener los datos",
      error: error.message,
    });
  }
});

router.get("/:id", async (req, res) => {
  const { id } = req.params;

  try {
    const result = await pool.query(
      `
      SELECT
          m.*,
          s.nombre AS nombre_sede
      FROM
          mentora c
      LEFT JOIN
          sede s
      ON
          m.id_sede = s.id_sede
      WHERE
          m.id_colaborador = $1;
      `,
      [id],
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ message: "Mentora no encontrada" });
    }

    res.json(result.rows[0]);
  } catch (error) {
    console.error("Error al obtener Mentora:", error);
    res.status(500).json({ message: "Error del servidor" });
  }
});

//Editar mentora
router.put("/:id", async (req, res) => {
  const { id } = req.params;
  const { nombre, apellido_paterno, apellido_materno, correo } = req.body;

  try {
    const result = await pool.query(
      `UPDATE mentora SET
        nombre = $1,
        apellido_paterno = $2,
        apellido_materno = $3,
        correo = $4,
      WHERE id_mentora = $5,
      RETURNING *`,
      [nombre, apellido_paterno, apellido_materno, correo, id],
    );

    if (result.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: "Mentora no encontrado",
      });
    }

    res.json({
      success: true,
      data: result.rows[0],
    });
  } catch (error) {
    console.error("Error al actualizar mentora:", error);
    res.status(500).json({
      message: "Error al actualizar mentora",
      error: error.message,
    });
  }
});

// Update estado
router.put("/estado/:id", async (req, res) => {
  const { id } = req.params;
  const { estado } = req.body;

  try {
    // Actualizar participante
    await pool.query(
      `UPDATE mentora SET
        estado = $1
      WHERE id_mentora = $2`,
      [estado, id],
    );

    res.json({
      success: true,
      message: "Colaborador actualizado correctamente",
    });
  } catch (error) {
    console.error("Error al actualizar Colaborador:", error);
    res.status(500).json({
      message: "Error al actualizar colaborador",
      error: error.message,
    });
  }
});

export default router;
