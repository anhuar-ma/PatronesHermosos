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
router.get("/", authenticateToken, checkSedeAccess, async (req, res) => {
  try {
    let query;
    let params = [];

    if (req.user.rol === 0) {
      query = `
            SELECT
               (SELECT COUNT(*) FROM participante WHERE estado = 'Aceptado') AS participantes_aceptadas_nacional,
               (SELECT COUNT(*) FROM participante WHERE estado = 'Rechazado') AS participantes_rechazadas_nacional,
               (SELECT COUNT(*) FROM participante WHERE estado = 'Pendiente') AS participantes_pendientes_nacional,
               (SELECT COUNT(*) FROM colaborador WHERE estado = 'Aceptado') AS colaboradores_aceptados_nacional,
               (SELECT COUNT(*) FROM mentora) AS mentoras_nacional,
               (SELECT COUNT(*) FROM colaborador WHERE estado = 'Aceptado' AND rol = 'Facilitadora') AS facilitadoras_aceptadas_nacional,
               (SELECT COUNT(*) FROM colaborador WHERE estado = 'Aceptado' AND rol = 'Instructora') AS instructoras_aceptadas_nacional,
               (SELECT COUNT(*) FROM colaborador WHERE estado = 'Aceptado' AND rol = 'Staff') AS staff_aceptados_nacional,
               (SELECT COUNT(*) FROM sede WHERE estado = 'Aceptado') AS sedes_aceptadas,
               (SELECT COUNT(*) FROM sede WHERE estado = 'Pendiente') AS sedes_pendientes,
               (SELECT COUNT(*) FROM sede WHERE estado = 'Rechazado') AS sedes_rechazadas,
               (SELECT COUNT(*) FROM sede WHERE fecha_inicio <= CURRENT_DATE) AS sedes_activas,
               (SELECT COUNT(*) FROM sede WHERE fecha_inicio > CURRENT_DATE) AS sedes_pendientes_inicio;

            `;
    } else {
      query = `
            SELECT
                (SELECT COUNT(*) FROM participante WHERE estado = 'Aceptado' AND participante.id_sede = $1) AS participantes_aceptadas,
                (SELECT COUNT(*) FROM participante WHERE estado = 'Rechazado' AND participante.id_sede = $1) AS participantes_rechazadas,
                (SELECT COUNT(*) FROM participante WHERE estado = 'Pendiente' AND participante.id_sede = $1) AS participantes_pendientes,
                (SELECT COUNT(*) FROM colaborador WHERE estado = 'Aceptado' AND colaborador.id_sede = $1) AS colaboradores_aceptados,
                (SELECT COUNT(*) FROM mentora WHERE mentora.id_sede = $1) AS mentoras,
                (SELECT COUNT(*) FROM colaborador WHERE estado = 'Aceptado' AND rol = 'Facilitadora' AND colaborador.id_sede = $1) AS facilitadoras_aceptadas,
                (SELECT COUNT(*) FROM colaborador WHERE estado = 'Aceptado' AND rol = 'Instructora' AND colaborador.id_sede = $1) AS instructoras_aceptadas,
                (SELECT COUNT(*) FROM colaborador WHERE estado = 'Aceptado' AND rol = 'Staff' AND colaborador.id_sede = $1) AS staff_aceptados
            `;
      params.push(req.user.id_sede);
    }
    const result = await pool.query(query, params);

    res.status(200).json({
      success: true,
      data: result.rows,
    });
  } catch (error) {
    console.error("Error creating group:", error);
    res.status(500).json({
      success: false,
      message: "Error al guardar los datos",
      error: error.message,
    });
  }
});

router.get(
  "/sedes",
  authenticateToken,
  checkSedeAccess,
  requireAdmin,
  async (req, res) => {
    try {
      const result = await pool.query(
        `
            SELECT
                s.nombre AS nombre_sede,
                (SELECT COUNT(*) FROM participante WHERE id_sede = s.id_sede AND estado = 'Aceptado') AS alumnas_aceptadas,
                (SELECT COUNT(*) FROM participante WHERE id_sede = s.id_sede AND estado = 'Rechazado') AS alumnas_rechazadas,
                (SELECT COUNT(*) FROM participante WHERE id_sede = s.id_sede AND estado = 'Pendiente') AS alumnas_pendientes,
                (SELECT COUNT(*) FROM colaborador WHERE id_sede = s.id_sede AND estado = 'Aceptado') AS colaboradores_aceptados
            FROM
                sede s
            WHERE
                s.estado = 'Aceptado'
            ORDER BY
                s.nombre;
            `,
      );
      res.status(200).json({
        success: true,
        data: result.rows,
      });
    } catch (error) {
      console.error("Error creating group:", error);
      res.status(500).json({
        success: false,
        message: "Error al guardar los datos",
        error: error.message,
      });
    }
  },
);

