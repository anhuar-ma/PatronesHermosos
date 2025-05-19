import express from "express";
import { pool } from "../server.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { JWT_SECRET } from "../config/jwtConfig.js";
import { authenticateToken, checkSedeAccess, requireAdmin } from "../middleware/auth.js";

const router = express.Router();

// Handle sedes registration
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
    // Extract the token from Authorization header
    const token = req.header("Authorization")?.replace("Bearer ", "");

    if (!token) {
      return res.status(401).json({
        success: false,
        message: "Authentication required ",
      });
    }

    // Verify and decode the token
    const decoded = jwt.verify(token, JWT_SECRET);
    //cambiar a simplemente coreo
    if (decoded.rol === 0) {
      const result = await pool.query(
        `SELECT
          CONCAT(coordinadora.nombre, ' ', coordinadora.apellido_paterno, ' ', coordinadora.apellido_materno) AS nombre_completo_coordinadora,
          coordinadora.correo,
          sede.id_sede,
          sede.nombre AS nombre_sede,
          sede.fecha_inicio,
          sede.convocatoria,
          sede.estado
      FROM
          coordinadora
      JOIN
          sede
      ON
          coordinadora.id_coordinadora = sede.id_coordinadora AND coordinadora.rol = 1;
      `,
      );

      res.status(200).json({
        success: true,
        data: result.rows,
        message: "Mostrado Sedes y coordinadoras correcto",
      });
    } else {
      return res.status(403).json({
        success: false,
        message: "Insufficient permissions",
      });
    }
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

// Get the names from sedes that are accepeted
router.get("/nombres", async (req, res) => {
  try {
    const result = await pool.query(
      "SELECT id_sede,nombre FROM sede WHERE estado = 'Aceptado'",
    );
    res.status(200).json({
      success: true,
      data: result.rows,
    });
  } catch (error) {
    console.error("Error fetching nombres sedes:", error);
    res.status(500).json({
      success: false,
      message: "Error al obtener los datos",
      error: error.message,
    });
  }
});

// vista detallada sede y coordinadora
router.get("/:id", async (req, res) => {
  const { id } = req.params;
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
    //cambiar a simplemente coreo
    if (decoded.rol === 0) {
      const result = await pool.query(
        `
SELECT coordinadora.id_coordinadora,
       coordinadora.nombre,
       coordinadora.apellido_paterno,
       coordinadora.apellido_materno,
       coordinadora.correo,
       sede.id_sede,
       sede.nombre AS nombre_sede,
       sede.fecha_inicio,
       sede.convocatoria,
       sede.estado
FROM coordinadora
         JOIN
     sede
     ON
         coordinadora.id_coordinadora = sede.id_coordinadora
WHERE coordinadora.rol = 1
  AND sede.id_sede = $1
      `,
        [id],
      );

      res.status(200).json({
        success: true,
        data: result.rows,
        message: "Mostrado Sedes y coordinadoras correcto",
      });
    } else {
      return res.status(403).json({
        success: false,
        message: "Insufficient permissions",
      });
    }
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

router.put("/:id",checkSedeAccess,authenticateToken,requireAdmin, async (req, res) => {
  const { id } = req.params;
  try {

    const {
      id_coordinadora,
      nombre,
      apellido_paterno,
      apellido_materno,
      correo,
      nombre_sede,
      fecha_inicio,
      convocatoria,
    } = req.body;

    // Begin transaction
    await pool.query('BEGIN');

    // Update coordinadora table
    await pool.query(
      `UPDATE coordinadora
       SET nombre = $1,
           apellido_paterno = $2,
           apellido_materno = $3,
           correo = $4
       WHERE id_coordinadora = $5`,
      [nombre, apellido_paterno, apellido_materno, correo, id_coordinadora]
    );

    // Update sede table
    await pool.query(
      `UPDATE sede
       SET nombre = $1,
           fecha_inicio = $2,
           convocatoria = $3
       WHERE id_sede = $4`,
      [nombre_sede, fecha_inicio, convocatoria, id]
    );

    // Commit transaction
    await pool.query('COMMIT');



      res.status(200).json({
        success: true,
        message: "Sede y coordinadora actualizada correctamente",
      });

  } catch (error) {
    console.error("Error updating coordinadora y sede:", error);

    // Check if error is from JWT verification
    if (error.name === "JsonWebTokenError") {
      return res.status(401).json({
        success: false,
        message: "Invalid token",
      });
    }

    res.status(500).json({
      success: false,
      message: "Error al actualizar los datos",
      error: error.message,
    });
  }
});

// Update estado
router.put("/estado/:id", async (req, res) => {
  const { id } = req.params;
  const { estado } = req.body;

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
    //cambiar a simplemente coreo
    if (decoded.rol === 0) {
      // Actualizar participante
      await pool.query(
        `UPDATE sede SET
        estado = $1
      WHERE id_sede = $2`,
        [estado, id],
      );
    } else {
      return res.status(403).json({
        success: false,
        message: "Insufficient permissions",
      });
    }

    res.json({
      success: true,
      message: "Sede y coordinadora actualizado correctamente",
    });
  } catch (error) {
    console.error("Error actualizando coordinadora y sede:", error);

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

// Delete sede and coordinadora by sede ID
router.delete("/:id", authenticateToken, requireAdmin, async (req, res) => {
  const { id } = req.params;

  try {
    if (decoded.rol === 0) {
      // First get the coordinadora ID associated with this sede
      const sedeResult = await pool.query(
        "SELECT id_coordinadora FROM sede WHERE id_sede = $1",
        [id],
      );

      if (sedeResult.rows.length === 0) {
        return res.status(404).json({
          success: false,
          message: "Sede not found",
        });
      }

      const coordinadoraId = sedeResult.rows[0].id_coordinadora;

      // Begin transaction
      await pool.query("BEGIN");

      // Delete sede first (due to foreign key constraints)
      await pool.query("DELETE FROM sede WHERE id_sede = $1", [id]);

      // Then delete the coordinadora
      await pool.query(
        "DELETE FROM coordinadora WHERE id_coordinadora = $1 AND rol = 1",
        [coordinadoraId],
      );

      // Commit transaction
      await pool.query("COMMIT");

      res.json({
        success: true,
        message: "Sede y coordinadora eliminados correctamente",
      });
    } else {
      return res.status(403).json({
        success: false,
        message: "Insufficient permissions",
      });
    }
  } catch (error) {
    // Rollback transaction in case of error
    await pool.query("ROLLBACK");

    console.error("Error eliminando sede y coordinadora:", error);

    // Check if error is from JWT verification
    if (error.name === "JsonWebTokenError") {
      return res.status(401).json({
        success: false,
        message: "Invalid token",
      });
    }

    res.status(500).json({
      success: false,
      message: "Error al eliminar los datos",
      error: error.message,
    });
  }
});

export default router;
