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
import fs from "fs-extra";
import path from "path";
import archiver from "archiver";

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
                (SELECT COUNT(*) FROM colaborador WHERE id_sede = s.id_sede AND estado = 'Aceptado') AS colaboradores_aceptados,
                (SELECT CONCAT(c.nombre, ' ', c.apellido_paterno, ' ', c.apellido_materno)
                FROM coordinadora c
                WHERE c.id_coordinadora = s.id_coordinadora) AS coordinadora_nombre_completo,
                (SELECT c.correo
                FROM coordinadora c
                WHERE c.id_coordinadora = s.id_coordinadora) AS coordinadora_correo
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

router.get("/permisos",
  authenticateToken,
  checkSedeAccess,
  async (req, res) => {
    try {
      const userRole = req.user.rol;
      const userId = req.user.id_sede;

      // Create temp directory for files
      const tempDir = path.join(process.cwd(), "temp_permisos");
      const zipPath = path.join(process.cwd(), `permisos_${Date.now()}.zip`);

      await fs.ensureDir(tempDir);

      // Different behavior based on role
      if (userRole === 0) {
        // Admin role - get all convocatorias and permisos

        // 1. Get all convocatorias from accepted sedes
        const sedesResult = await pool.query(
          "SELECT id_sede, nombre, convocatoria FROM sede WHERE estado = 'Aceptado' AND convocatoria IS NOT NULL"
        );

        // Create sedes directory
        const sedesDir = path.join(tempDir, "convocatorias");
        await fs.ensureDir(sedesDir);

        // Copy each convocatoria file to temp dir
        for (const sede of sedesResult.rows) {
          if (sede.convocatoria) {
            const sourceFilePath = path.join(process.cwd(), sede.convocatoria.substring(1));
            if (fs.existsSync(sourceFilePath)) {
              const destFilePath = path.join(sedesDir, `convocatoria_${sede.nombre}.pdf`);
              await fs.copy(sourceFilePath, destFilePath);
            }
          }
        }

        // 2. Get all permisos from accepted participantes
        const participantesResult = await pool.query(
          `SELECT p.id_participante, p.permiso_padre_tutor, p.nombre, p.apellido_paterno, 
                  s.nombre AS nombre_sede, s.id_sede 
           FROM participante p
           JOIN sede s ON p.id_sede = s.id_sede
           WHERE p.estado = 'Aceptado' AND p.permiso_padre_tutor IS NOT NULL`
        );

        // Create permisos directory
        const permisosDir = path.join(tempDir, "permisos_participantes");
        await fs.ensureDir(permisosDir);

        // Copy each permiso file to temp dir
        for (const participante of participantesResult.rows) {
          if (participante.permiso_padre_tutor) {
            const sourceFilePath = path.join(process.cwd(), participante.permiso_padre_tutor.substring(1));
            if (fs.existsSync(sourceFilePath)) {
              const sedeDir = path.join(permisosDir, `sede_${participante.nombre_sede}`);
              await fs.ensureDir(sedeDir);

              const destFilePath = path.join(sedeDir, `permiso_${participante.nombre}_${participante.apellido_paterno}.pdf`);
              await fs.copy(sourceFilePath, destFilePath);
            }
          }
        }
      }
      else if (userRole === 1) {
        // Coordinator role - only get permisos for their sede
        const participantesResult = await pool.query(
          `SELECT p.id_participante, p.permiso_padre_tutor, p.nombre, p.apellido_paterno 
           FROM participante p
           WHERE p.id_sede = $1 AND p.estado = 'Aceptado' AND p.permiso_padre_tutor IS NOT NULL`,
          [userId]
        );

        // Create permisos directory
        const permisosDir = path.join(tempDir, "permisos_participantes");
        await fs.ensureDir(permisosDir);

        // Copy each permiso file to temp dir
        for (const participante of participantesResult.rows) {
          if (participante.permiso_padre_tutor) {
            const sourceFilePath = path.join(process.cwd(), participante.permiso_padre_tutor.substring(1));
            if (fs.existsSync(sourceFilePath)) {
              const destFilePath = path.join(permisosDir, `permiso_${participante.nombre}_${participante.apellido_paterno}.pdf`);
              await fs.copy(sourceFilePath, destFilePath);
            }
          }
        }
      }

      // Create zip archive
      const output = fs.createWriteStream(zipPath);
      const archive = archiver('zip', { zlib: { level: 9 } });

      archive.pipe(output);
      archive.directory(tempDir, false);

      output.on('close', function () {
        // Download the zip file and then clean up
        res.download(zipPath, `permisos_${userRole === 0 ? 'admin' : 'coordinador'}.zip`, async (err) => {
          if (err) {
            console.error("Error sending zip file:", err);
          }

          // Clean up temp files
          try {
            await fs.remove(tempDir);
            await fs.remove(zipPath);
          } catch (cleanupErr) {
            console.error("Cleanup error:", cleanupErr);
          }
        });
      });

      archive.on('error', function (err) {
        throw err;
      });

      archive.finalize();

    } catch (error) {
      console.error("Error downloading permisos:", error);
      res.status(500).json({
        success: false,
        message: "Error al descargar los permisos",
        error: error.message
      });
    }
  },
)

export default router;
