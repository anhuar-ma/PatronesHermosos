import express from "express";
import { pool } from "../server.js";
import exceljs from "exceljs";
import jwt from "jsonwebtoken";
import { JWT_SECRET } from "../config/jwtConfig.js";
import {
  authenticateToken,
  checkSedeAccess,
  requireAdmin,
} from "../middleware/auth.js";

const router = express.Router();
//Obtain the first number of statistics
router.delete(
  "/",
  authenticateToken,
  checkSedeAccess,
  requireAdmin,
  async (req, res) => {
    try {
      const query = `
      DO $$
      BEGIN
        EXECUTE 'SET CONSTRAINTS ALL DEFERRED';

        -- Truncate all tables with CASCADE to handle dependencies
        TRUNCATE TABLE participante, colaborador, coordinadora, coordinadora_asociada, mentora,
                    mentora_grupo, padre_o_tutor, grupo, sede CASCADE;

        -- Re-enable constraints
        EXECUTE 'SET CONSTRAINTS ALL IMMEDIATE';
      END $$;
    `;

      await pool.query(query);

      res.status(200).json({
        success: true,
        message: "Base de datos vaciada exitosamente",
      });
    } catch (error) {
      console.error("Error elimnando la base de datos:", error);
      res.status(500).json({
        success: false,
        message: "Error al eliminar los datos",
        error: error.message,
      });
    }
  },
);


export default router;