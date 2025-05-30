import express from "express";
import { pool } from "../server.js";

import {
  authenticateToken,
  checkSedeAccess,
  requireAdmin,
} from "../middleware/auth.js";

const router = express.Router();

// Handle participant registration
router.post("/", async (req, res) => {});

// Get all coordinadoras
router.get("/", authenticateToken, requireAdmin, async (req, res) => {
  try {
    const result = await pool.query("SELECT * FROM coordinadora");
    res.status(200).json({
      success: true,
      data: result.rows,
    });
  } catch (error) {
    console.error("Error fetching coordinadoras:", error);
    res.status(500).json({
      success: false,
      message: "Error al obtener los datos",
      error: error.message,
    });
  }
});

export default router;
