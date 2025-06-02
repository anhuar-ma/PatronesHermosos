import express from "express";
import { pool } from "../server.js";
import jwt from "jsonwebtoken";
import { JWT_SECRET } from "../config/jwtConfig.js";
import { sendEmail } from "../routes/emailservices.js";
import {
  authenticateToken,
  requireAdmin,
  checkSedeAccess,
} from "../middleware/auth.js";
import multer from "multer";
import path from "path";
import fs from "fs";
import {
  uploadsDir,
  participantesDir,
  storage,
  upload,
} from "../uploadManager.js";

const router = express.Router();

// // Import multer configuration from server.js or redefine it here
// // For simplicity, I'll define a simple version here
// const upload = multer({
//   dest: path.join(process.cwd(), 'uploads/participantes'),
//   fileFilter: (req, file, cb) => {
//     if (file.mimetype !== 'application/pdf') {
//       return cb(new Error('Solo se permiten archivos PDF'));
//     }
//     cb(null, true);
//   },
//   limits: { fileSize: 5 * 1024 * 1024 } // 5MB limit
// });

// Handle participant registration
router.post("/", upload.single("archivo_tutor"), async (req, res) => {
  try {
    const {
      nombre_alumna,
      apellido_paterno,
      apellido_materno,
      edad,
      correo,
      escuela,
      escolaridad,
      // sede deseada
      sede_deseada,
      idioma,
      nombre_tutor,
      apellido_paterno_tutor,
      apellido_materno_tutor,
      correo_tutor,
      telefono_tutor,
      // archivo_tutor would need file handling
    } = req.body;

    // File path to store in the database (or null if no file)
    const permiso_padre_tutor = req.file
      ? `/uploads/participantes/${req.file.filename}`
      : null;

    console.log("ESTA ES LA SEDE:", sede_deseada);
    console.log(req.body);
    const result = await pool.query(
      `CALL registro_participante_con_tutor(
       $1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15)`,
      [
        nombre_alumna,
        apellido_paterno,
        apellido_materno,
        edad,
        correo,
        escuela,
        escolaridad,
        permiso_padre_tutor,
        idioma,
        sede_deseada,
        nombre_tutor,
        apellido_paterno_tutor,
        apellido_materno_tutor,
        correo_tutor,
        telefono_tutor,
      ],
    );

    res.status(201).json({
      success: true,
      data: result.rows[0],
      file: req.file
        ? {
          filename: req.file.filename,
          path: permiso_padre_tutor,
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

// Get all participantes
// router.get("/", async (req, res) => {
//   try {
//     const result = await pool.query("SELECT * FROM participante");
//     res.status(200).json({
//       success: true,
//       data: result.rows,
//     });
//   } catch (error) {
//     console.error("Error fetching colaboradores:", error);
//     res.status(500).json({
//       success: false,
//       message: "Error al obtener los datos",
//       error: error.message,
//     });
//   }
// });

// Add a route to download files
router.get(
  "/download/:id",
  authenticateToken,
  checkSedeAccess,
  async (req, res) => {
    try {
      const { id } = req.params;

      // Query the database to get the file path
      const result = await pool.query(
        "SELECT permiso_padre_tutor, id_sede FROM participante WHERE id_participante = $1",
        [id],
      );




      // Check access
      if (req.user && req.user.rol === 1) {
        if (req.user.id_sede !== result.rows[0].id_sede) {
          return res.status(403).json({
            success: false,
            message: "No tienes permiso para ver archivos de otras sedes",
          });
        }
      }

      console.log(result);

      if (result.rows.length === 0 || !result.rows[0].permiso_padre_tutor) {
        return res.status(404).json({
          success: false,
          message: "Archivo no encontrado",
        });
      }

      const filePath = path.join(
        process.cwd(),
        result.rows[0].permiso_padre_tutor.substring(1),
      );

      // Check if file exists
      if (!fs.existsSync(filePath)) {
        return res.status(404).json({
          success: false,
          message: "Archivo no encontrado en el servidor",
        });
      }

      // Use sendFile 
      res.setHeader('Content-Type', 'application/pdf');
      res.setHeader('Content-Disposition', 'inline; filename=permiso.pdf');

      // Send the file for viewing
      res.sendFile(filePath);
    } catch (error) {
      console.error("Error displaying file:", error);
      res.status(500).json({
        success: false,
        message: "Error al mostrar el archivo",
        error: error.message,
      });
    }
  },
);

// Get participantes with their parents
router.get("/parents", authenticateToken, checkSedeAccess, async (req, res) => {
  try {

    let result;

    // Role 0 can see all colaboradores
    if (req.user.rol === 0) {
      result = await pool.query(`
      SELECT
          CONCAT(p.nombre, ' ', p.apellido_paterno, ' ', p.apellido_materno) AS nombre_completo_participante,
          CONCAT(t.nombre, ' ', t.apellido_paterno, ' ', t.apellido_materno) AS nombre_completo_tutor,
          p.*,
          t.correo AS correo_tutor,
          t.telefono AS telefono_tutor,
          s.nombre AS nombre_sede
      FROM
          participante p
      LEFT JOIN
          padre_o_tutor t
      ON
          p.id_padre_o_tutor = t.id_padre_o_tutor
      LEFT JOIN
          sede s
      ON
          p.id_sede = s.id_sede;

    `);
    }
    // Role 1 can only see colaboradores from their sede
    else if (req.user.rol === 1 && req.user.id_sede) {
      result = await pool.query(
        `
      SELECT
          CONCAT(p.nombre, ' ', p.apellido_paterno, ' ', p.apellido_materno) AS nombre_completo_participante,
          CONCAT(t.nombre, ' ', t.apellido_paterno, ' ', t.apellido_materno) AS nombre_completo_tutor,
          p.*,
          t.correo AS correo_tutor,
          t.telefono AS telefono_tutor,
          s.nombre AS nombre_sede
      FROM
          participante p
      LEFT JOIN
          padre_o_tutor t
      ON
          p.id_padre_o_tutor = t.id_padre_o_tutor
      LEFT JOIN
          sede s
      ON
          p.id_sede = s.id_sede
      WHERE p.id_sede = $1;
    `,
        [req.user.id_sede],
      );
    } else {
      return res.status(403).json({
        success: false,
        message: "Insufficient permissions",
      });
    }

    res.status(200).json({
      success: true,
      data: result.rows,
    });
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
});

// Get un participante con su padre o tutor
router.get(
  "/parents/:id",
  authenticateToken,
  checkSedeAccess,
  async (req, res) => {
    const { id } = req.params;

    try {
      const result = await pool.query(
        `
      SELECT
        participante.*,
        padre_o_tutor.nombre AS nombre_tutor,
        padre_o_tutor.apellido_paterno AS apellido_paterno_tutor,
        padre_o_tutor.apellido_materno AS apellido_materno_tutor,
        padre_o_tutor.telefono AS telefono_tutor,
        padre_o_tutor.correo AS correo_tutor
      FROM
        participante
      JOIN
        padre_o_tutor
      ON
        participante.id_padre_o_tutor = padre_o_tutor.id_padre_o_tutor
      WHERE
        participante.id_participante = $1
    `,
        [id],
      );

      // console.log(result);

      if (result.rows.length === 0) {
        return res.status(404).json({ message: "Participante no encontrado" });
      }

      res.json(result.rows[0]);
    } catch (error) {
      console.error("Error al obtener participante:", error);
      res.status(500).json({ message: "Error del servidor" });
    }
  },
);

// Editar un participante y su tutor
router.put("/:id", authenticateToken, checkSedeAccess, async (req, res) => {
  const { id } = req.params;
  const {
    nombre,
    apellido_paterno,
    apellido_materno,
    correo,
    edad,
    escuela,
    escolaridad,
    idioma,
    id_grupo,
    nombre_tutor,
    apellido_paterno_tutor,
    apellido_materno_tutor,
    correo_tutor,
    telefono_tutor,
  } = req.body;

  try {
    // Obtener ID del tutor relacionado
    const tutorResult = await pool.query(
      "SELECT id_padre_o_tutor FROM participante WHERE id_participante = $1",
      [id],
    );

    if (tutorResult.rows.length === 0) {
      return res.status(404).json({ message: "Participante no encontrado" });
    }

    const id_tutor = tutorResult.rows[0].id_padre_o_tutor;

    // Actualizar participante
    await pool.query(
      `UPDATE participante SET
        nombre = $1,
        apellido_paterno = $2,
        apellido_materno = $3,
        correo = $4,
        edad = $5,
        escuela = $6,
        escolaridad = $7,
        idioma = $8,
        id_grupo = $9
      WHERE id_participante = $10`,
      [
        nombre,
        apellido_paterno,
        apellido_materno,
        correo,
        edad,
        escuela,
        escolaridad,
        idioma,
        id_grupo,
        id,
      ],
    );

    // Actualizar tutor
    await pool.query(
      `UPDATE padre_o_tutor SET
        nombre = $1,
        apellido_paterno = $2,
        apellido_materno = $3,
        correo = $4,
        telefono = $5
      WHERE id_padre_o_tutor = $6`,
      [
        nombre_tutor,
        apellido_paterno_tutor,
        apellido_materno_tutor,
        correo_tutor,
        telefono_tutor,
        id_tutor,
      ],
    );

    res.json({
      success: true,
      message: "Participante actualizado correctamente",
    });
  } catch (error) {
    console.error("Error al actualizar participante:", error);
    res.status(500).json({
      message: "Error al actualizar participante",
      error: error.message,
    });
  }
});

// Update estado
router.put(
  "/estado/:id",
  authenticateToken,
  checkSedeAccess,
  async (req, res) => {
    const { id } = req.params;
    const { estado } = req.body;

    console.log("aorestnaeirsteiarsei arosnteiarnsei");
    try {
      if (estado == "Aceptado") {
        const capacityResult = await pool.query(
          "SELECT check_sede_capacity($1);",
          [id],
        );
        const hasCapacity = capacityResult.rows[0];
        console.log(hasCapacity.check_sede_capacity);
        if (hasCapacity === "false") {
          return res.status(400).json({
            success: false,
            message: "No hay lugares disponibles en esta sede",
          });
        }
      }
      // Actualizar participante
      await pool.query(
        `UPDATE participante SET
        estado = $1
      WHERE id_participante = $2`,
        [estado, id],
      );

      res.json({
        success: true,
        message: "Participante actualizado correctamente",
      });
    } catch (error) {
      console.error("Error al actualizar participante:", error);
      res.status(500).json({
        message: "Error al actualizar participante",
        error: error.message,
      });
    }
  },
);

// Delete participant and associated tutor data
router.delete("/:id", authenticateToken, checkSedeAccess, async (req, res) => {
  const { id } = req.params;

  try {
    // First get the tutor ID associated with this participant
    const participanteResult = await pool.query(
      "SELECT id_padre_o_tutor FROM participante WHERE id_participante = $1",
      [id],
    );

    if (participanteResult.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: "Participante not found",
      });
    }

    const tutorId = participanteResult.rows[0].id_padre_o_tutor;
    const filePath = participanteResult.rows[0].permiso_padre_tutor;

    // Delete the file if it exists
    if (filePath) {
      const fullPath = path.join(process.cwd(), filePath.substring(1));
      if (fs.existsSync(fullPath)) {
        fs.unlinkSync(fullPath);
      }
    }

    // Begin transaction
    await pool.query("BEGIN");

    //then Delete participant first (due to foreign key constraints)
    await pool.query("DELETE FROM participante WHERE id_participante = $1", [
      id,
    ]);

    //  delete the tutor
    await pool.query("DELETE FROM padre_o_tutor WHERE id_padre_o_tutor = $1", [
      tutorId,
    ]);

    //  delete the tutor
    await pool.query("DELETE FROM padre_o_tutor WHERE id_padre_o_tutor = $1", [
      tutorId,
    ]);

    // Commit transaction
    await pool.query("COMMIT");

    res.json({
      success: true,
      message: "Participante y tutor eliminados correctamente",
    });
  } catch (error) {
    // Rollback transaction in case of error
    await pool.query("ROLLBACK");

    console.error("Error eliminando participante y tutor:", error);
    res.status(500).json({
      success: false,
      message: "Error al eliminar los datos",
      error: error.message,
    });
  }
});

router.post("/email/:id", authenticateToken, checkSedeAccess, async (req, res) => {
  const { id } = req.params;
  const { estado, razon } = req.body; // Recibe el estado desde el cuerpo de la solicitud

  try {
    // Obtén los datos del participante, la sede y el tutor desde la base de datos
    const result = await pool.query(
      `SELECT 
         p.nombre AS nombre_participante, 
         p.correo AS correo_participante, 
         s.nombre AS nombre_sede,
         CONCAT(coor.nombre, ' ', coor.apellido_paterno) AS nombre_completo_coordinadora,
         coor.correo AS correo_coordinadora
       FROM participante p
       LEFT JOIN sede s ON p.id_sede = s.id_sede
       LEFT JOIN coordinadora coor ON s.id_coordinadora = coor.id_coordinadora
       WHERE p.id_participante = $1;`,
      [id],
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ message: "Participante no encontrado" });
    }

    const participante = result.rows[0];

    // Configura el contenido del correo según el estado
    let subject;
    let html;

    if (estado === "Aceptado") {
      subject = "¡Felicidades! Has sido aceptada en Patrones Hermosos";
      html = `
        <div style="font-family: Arial, sans-serif; color: #333; max-width: 600px; margin: auto; padding: 20px; border: 1px solid #e0e0e0; border-radius: 10px;">
          <h2 style="color: #D6336C;">¡Felicidades, ${participante.nombre_participante}!</h2>
          <p>Te escribimos para informarte que has sido <strong>seleccionada</strong> para participar en el campamento <strong>Patrones Hermosos</strong>.</p>
      
          <p>Has sido asignada a la sede: <strong style="color: #1D3557;">${participante.nombre_sede || "Sin sede asignada"}</strong></p>
      
          <p>Si tienes alguna duda, te invitamos a ponerte en contacto con tu coordinadora de sede:</p>
      
          <div style="background-color: #f9f9f9; padding: 10px 15px; border-left: 4px solid #D6336C; margin: 20px 0;">
            <p style="margin: 0;"><strong>Nombre:</strong> ${participante.nombre_completo_coordinadora || "Sin coordinadora asignada"}</p>
            <p style="margin: 0;"><strong>Correo:</strong> ${participante.correo_coordinadora || "No disponible"}</p>
          </div>
      
          <p>¡Gracias por ser parte de esta experiencia única!</p>
      
          <p style="margin-top: 30px;">Atentamente,</p>
          <p><strong>Equipo de Patrones Hermosos</strong></p>
        </div>
      `;
    } else if (estado === "Rechazado") {
      subject = "Gracias por postularte a Patrones Hermosos";
      html = `
        <div style="font-family: Arial, sans-serif; color: #333; max-width: 600px; margin: auto; padding: 20px; border: 1px solid #e0e0e0; border-radius: 10px;">
          <h2 style="color: #D6336C;">Gracias por tu interés, ${participante.nombre_participante}</h2>
      
          <p>Queremos agradecerte sinceramente por haberte postulado al campamento <strong>Patrones Hermosos</strong>.</p>
      
          <p>Después de revisar cuidadosamente todas las solicitudes, lamentamos informarte que en esta ocasión <strong>no fuiste seleccionada</strong> para participar.</p>

          ${razon
          ? `<p><strong>Motivo del rechazo:</strong> ${razon}</p>`
          : ""
        }
      
          <p>Sabemos que tienes mucho potencial, y esperamos que sigas desarrollando tus talentos. Nos encantaría volver a recibir tu solicitud en futuras ediciones del campamento.</p>
      
          <p>Si tienes alguna duda o comentario, no dudes en ponerte en contacto con nuestro equipo.</p>
      
          <p style="margin-top: 30px;">Con aprecio,</p>
          <p><strong>Equipo de Patrones Hermosos</strong></p>
        </div>
      `;
    } else {
      return res.status(400).json({
        success: false,
        message: "Estado no válido. Debe ser 'Aceptado' o 'Rechazado'.",
      });
    }

    // Envía el correo
    await sendEmail(participante.correo_participante, subject, html);

    res.json({
      success: true,
      message: `Correo enviado a ${participante.correo_participante}`,
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
