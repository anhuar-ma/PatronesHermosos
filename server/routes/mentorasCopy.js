import express from "express";
import { pool } from "../server.js";

const router = express.Router();

// Handle participant registration
router.post("/", async (req, res) => {});

// Get all participantes
router.get("/", async (req, res) => {
  try {
    const result = await pool.query("SELECT * FROM mentora");
    res.status(200).json({
      success: true,
      data: result.rows,
    });
  } catch (error) {
    console.error("Error fetching mentora:", error);
    res.status(500).json({
      success: false,
      message: "Error al obtener los datos",
      error: error.message,
    });
  }
});

// Get mentora grupos
router.get("/mentora_grupo", async (req, res) => {
  try {
    const result = await pool.query("SELECT * FROM mentora_grupo");
    res.status(200).json({
      success: true,
      data: result.rows,
    });
  } catch (error) {
    console.error("Error fetching mentora:", error);
    res.status(500).json({
      success: false,
      message: "Error al obtener los datos",
      error: error.message,
    });
  }
});

export default router;
