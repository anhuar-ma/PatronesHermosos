import express from "express";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { pool } from "../server.js";
import dotenv from "dotenv";
import { JWT_SECRET, JWT_EXPIRES_IN } from "../config/jwtConfig.js";

const router = express.Router();

// Login endpoint
router.post("/login", async (req, res) => {
  try {
    const { correo, contraseña } = req.body;
    console.log(req.body);

    // Check if user exists
    const userResult = await pool.query(
      "SELECT * FROM coordinadora WHERE correo = $1",
      [correo],
    );

    const user = userResult.rows[0];
    console.log(user);
    console.log(correo);

    if (!user) {
      return res.status(401).json({
        success: false,
        message: "Credenciales incorrectas",
      });
    }

    // Verify password
    const validPassword = await bcrypt.compare(contraseña, user.contraseña);

    if (!validPassword) {
      return res.status(401).json({
        success: false,
        message: "Credenciales incorrectas",
      });
    }

   const sedeResult = await pool.query(
      "SELECT id_sede FROM sede WHERE id_coordinadora = $1",
      [user.id_coordinadora],
    );

    const id_sede = sedeResult.rows.length > 0 ? sedeResult.rows[0].id_sede : null;

    // Generate JWT token
    const token = jwt.sign(
      {
        id: user.id_coordinadora,
        correo: user.correo,
        rol: user.rol,
        id_sede: id_sede
      },
      JWT_SECRET,
      { expiresIn: JWT_EXPIRES_IN },
    );

    res.status(200).json({
      success: true,
      token,
      user: {
        id: user.id,
        correo: user.email,
        rol: user.role,
        id_sede: user.id_sede
      },
    });
  } catch (error) {
    console.error("Login error:", error);
    res.status(500).json({
      success: false,
      message: "Error en el servidor",
    });
  }
});

// Get current user
router.get("/me", async (req, res) => {
  try {
    const token = req.header("Authorization")?.replace("Bearer ", "");

    if (!token) {
      return res.status(401).json({
        success: false,
        message: "No token provided",
      });
    }

    const decoded = jwt.verify(token, JWT_SECRET);

    const userResult = await pool.query(
      "SELECT id_coordinadora, correo, rol FROM coordinadora WHERE id_coordinadora = $1",
      [decoded.id],
    );

    if (!userResult.rows[0]) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    res.status(200).json({
      success: true,
      user: userResult.rows[0],
    });
  } catch (error) {
    console.error("Auth error:", error);
    res.status(401).json({
      success: false,
      message: "Invalid token",
    });
  }
});

export default router;