router.get(
  "/estadisticas",
  authenticateToken,
  checkSedeAccess,
  async (req, res) => {
    try {
      let query;
      let query2;
      let params = [];

      if (req.user.rol === 0) {
        query = `
            SELECT
               (SELECT COUNT(*) FROM participante WHERE estado = 'Aceptado') AS participantes_aceptadas_nacional,
               (SELECT COUNT(*) FROM participante WHERE estado = 'Rechazado') AS participantes_rechazadas_nacional,
               (SELECT COUNT(*) FROM participante WHERE estado = 'Pendiente') AS participantes_pendientes_nacional,
               (SELECT COUNT(*) FROM colaborador WHERE estado = 'Aceptado') AS colaboradores_aceptados_nacional,
               (SELECT COUNT(*) FROM mentora) AS mentoras_nacional,
               (SELECT COUNT(*) FROM colaborador WHERE estado = 'Aceptado' AND rol = 'Facilitadora') AS facilitadoras_aceptadas_nacional,
               (SELECT COUNT(*) FROM colaborador WHERE estado = 'Aceptado' AND rol = 'Instructora') AS instructoras_aceptadas_nacional,
               (SELECT COUNT(*) FROM colaborador WHERE estado = 'Aceptado' AND rol = 'Staff') AS staff_aceptados_nacional,
               (SELECT COUNT(*) FROM sede WHERE estado = 'Aceptado') AS sedes_aceptadas,
               (SELECT COUNT(*) FROM sede WHERE estado = 'Pendiente') AS sedes_pendientes,
               (SELECT COUNT(*) FROM sede WHERE estado = 'Rechazado') AS sedes_rechazadas,
               (SELECT COUNT(*) FROM sede WHERE fecha_inicio <= CURRENT_DATE) AS sedes_activas,
               (SELECT COUNT(*) FROM sede WHERE fecha_inicio > CURRENT_DATE) AS sedes_pendientes_inicio;

            `;

        query2 = `
            SELECT
                s.nombre AS Sede,
                (SELECT COUNT(*) FROM participante WHERE id_sede = s.id_sede AND estado = 'Aceptado') AS alumnas_aceptadas,
                (SELECT COUNT(*) FROM participante WHERE id_sede = s.id_sede AND estado = 'Rechazado') AS alumnas_rechazadas,
                (SELECT COUNT(*) FROM participante WHERE id_sede = s.id_sede AND estado = 'Pendiente') AS alumnas_pendientes,
                (SELECT COUNT(*) FROM colaborador WHERE id_sede = s.id_sede AND estado = 'Aceptado') AS colaboradores_aceptados
            FROM
                sede s
            WHERE
                s.estado = 'Aceptado'
            ORDER BY
                s.nombre;
              `;
      } else {
        query = `
            SELECT
                (SELECT COUNT(*) FROM participante WHERE estado = 'Aceptado' AND participante.id_sede = $1) AS participantes_aceptadas,
                (SELECT COUNT(*) FROM participante WHERE estado = 'Rechazado' AND participante.id_sede = $1) AS participantes_rechazadas,
                (SELECT COUNT(*) FROM participante WHERE estado = 'Pendiente' AND participante.id_sede = $1) AS participantes_pendientes,
                (SELECT COUNT(*) FROM colaborador WHERE estado = 'Aceptado' AND colaborador.id_sede = $1) AS colaboradores_aceptados,
                (SELECT COUNT(*) FROM mentora WHERE mentora.id_sede = $1) AS mentoras,
                (SELECT COUNT(*) FROM colaborador WHERE estado = 'Aceptado' AND rol = 'Facilitadora' AND colaborador.id_sede = $1) AS facilitadoras_aceptadas,
                (SELECT COUNT(*) FROM colaborador WHERE estado = 'Aceptado' AND rol = 'Instructora' AND colaborador.id_sede = $1) AS instructoras_aceptadas,
                (SELECT COUNT(*) FROM colaborador WHERE estado = 'Aceptado' AND rol = 'Staff' AND colaborador.id_sede = $1) AS staff_aceptados
            `;
        params.push(req.user.id_sede);
      }
      const result = await pool.query(query, params);

      // Check if Excel format was requested

      if (req.query.format === "excel") {
        try {
          // Create a new workbook
          const workbook = new exceljs.Workbook();
          const worksheet = workbook.addWorksheet("Estadísticas Generales");

          // Add headers and styling
          worksheet.columns = [
            { header: "ESTADÍSTICA", key: "name", width: 30 },
            { header: "VALOR", key: "value", width: 15 },
          ];

          // Style the header row
          worksheet.getRow(1).font = { bold: true, size: 12 };

          // Add data from result
          const generalData = result.rows[0];
          Object.entries(generalData).forEach(([key, value]) => {
            worksheet.addRow({
              // name: key.replace(/_/g, " ").toUpperCase(),
              name: key.replace(/_/g, " "),
              value: value,
            });
          });


          // If we have query2 and admin role
          if (req.user.rol === 0) {
            const result2 = await pool.query(query2, params);
            const worksheetSedes = workbook.addWorksheet(
              "Estadísticas por Sede",
            );

            // Add headers based on the query result
            const headers = Object.keys(result2.rows[0]);
            worksheetSedes.columns = headers.map((header) => {
              return {
                header: header.toUpperCase(),
                key: header,
                width: 20,
              };
            });

            // Style the header row
            worksheetSedes.getRow(1).font = { bold: true, size: 12 };

            // Add data rows
            result2.rows.forEach((row) => {
              worksheetSedes.addRow(row);
            });
          }

          // Set response headers for file download
          res.setHeader(
            "Content-Type",
            "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
          );
          res.setHeader(
            "Content-Disposition",
            "attachment; filename=estadisticas.xlsx",
          );

          // Write workbook to response and end the response
          await workbook.xlsx.write(res);
          return;
        } catch (excelError) {
          console.error("Error generating Excel:", excelError);
          return res.status(500).json({
            success: false,
            message: "Error generating Excel file",
            error: excelError.message,
          });
        }
      }

      res.status(200).json({
        success: true,
        data: result.rows,
      });
    } catch (error) {
      console.error("Error creating group:", error);
      res.status(500).json({
        success: false,
        message: "Error al guardar los datos",
        error: error.message,
      });
    }
  },
);

export default router;
