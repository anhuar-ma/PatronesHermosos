import express from "express";
import { pool } from "../server.js";
import {
  authenticateToken,
  requireAdmin,
  checkSedeAccess,
} from "../middleware/auth.js";

const router = express.Router();

//coordinadora_asociada registration
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
      `INSERT INTO coordinadora_asociada (
          nombre,
          apellido_paterno,
          apellido_materno,
          correo,
          id_sede,
          estado
      ) VALUES ($1, $2, $3, $4,$5,$6) RETURNING *`,
      [
        nombre,
        apellido_paterno,
        apellido_materno,
        correo,
        id_sede,
        "Pendiente",
      ],
    );

    res.status(201).json({
      success: true,
      data: result.rows[0],
    });
  } catch (error) {
    console.error("Error creating coordinadora_asociada:", error);
    res.status(500).json({
      success: false,
      message: "Error al guardar los datos",
      error: error.message,
    });
  }
});

// Get all coordinadora_asociada
router.get("/", authenticateToken, checkSedeAccess, async (req, res) => {
  try {
    let result;

    if (req.user.rol === 0) {
      result = await pool.query(
        `
    SELECT
      c.*,
        CONCAT(c.nombre, ' ', c.apellido_paterno, ' ', c.apellido_materno) AS nombre_completo,
        s.nombre AS nombre_sede
      FROM
        coordinadora_asociada c
      JOIN sede s ON c.id_sede = s.id_sede;
      `,
      );
    } else if (req.user.rol === 1) {
      result = await pool.query(
        `
      SELECT
          c.*,
          CONCAT(c.nombre, ' ', c.apellido_paterno, ' ', c.apellido_materno) AS nombre_completo
      FROM
          coordinadora_asociada c
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
    console.error("Error fetching coordinadora_asociada:", error);
    res.status(500).json({
      success: false,
      message: "Error al obtener los datos",
      error: error.message,
    });
  }
});

router.put(
  "/estado/:id",
  authenticateToken,
  checkSedeAccess,
  requireAdmin,
  async (req, res) => {
    const { id } = req.params;
    const { estado } = req.body;

    try {
      // Actualizar participante
      await pool.query(
        `UPDATE coordinadora_asociada SET
        estado = $1
      WHERE id_coordinadora_asociada = $2`,
        [estado, id],
      );

      res.json({
        success: true,
        message: "coordinadora_asociada actualizada correctamente",
      });
    } catch (error) {
      console.error("Error al actualizar coordinadora_asociada:", error);
      res.status(500).json({
        message: "Error al actualizar coordinadora_asociada",
        error: error.message,
      });
    }
  },
);

// Delete a cooridnadora asociada
router.delete("/:id", authenticateToken, checkSedeAccess, async (req, res) => {
  const { id } = req.params;

  try {
    // Get the sede of the coordinadora_asociada
    const sedeResult = await pool.query(
      "SELECT id_sede FROM coordinadora_asociada WHERE id_coordinadora_asociada = $1",
      [id],
    );

    if (sedeResult.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: "coordinadora_asociada not found",
      });
    }

    const sede = sedeResult.rows[0].id_sede;

    // Check if coordinator can only delete coordinadora_asociadas from their own sede
    if (req.user.rol === 1) {
      if (req.user.id_sede !== sede) {
        return res.status(403).json({
          success: false,
          message:
            "No tienes permiso para eliminar coordinadora_asociada de otra sede",
        });
      }
    }

    // Begin transaction
    await pool.query("BEGIN");

    // First delete records from mentora_grupo table
    await pool.query(
      "DELETE FROM coordinadora_asociada WHERE id_sede = $1 AND id_coordinadora_asociada = $2",
      [req.user.id_sede, id],
    );

    // Commit transaction
    await pool.query("COMMIT");

    res.json({
      success: true,
      message: "coordinadora_asociada eliminada correctamente",
    });
  } catch (error) {
    // Rollback transaction in case of error
    await pool.query("ROLLBACK");

    console.error("Error eliminando coordinadora_asociada:", error);
    res.status(500).json({
      success: false,
      message: "Error al eliminando cooridnadora_asociada",
      error: error.message,
    });
  }
});

export default router;

