import express from "express";
import { pool } from "../server.js";
import {
  authenticateToken,
  requireAdmin,
  checkSedeAccess,
} from "../middleware/auth.js";

const router = express.Router();

//informante registration
router.post("/", authenticateToken, checkSedeAccess, async (req, res) => {
  try {
    const { nombre, apellido_paterno, apellido_materno, correo } = req.body;

    // Use the sede ID from the authenticated user

    // For admins who don't have a sede ID, they must specify one
    if (req.user.rol === 0) {
      return res.status(400).json({
        success: false,
        message: "Cooridnadoras nacionales tienen que asignar sede",
      });
    }

    // Use provided id_sede for admins
    const id_sede = req.user.id_sede;

    const result = await pool.query(
      `INSERT INTO informante (
          nombre,
          apellido_paterno,
          apellido_materno,
          correo,
          id_sede
      ) VALUES ($1, $2, $3, $4,$5) RETURNING *`,
      [nombre, apellido_paterno, apellido_materno, correo, id_sede],
    );

    res.status(201).json({
      success: true,
      data: result.rows[0],
    });
  } catch (error) {
    console.error("Error creating informante:", error);
    res.status(500).json({
      success: false,
      message: "Error al guardar los datos",
      error: error.message,
    });
  }
});

// Get all informante
router.get("/", authenticateToken, checkSedeAccess, async (req, res) => {
  try {
    let result;

    if (req.user.rol === 0) {
      result = await pool.query(
        `
      SELECT
          i.*,
          CONCAT(i.nombre, ' ', i.apellido_paterno, ' ', i.apellido_materno) AS nombre_completo
      FROM
          informante i
      `,
      );
    } else if (req.user.rol === 1) {
      result = await pool.query(
        `
      SELECT
          i.*,
          CONCAT(i.nombre, ' ', i.apellido_paterno, ' ', i.apellido_materno) AS nombre_completo
      FROM
          informante i
      WHERE id_sede = $1;
      `,
        [req.user.id_sede],
      );
    }

    res.status(200).json({
      success: true,
      data: result.rows,
    });
  } catch (error) {
    console.error("Error fetching informante:", error);
    res.status(500).json({
      success: false,
      message: "Error al obtener los datos",
      error: error.message,
    });
  }
});

// Delete a informante
router.delete("/:id", authenticateToken, checkSedeAccess, async (req, res) => {
  const { id } = req.params;

  try {
    // Get the sede of the informante
    const sedeResult = await pool.query(
      "SELECT id_sede FROM informante WHERE id_informante = $1",
      [id],
    );

    if (sedeResult.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: "informante not found",
      });
    }

    const sede = sedeResult.rows[0].id_sede;

    // Check if coordinator can only delete informantes from their own sede
    if (req.user.rol === 1) {
      if (req.user.id_sede !== sede) {
        return res.status(403).json({
          success: false,
          message: "No tienes permiso para eliminar informante de otra sede",
        });
      }

      // Begin transaction
      await pool.query("BEGIN");

      // First delete records from mentora_grupo table
      await pool.query(
        "DELETE FROM informante WHERE id_sede = $1 AND id_informante = $2",
        [req.user.id_sede, id],
      );

      // Commit transaction
      await pool.query("COMMIT");

      res.json({
        success: true,
        message: "informante eliminada correctamente",
      });
    }
  } catch (error) {
    // Rollback transaction in case of error
    await pool.query("ROLLBACK");

    console.error("Error eliminando informante:", error);
    res.status(500).json({
      success: false,
      message: "Error al eliminando informante",
      error: error.message,
    });
  }
});

export default router;
