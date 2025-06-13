import express from "express";
import { pool } from "../server.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { sendEmail } from "../routes/emailservices.js";
import { JWT_SECRET } from "../config/jwtConfig.js";
import {
  authenticateToken,
  checkSedeAccess,
  requireAdmin,
} from "../middleware/auth.js";
import { upload } from "../uploadManager.js";

import path from "path";
import fs from "fs";
const router = express.Router();

// Handle sedes registration
router.post("/", upload.single("convocatoria"), async (req, res) => {
  try {
    const {
      nombre_coordinadora,
      apellido_paterno_coordinadora,
      apellido_materno_coordinadora,
      correo_coordinadora,
      password,
      nombre_sede,
      fecha_inicio,
    } = req.body;

    // File path to store in the database (or null if no file)
    const convocatoria = req.file
      ? `/uploads/convocatorias/${req.file.filename}`
      : null;

    // Validate password is provided
    if (!password) {
      return res.status(400).json({
        success: false,
        message: "Contraseña is required",
      });
    }

    const checkCorreo = await pool.query(
      `SELECT correo FROM coordinadora WHERE correo = $1`,
      [correo_coordinadora],
    );

    // Check if email already exists
    if (checkCorreo.rows.length > 0) {
      return res.status(400).json({
        success: false,
        message: "Este correo ya esta registrado",
      });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);
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
        convocatoria,
      ],
    );

    res.status(201).json({
      success: true,
      data: result.rows[0],
      file: req.file
        ? {
            filename: req.file.filename,
            path: convocatoria,
          }
        : null,
    });
  } catch (error) {
    // If there was a file uploaded but an error occurred, delete the file
    if (req.file) {
      try {
        fs.unlinkSync(req.file.path);
      } catch (unlinkError) {
        console.error("Error deleting file:", unlinkError);
      }
    }

    console.error("Error saving participant:", error);
    res.status(500).json({
      success: false,
      message: "Error al guardar los datos",
      error: error.message,
    });
  }
});

