import express from "express";
import { pool } from "../server.js";

const router = express.Router();

// Handle participant registration
router.post("/", async (req, res) => {});

// Get all participantes
router.get("/", async (req, res) => {
  try {
    const result = await pool.query(`
SELECT
    ca.*,
    sede.nombre AS nombre_sede
FROM
    coordinadora_asociada ca
JOIN
    sede ON ca.id_sede = sede.id_sede;
`);
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

export default router;
