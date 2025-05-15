import express from "express";
import { pool } from "../server.js";
import jwt from "jsonwebtoken";
import { JWT_SECRET } from "../config/jwtConfig.js";

const router = express.Router();

// Handle participant registration
router.post("/", async (req, res) => {
  try {
    const {
      nombre_alumna,
      apellido_paterno,
      apellido_materno,
      edad,
      correo,
      escuela,
      escolaridad,
      // sede deseada
      sede_deseada,
      idioma,
      nombre_tutor,
      apellido_paterno_tutor,
      apellido_materno_tutor,
      correo_tutor,
      telefono_tutor,
      // archivo_tutor would need file handling
    } = req.body;

    console.log("ESTA ES LA SEDE:", sede_deseada);
    console.log(req.body);
    const result = await pool.query(
      `CALL registro_participante_con_tutor(
       $1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15)`,
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
        sede_deseada,
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
      result = await pool.query(`
      SELECT
          CONCAT(p.nombre, ' ', p.apellido_paterno, ' ', p.apellido_materno) AS participante_nombre,
          CONCAT(t.nombre, ' ', t.apellido_paterno, ' ', t.apellido_materno) AS tutor_nombre,
          p.id_participante AS participante_id,
          p.edad AS participante_edad,
          p.correo AS participante_correo,
          p.id_padre_o_tutor AS participante_id_padre_o_tutor,
          p.id_sede AS participante_id_sede,
          p.escuela AS participante_escuela,
          p.escolaridad AS participante_escolaridad,
          p.permiso_padre_tutor AS participante_permiso_padre_tutor,
          p.idioma AS participante_idioma,
          p.estado AS participante_estado,
          t.id_padre_o_tutor AS tutor_id,
          t.correo AS tutor_correo,
          t.telefono AS tutor_telefono,
          s.nombre AS nombre_sede
      FROM
          participante p
      LEFT JOIN
          padre_o_tutor t
      ON
          p.id_padre_o_tutor = t.id_padre_o_tutor
      LEFT JOIN
          sede s
      ON
          p.id_sede = s.id_sede;

    `);
    }
    // Role 1 can only see colaboradores from their sede
    else if (decoded.rol === 1 && decoded.id_sede) {
      result = await pool.query(`
      SELECT
          CONCAT(p.nombre, ' ', p.apellido_paterno, ' ', p.apellido_materno) AS participante_nombre,
          CONCAT(t.nombre, ' ', t.apellido_paterno, ' ', t.apellido_materno) AS tutor_nombre,
          p.id_participante AS participante_id,
          p.edad AS participante_edad,
          p.correo AS participante_correo,
          p.id_padre_o_tutor AS participante_id_padre_o_tutor,
          p.id_sede AS participante_id_sede,
          p.escuela AS participante_escuela,
          p.escolaridad AS participante_escolaridad,
          p.permiso_padre_tutor AS participante_permiso_padre_tutor,
          p.idioma AS participante_idioma,
          p.estado AS participante_estado,
          t.id_padre_o_tutor AS tutor_id,
          t.correo AS tutor_correo,
          t.telefono AS tutor_telefono,
          s.nombre AS nombre_sede
      FROM
          participante p
      LEFT JOIN
          padre_o_tutor t
      ON
          p.id_padre_o_tutor = t.id_padre_o_tutor
      LEFT JOIN
          sede s
      ON
          p.id_sede = s.id_sede;
          WHERE p.id_sede = $1
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
    console.error("Error fetching colaboradores:", error);

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

// Get un participante con su padre o tutor
router.get("/parents/:id", async (req, res) => {
  const { id } = req.params;

  try {
    const result = await pool.query(
      `
      SELECT
        participante.id_participante,
        participante.nombre,
        participante.apellido_paterno,
        participante.apellido_materno,
        participante.correo,
        padre_o_tutor.nombre AS nombre_tutor,
        padre_o_tutor.apellido_paterno AS apellido_paterno_tutor,
        padre_o_tutor.apellido_materno AS apellido_materno_tutor,
        padre_o_tutor.telefono AS telefono_tutor,
        padre_o_tutor.correo AS correo_tutor,
        participante.estado,
        participante.escuela,
        participante.escolaridad,
        participante.idioma,
        participante.edad,
        participante.id_grupo
      FROM
        participante
      JOIN
        padre_o_tutor
      ON
        participante.id_padre_o_tutor = padre_o_tutor.id_padre_o_tutor
      WHERE
        participante.id_participante = $1
    `,
      [id],
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ message: "Participante no encontrado" });
    }

    res.json(result.rows[0]);
  } catch (error) {
    console.error("Error al obtener participante:", error);
    res.status(500).json({ message: "Error del servidor" });
  }
});

// Editar un participante y su tutor
router.put("/:id", async (req, res) => {
  const { id } = req.params;
  const {
    nombre,
    apellido_paterno,
    apellido_materno,
    correo,
    edad,
    escuela,
    escolaridad,
    idioma,
    id_grupo,
    nombre_tutor,
    apellido_paterno_tutor,
    apellido_materno_tutor,
    correo_tutor,
    telefono_tutor,
  } = req.body;

  try {
    // Obtener ID del tutor relacionado
    const tutorResult = await pool.query(
      "SELECT id_padre_o_tutor FROM participante WHERE id_participante = $1",
      [id],
    );

    if (tutorResult.rows.length === 0) {
      return res.status(404).json({ message: "Participante no encontrado" });
    }

    const id_tutor = tutorResult.rows[0].id_padre_o_tutor;

    // Actualizar participante
    await pool.query(
      `UPDATE participante SET
        nombre = $1,
        apellido_paterno = $2,
        apellido_materno = $3,
        correo = $4,
        edad = $5,
        escuela = $6,
        escolaridad = $7,
        idioma = $8,
        id_grupo = $9
      WHERE id_participante = $10`,
      [
        nombre,
        apellido_paterno,
        apellido_materno,
        correo,
        edad,
        escuela,
        escolaridad,
        idioma,
        id_grupo,
        id,
      ],
    );

    // Actualizar tutor
    await pool.query(
      `UPDATE padre_o_tutor SET
        nombre = $1,
        apellido_paterno = $2,
        apellido_materno = $3,
        correo = $4,
        telefono = $5
      WHERE id_padre_o_tutor = $6`,
      [
        nombre_tutor,
        apellido_paterno_tutor,
        apellido_materno_tutor,
        correo_tutor,
        telefono_tutor,
        id_tutor,
      ],
    );

    res.json({
      success: true,
      message: "Participante actualizado correctamente",
    });
  } catch (error) {
    console.error("Error al actualizar participante:", error);
    res.status(500).json({
      message: "Error al actualizar participante",
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
      `UPDATE participante SET
        estado = $1
      WHERE id_participante = $2`,
      [estado, id],
    );

    res.json({
      success: true,
      message: "Participante actualizado correctamente",
    });
  } catch (error) {
    console.error("Error al actualizar participante:", error);
    res.status(500).json({
      message: "Error al actualizar participante",
      error: error.message,
    });
  }
});

export default router;