// Get sedes and their respective coordinadoras
router.get(
  "/",
  authenticateToken,
  checkSedeAccess,
  requireAdmin,
  async (req, res) => {
    try {
      //cambiar a simplemente coreo
      if (req.user.rol === 0) {
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
  },
);

router.get(
  "/download/:id",
  authenticateToken,
  checkSedeAccess,
  requireAdmin,
  async (req, res) => {
    try {
      const { id } = req.params;

      // Query the database to get the file path
      const result = await pool.query(
        "SELECT convocatoria, nombre FROM sede WHERE id_sede = $1",
        [id],
      );

      if (result.rows.length === 0 || !result.rows[0].convocatoria) {
        return res.status(404).json({
          success: false,
          message: "Archivo no encontrado",
        });
      }

      // Safely handle path construction
      let storedPath = result.rows[0].convocatoria;
      storedPath = storedPath.startsWith("/")
        ? storedPath.substring(1)
        : storedPath;

      // Normalize and resolve path to prevent directory traversal
      const filePath = path.normalize(path.resolve(process.cwd(), storedPath));

      // Ensure the path is within the allowed directory
      if (!filePath.startsWith(process.cwd())) {
        return res.status(403).json({
          success: false,
          message: "Acceso denegado al archivo solicitado",
        });
      }

      // Generate a user-friendly filename
      const originalFilename = path.basename(filePath);
      const safeFilename = `convocatoria_${result.rows[0].nombre || id}_${originalFilename}`;

      // // Send file with proper error handling
      // res.download(filePath, safeFilename, (err) => {
      //   if (err) {
      //     // This handles if the file disappears between check and download
      //     if (err.code === "ENOENT") {
      //       return res.status(404).json({
      //         success: false,
      //         message: "Archivo no encontrado en el servidor",
      //       });
      //     }

      //     console.error("Error downloading file:", err);
      //     return res.status(500).json({
      //       success: false,
      //       message: "Error al descargar el archivo",
      //       error: err.message,
      //     });
      //   }
      // });

      // Use sendFile
      res.setHeader("Content-Type", "application/pdf");
      res.setHeader("Content-Disposition", "inline; filename=permiso.pdf");

      // Send the file for viewing
      res.sendFile(filePath);
    } catch (error) {
      console.error("Error downloading file:", error);
      res.status(500).json({
        success: false,
        message: "Error al descargar el archivo",
        error: error.message,
      });
    }
  },
);

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
router.get(
  "/:id",
  authenticateToken,
  checkSedeAccess,
  requireAdmin,
  async (req, res) => {
    const { id } = req.params;
    try {
      // Verify and decode the token
      //cambiar a simplemente coreo
      if (req.user.rol === 0) {
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
  },
);

router.put(
  "/:id",
  authenticateToken,
  checkSedeAccess,
  requireAdmin,
  async (req, res) => {
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
      await pool.query("BEGIN");

      // Update coordinadora table
      await pool.query(
        `UPDATE coordinadora
       SET nombre = $1,
           apellido_paterno = $2,
           apellido_materno = $3,
           correo = $4
       WHERE id_coordinadora = $5`,
        [nombre, apellido_paterno, apellido_materno, correo, id_coordinadora],
      );

      // Update sede table
      await pool.query(
        `UPDATE sede
       SET nombre = $1,
           fecha_inicio = $2,
           convocatoria = $3
       WHERE id_sede = $4`,
        [nombre_sede, fecha_inicio, convocatoria, id],
      );

      // Commit transaction
      await pool.query("COMMIT");

      res.status(200).json({
        success: true,
        message: "Sede y coordinadora actualizada correctamente",
      });
    } catch (error) {
      console.error("Error updating coordinadora y sede:", error);

      res.status(500).json({
        success: false,
        message: "Error al actualizar los datos",
        error: error.message,
      });
    }
  },
);

// Update estado
router.put(
  "/estado/:id",
  authenticateToken,
  checkSedeAccess,
  requireAdmin,
  async (req, res) => {
    const { id } = req.params;
    const { estado } = req.body;

    try {
      //cambiar a simplemente coreo
      // Actualizar participante
      await pool.query(
        `UPDATE sede SET
        estado = $1
      WHERE id_sede = $2`,
        [estado, id],
      );

      res.json({
        success: true,
        message: "Sede y coordinadora actualizado correctamente",
      });
    } catch (error) {
      console.error("Error actualizando coordinadora y sede:", error);

      res.status(500).json({
        success: false,
        message: "Error al obtener los datos",
        error: error.message,
      });
    }
  },
);

// Delete sede and coordinadora by sede ID
router.delete("/:id", authenticateToken, requireAdmin, async (req, res) => {
  const { id } = req.params;

  try {
    // First get the coordinadora ID associated with this sede
    const sedeResult = await pool.query(
      "SELECT id_coordinadora,convocatoria FROM sede WHERE id_sede = $1",
      [id],
    );

    if (sedeResult.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: "Sede not found",
      });
    }

    const coordinadoraId = sedeResult.rows[0].id_coordinadora;
    const filePath = sedeResult.rows[0].convocatoria;

    // Delete the file if it exists
    if (filePath) {
      const fullPath = path.join(process.cwd(), filePath.substring(1));
      if (fs.existsSync(fullPath)) {
        fs.unlinkSync(fullPath);
      }
    }

    // Begin transaction
    await pool.query("BEGIN");

    //Delete participantes and their tutors
    // First get all tutor IDs
    const tutoresResult = await pool.query(
      `SELECT id_padre_o_tutor FROM participante WHERE id_sede = $1`,
      [id],
    );

    // Delete participantes
    await pool.query("DELETE FROM participante WHERE id_sede = $1", [id]);

    // Delete tutors
    if (tutoresResult.rows.length > 0) {
      const tutorIds = tutoresResult.rows.map((row) => row.id_padre_o_tutor);
      await pool.query(
        `DELETE FROM padre_o_tutor WHERE id_padre_o_tutor = ANY($1)`,
        [tutorIds],
      );
    }

    //Remove group assignments first - mentora_grupo relationships
    await pool.query(
      `DELETE FROM mentora_grupo
       WHERE id_grupo IN (SELECT id_grupo FROM grupo WHERE id_sede = $1)`,
      [id],
    );

    // Delete mentoras
    await pool.query("DELETE FROM mentora WHERE id_sede = $1", [id]);

    // Delete colaboradores
    await pool.query("DELETE FROM colaborador WHERE id_sede = $1", [id]);

    //Delete grupos from this sede
    await pool.query("DELETE FROM grupo WHERE id_sede = $1", [id]);

    //Delete informantes from this sede
    await pool.query("DELETE FROM informante WHERE id_sede = $1", [id]);

    //Delete coordinadoras_asociadas
    await pool.query("DELETE FROM coordinadora_asociada WHERE id_sede = $1", [
      id,
    ]);

    // Delete sede
    await pool.query("DELETE FROM sede WHERE id_sede = $1", [id]);

    // Delete the main coordinadora
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

router.post("/email/:id", authenticateToken, requireAdmin, async (req, res) => {
  const { id } = req.params;
  const { estado, razon } = req.body; // Recibe el estado desde el cuerpo de la solicitud

  try {
    // Obtén los datos de la sede y su coordinadora desde la base de datos
    const result = await pool.query(
      `SELECT 
         s.nombre AS nombre_sede,
         s.estado AS estado_sede,
         CONCAT(coor.nombre, ' ', coor.apellido_paterno, ' ', coor.apellido_materno) AS nombre_completo_coordinadora,
         coor.correo AS correo_coordinadora
       FROM sede s
       LEFT JOIN coordinadora coor ON s.id_coordinadora = coor.id_coordinadora
       WHERE s.id_sede = $1`,
      [id],
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ message: "Sede no encontrada" });
    }

    const sede = result.rows[0];

    // Configura el contenido del correo según el estado
    let subject;
    let html;

    if (estado === "Aceptado") {
      subject = "¡Tu sede está activa en Patrones Hermosos!";
      html = `
        <div style="font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; color: #2c2c2c; max-width: 600px; margin: auto; padding: 30px; border: 1px solid #ddd; border-radius: 12px; background-color: #fafafa; box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05);">
          <h2 style="color: #D6336C; margin-bottom: 20px;">🎉 ¡Sede aceptada con éxito!</h2>
          <p style="font-size: 16px; line-height: 1.6;">Nos complace informarte que la sede <strong style="color: #333;">${sede.nombre_sede}</strong> ha sido <strong>aprobada</strong> para formar parte de <em>Patrones Hermosos</em>.</p>
          <p style="font-size: 16px; line-height: 1.6;">Ya puedes ingresar al sistema utilizando las credenciales que registraste previamente.</p>
          
          <hr style="margin: 30px 0; border: none; border-top: 1px solid #e0e0e0;">
          
          <p style="font-size: 15px; color: #666;">Gracias por ser parte de esta experiencia.</p>
          <p style="font-size: 15px; font-weight: bold; color: #444;">Equipo de Patrones Hermosos</p>
        </div>
        `;
    } else if (estado === "Rechazado") {
      subject = "Notificación: Tu sede está inactiva en Patrones Hermosos";
      html = `
        <div style="font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; color: #2c2c2c; max-width: 600px; margin: auto; padding: 30px; border: 1px solid #ddd; border-radius: 12px; background-color: #fafafa; box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05);">
          <h2 style="color: #D6336C;">Estimada, ${sede.nombre_completo_coordinadora}</h2>
          <p>Te informamos que la sede <strong>${sede.nombre_sede}</strong> fue rechazada.</p>
          ${razon ? `<p><strong>Motivo del rechazo:</strong> ${razon}</p>` : ""}
          <p>Por favor verifica la información del formulario y vuelve a intentarlo</p>
          <p>Saludos,</p>
          <p>Equipo de Patrones Hermosos</p>
        </div>
      `;
    } else {
      return res.status(400).json({
        success: false,
        message: "Estado no válido. Debe ser 'Aceptado' o 'Rechazado'.",
      });
    }

    // Envía el correo
    await sendEmail(sede.correo_coordinadora, subject, html);

    res.json({
      success: true,
      message: `Correo enviado a ${sede.correo_coordinadora}`,
    });
  } catch (error) {
    console.error("Error al enviar el correo:", error);
    res.status(500).json({
      message: "Error al enviar el correo",
      error: error.message,
    });
  }
});

export default router;
