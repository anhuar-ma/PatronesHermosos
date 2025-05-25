import express from "express";
import { pool } from "../server.js";
import jwt from "jsonwebtoken";
import { JWT_SECRET } from "../config/jwtConfig.js";
import { authenticateToken, checkSedeAccess } from "../middleware/auth.js";
import { sendEmail } from "../routes/emailservices.js";

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
          CONCAT(c.nombre, ' ', c.apellido_paterno, ' ', c.apellido_materno) AS nombre_completo_colaborador,
          c.*,
          s.nombre AS nombre_sede
      FROM
          colaborador c
      LEFT JOIN
          sede s
      ON
          c.id_sede = s.id_sede
      `,
      );
    }
    // Role 1 can only see colaboradores from their sede
    else if (decoded.rol === 1 && decoded.id_sede) {
      result = await pool.query(
        `
      SELECT
          CONCAT(c.nombre, ' ', c.apellido_paterno, ' ', c.apellido_materno) AS nombre_completo_colaborador,
          c.*,
          s.nombre AS nombre_sede
      FROM
          colaborador c
      LEFT JOIN
          sede s
      ON
          c.id_sede = s.id_sede
      WHERE
          c.id_sede = $1;
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

router.get("/:id", async (req, res) => {
  const { id } = req.params;

  try {
    const result = await pool.query(
      `
      SELECT
          c.*,
          s.nombre AS nombre_sede
      FROM
          colaborador c
      LEFT JOIN
          sede s
      ON
          c.id_sede = s.id_sede
      WHERE
          c.id_colaborador = $1;
      `,
      [id],
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ message: "Colabor no encontrado" });
    }

    res.json(result.rows[0]);
  } catch (error) {
    console.error("Error al obtener Colaborador:", error);
    res.status(500).json({ message: "Error del servidor" });
  }
});

router.put("/:id", async (req, res) => {
  const { id } = req.params;
  const {
    id_colaborador,
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
    nombre_sede,
  } = req.body;

  try {
    const result = await pool.query(
      `UPDATE colaborador SET
        nombre = $1,
        apellido_paterno = $2,
        apellido_materno = $3,
        correo = $4,
        universidad = $5,
        idioma = $6,
        id_sede = $7,
        nivel = $8,
        id_grupo = $9,
        carrera = $10,
        rol = $11,
        estado = $12
      WHERE id_colaborador = $13
      RETURNING *`,
      [
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
        id,
      ],
    );

    if (result.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: "Colaborador no encontrado",
      });
    }

    res.json({
      success: true,
      data: result.rows[0],
    });
  } catch (error) {
    console.error("Error al actualizar colaborador:", error);
    res.status(500).json({
      message: "Error al actualizar colaborador",
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
      `UPDATE colaborador SET
        estado = $1
      WHERE id_colaborador = $2`,
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

// Delete colaborador by ID
router.delete("/:id", authenticateToken, checkSedeAccess, async (req, res) => {
  const { id } = req.params;

  try {
    // Begin transaction
    await pool.query("BEGIN");

    // Check if colaborador exists
    const checkResult = await pool.query(
      "SELECT id_colaborador FROM colaborador WHERE id_colaborador = $1",
      [id],
    );

    if (checkResult.rows.length === 0) {
      await pool.query("ROLLBACK");
      return res.status(404).json({
        success: false,
        message: "Colaborador not found",
      });
    }

    // Delete the colaborador
    await pool.query("DELETE FROM colaborador WHERE id_colaborador = $1", [id]);

    // Commit transaction
    await pool.query("COMMIT");

    res.json({
      success: true,
      message: "Colaborador eliminado correctamente",
    });
  } catch (error) {
    // Rollback transaction in case of error
    await pool.query("ROLLBACK");

    console.error("Error eliminando colaborador:", error);
    res.status(500).json({
      success: false,
      message: "Error al eliminar el colaborador",
      error: error.message,
    });
  }
});

router.post("/email/:id", async (req, res) => {
  const { id } = req.params;
  const { estado } = req.body; // Recibe el estado desde el cuerpo de la solicitud

  try {
    // Obtén los datos del colaborador, la sede y la coordinadora desde la base de datos
    const result = await pool.query(
      `SELECT 
         c.nombre AS nombre_colaborador, 
         c.correo AS correo_colaborador, 
         s.nombre AS nombre_sede,
         CONCAT(coor.nombre, ' ', coor.apellido_paterno) AS nombre_completo_coordinadora,
         coor.correo AS correo_coordinadora
       FROM colaborador c
       LEFT JOIN sede s ON c.id_sede = s.id_sede
       LEFT JOIN coordinadora coor ON s.id_coordinadora = coor.id_coordinadora
       WHERE c.id_colaborador = $1`,
      [id],
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ message: "Colaborador no encontrado" });
    }

    const colaborador = result.rows[0];

    // Configura el contenido del correo según el estado
    let subject;
    let html;

    if (estado === "Aceptado") {
      subject = "¡Felicidades! has sido aceptada en Patrones Hermosos";
      html = `
        <p>Saludos cordiales: ${colaborador.nombre_colaborador},</p>
        <p>¡Felicidades! Has sido seleccionada para la sede <strong>${colaborador.nombre_sede || "Sin sede asignada"}</strong>.</p>
        <p>Si tienes alguna duda, ponte en comunicación con la coordinadora de sede:</p>
        <p>${colaborador.nombre_completo_coordinadora || "Sin coordinadora asignada"}</p>
        <p>Correo: ${colaborador.correo_coordinadora || "No disponible"}</p>
        <p>Saludos,</p>
        <p>Campamento Patrones Hermosos</p>
      `;
    } else if (estado === "Rechazado") {
      subject = "Notificación sobre tu solicitud en Patrones Hermosos";
      html = `
        <p>Saludos cordiales: ${colaborador.nombre_colaborador},</p>
        <p>Lamentamos informarte que no has sido seleccionada para participar en esta edición de Patrones Hermosos.</p>
        <p>Agradecemos tu interés y te invitamos a seguir participando en futuras convocatorias.</p>
        <p>Saludos,</p>
        <p>Campamento Patrones Hermosos</p>
      `;
    } else {
      return res.status(400).json({
        success: false,
        message: "Estado no válido. Debe ser 'Aceptado' o 'Rechazado'.",
      });
    }

    // Envía el correo
    await sendEmail(colaborador.correo_colaborador, subject, html);

    res.json({
      success: true,
      message: `Correo enviado a ${colaborador.correo_colaborador}`,
    });
  } catch (error) {
    console.error("Error al enviar el correo:", error);
    res.status(500).json({
      message: "Error al enviar el correo",
      error: error.message,
    });
  }
});

export default router;
