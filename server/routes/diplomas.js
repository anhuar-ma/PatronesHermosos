import express from "express";
import { pool } from "../server.js";
import {
  authenticateToken,
  requireAdmin,
  checkSedeAccess,
} from "../middleware/auth.js";
import jwt from "jsonwebtoken";
import { JWT_SECRET } from "../config/jwtConfig.js";
import { PDFDocument, StandardFonts, rgb } from "pdf-lib";
import fs from "fs-extra";
import path from "path";
import archiver from "archiver";

const router = express.Router();

// Utility function to generate a PDF with a name
async function generateDiploma(templatePath, outputPath, recipientName, sedeName = "", fecha = "") {
  try {
    // Read the template PDF
    const templateBytes = await fs.readFile(templatePath);
    console.log("templateBytes", templateBytes);
    console.log("templatePath", templatePath);


    // Load the PDF document
    const pdfDoc = await PDFDocument.load(templateBytes);

    // Get the first page
    const page = pdfDoc.getPages()[0];

    // Embed the standard font
    const font = await pdfDoc.embedFont(StandardFonts.HelveticaBold);
    const regularFont = await pdfDoc.embedFont(StandardFonts.Helvetica);

    // Calculate text position (centered horizontally, positioned vertically)
    const textWidth = font.widthOfTextAtSize(recipientName, 24);
    const pageWidth = page.getWidth();
    const pageHeight = page.getHeight();

    // Position text at center of page, adjust Y position as needed for your diploma template
    let x = (pageWidth - textWidth) / 2;
    let y = pageHeight / 2; // Adjust this based on where names should appear

    // Add recipient name to the page
    page.drawText(recipientName, {
      x,
      y,
      size: 24,
      font,
      color: rgb(0, 0, 0), // Black text
    });

    // Add sede name and date below the recipient name
    if (sedeName) {

      x = 195;
      y = 222;

      if (templatePath.includes('coordinadora_asociada')) {
        x = 187;
        y = 232;
      }

      page.drawText(sedeName, {
        x: x,
        y: y,
        size: 15,
        font: regularFont,
        color: rgb(0, 0, 0),
      });
    }

    if (fecha) {
      x = 130;
      y = 205;
      if (templatePath.includes('coordinadora_asociada')) {
        x = 123;
        y = 214;

      }

      page.drawText(fecha, {
        x: x,
        y: y,
        size: 15,
        font: regularFont,
        color: rgb(0, 0, 0),
      });
    }

    // Save the modified PDF
    const modifiedPdfBytes = await pdfDoc.save();
    await fs.ensureDir(path.dirname(outputPath));
    await fs.writeFile(outputPath, modifiedPdfBytes);

    return outputPath;
  } catch (error) {
    console.error("Error generating diploma:", error);
    throw error;
  }
}

// Helper function to create a ZIP archive
function createZipArchive(outputDir, zipPath, res) {
  return new Promise((resolve, reject) => {
    // Create a file to stream archive data to
    const output = fs.createWriteStream(zipPath);
    const archive = archiver("zip", {
      zlib: { level: 9 }, // Compression level
    });

    // Listen for all archive data to be written
    output.on("close", () => {
      console.log(`Archive created: ${archive.pointer()} total bytes`);
      resolve(zipPath);
    });

    // Good practice to catch warnings
    archive.on("warning", (err) => {
      if (err.code === "ENOENT") {
        console.warn("Archive warning:", err);
      } else {
        reject(err);
      }
    });

    // Error handling
    archive.on("error", (err) => {
      reject(err);
    });

    // Pipe archive data to the file
    archive.pipe(output);

    // Append files from a directory
    archive.directory(outputDir, false);

    // Finalize the archive
    archive.finalize();
  });
}

// Unified diploma generation endpoint - automatically handles both roles
router.get(
  "/generate",
  authenticateToken,
  checkSedeAccess,
  async (req, res) => {
    try {
      const userRole = req.user.rol;

      // Route based on user role
      if (userRole === 0) {
        // Admin role - Generate diplomas for all sedes
        // Create temp directory for all diplomas
        const tempDir = path.join(process.cwd(), "temp_diplomas");
        const zipPath = path.join(process.cwd(), "diplomas_admin.zip");

        await fs.ensureDir(tempDir);

        // Get all accepted sedes
        const sedesResult = await pool.query(
          "SELECT id_sede,id_coordinadora, nombre, fecha_inicio FROM sede WHERE estado = 'Aceptado'",
        );

        // Process each sede
        for (const sede of sedesResult.rows) {
          const sedeDir = path.join(
            tempDir,
            `sede_${sede.id_sede}_${sede.nombre}`,
          );
          await fs.ensureDir(sedeDir);

          // Get coordinadoras for this sede
          const coordResult = await pool.query(
            `SELECT id_coordinadora, CONCAT(nombre, ' ', apellido_paterno, ' ', apellido_materno) AS nombre_completo
           FROM coordinadora
           WHERE id_coordinadora = $1`,
            [sede.id_coordinadora],
          );

          // Get coordinadoras asociadas for this sede
          const coordAsocResult = await pool.query(
            `SELECT id_coordinadora_asociada, CONCAT(nombre, ' ', apellido_paterno, ' ', apellido_materno) AS nombre_completo
           FROM coordinadora_asociada
           WHERE id_sede = $1`,
            [sede.id_sede],
          );

          // Format the fecha_inicio (assuming it's in a database date format)
          let formattedDate = "";
          if (sede.fecha_inicio) {
            // Convert to a nice readable format
            const date = new Date(sede.fecha_inicio);
            formattedDate = date.toLocaleDateString('es-MX', {
              year: 'numeric',
              month: 'long',
              day: 'numeric'
            });
          }

          // Generate diplomas for coordinadoras
          for (const coord of coordResult.rows) {
            const diplomaPath = path.join(
              sedeDir,
              `coordinadora_${coord.id_coordinadora}.pdf`,
            );
            await generateDiploma(
              path.join(process.cwd(), "/diplomas/coordinadora.pdf"),
              diplomaPath,
              coord.nombre_completo,
              sede.nombre,
              formattedDate
            );
          }

          // Generate diplomas for coordinadoras asociadas
          for (const coordAsoc of coordAsocResult.rows) {
            const diplomaPath = path.join(
              sedeDir,
              `coordinadora_asociada_${coordAsoc.id_coordinadora_asociada}.pdf`,
            );
            await generateDiploma(
              path.join(process.cwd(), "/diplomas/coordinadora_asociada.pdf"),
              diplomaPath,
              coordAsoc.nombre_completo,
              sede.nombre,
              formattedDate
            );
          }
          // Get mentoras
          const mentoraResult = await pool.query(
            `SELECT id_mentora, CONCAT(nombre, ' ', apellido_paterno, ' ', apellido_materno) AS nombre_completo
           FROM mentora
           WHERE id_sede = $1`,
            [sede.id_sede],
          );

          // Generate diplomas for mentoras
          for (const mentora of mentoraResult.rows) {
            const diplomaPath = path.join(
              sedeDir,
              `mentora_${mentora.id_mentora}.pdf`,
            );
            await generateDiploma(
              path.join(process.cwd(), "/diplomas/mentora.pdf"),
              diplomaPath,
              mentora.nombre_completo,
              sede.nombre,
              formattedDate
            );
          }
        }

        // Create ZIP archive
        await createZipArchive(tempDir, zipPath, res);

        // Send the ZIP file
        res.download(zipPath, "diplomas_admin.zip", async (err) => {
          if (err) {
            console.error("Error sending zip file:", err);
            if (!res.headersSent) {
              res
                .status(500)
                .json({ success: false, message: "Error downloading file" });
            }
          }

          // Clean up temp files
          try {
            await fs.remove(tempDir);
            await fs.remove(zipPath);
          } catch (cleanupErr) {
            console.error("Cleanup error:", cleanupErr);
          }
        });
      } else if (userRole === 1) {
        // Sede coordinator role - Generate diplomas for specific sede
        const sedeId = req.user.id_sede;

        if (!sedeId) {
          return res.status(400).json({
            success: false,
            message: "No sede ID associated with this user",
          });
        }

        // Create temp directories
        const tempDir = path.join(
          process.cwd(),
          `temp_diplomas_sede_${sedeId}`,
        );
        const zipPath = path.join(process.cwd(), `diplomas_sede_${sedeId}.zip`);

        // Create category directories
        const participantesDir = path.join(tempDir, "participantes");
        // const mentorasDir = path.join(tempDir, "mentoras");
        const colaboradoresDir = path.join(tempDir, "colaboradores");

        await fs.ensureDir(participantesDir);
        // await fs.ensureDir(mentorasDir);
        await fs.ensureDir(colaboradoresDir);

        // Get sede info including fecha_inicio
        const sedeResult = await pool.query(
          "SELECT nombre, fecha_inicio FROM sede WHERE id_sede = $1",
          [sedeId]
        );

        const sedeName = sedeResult.rows[0]?.nombre || "Sede";

        // Format the fecha_inicio
        let formattedDate = "";
        if (sedeResult.rows[0]?.fecha_inicio) {
          const date = new Date(sedeResult.rows[0].fecha_inicio);
          formattedDate = date.toLocaleDateString('es-MX', {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
          });
        }

        // Get participantes for this sede with accepted status
        const participantesResult = await pool.query(
          `SELECT id_participante, CONCAT(nombre, ' ', apellido_paterno, ' ', apellido_materno) AS nombre_completo
         FROM participante
         WHERE id_sede = $1 AND estado = 'Aceptado'`,
          [sedeId],
        );

        // // Get mentoras for this sede with accepted status
        // const mentorasResult = await pool.query(
        //   `SELECT id_mentora, CONCAT(nombre, ' ', apellido_paterno, ' ', apellido_materno) AS nombre_completo
        //  FROM mentora
        //  WHERE id_sede = $1`,
        //   [sedeId],
        // );

        // Get colaboradores for this sede with accepted status
        const colaboradoresResult = await pool.query(
          `SELECT id_colaborador, CONCAT(nombre, ' ', apellido_paterno, ' ', apellido_materno) AS nombre_completo, rol
         FROM colaborador
         WHERE id_sede = $1 AND estado = 'Aceptado'`,
          [sedeId],
        );

        // Generate diplomas for participantes
        for (const participante of participantesResult.rows) {
          const diplomaPath = path.join(
            participantesDir,
            `participante_${participante.id_participante}.pdf`,
          );
          await generateDiploma(
            path.join(process.cwd(), "/diplomas/participante.pdf"),
            diplomaPath,
            participante.nombre_completo,
            sedeName,
            formattedDate
          );
        }

        // // Generate diplomas for mentoras
        // for (const mentora of mentorasResult.rows) {
        //   const diplomaPath = path.join(
        //     mentorasDir,
        //     `mentora_${mentora.id_mentora}.pdf`,
        //   );
        //   await generateDiploma(
        //     path.join(process.cwd(), "/diplomas/mentora.pdf"),
        //     diplomaPath,
        //     mentora.nombre_completo,
        //   );
        // }

        // Generate diplomas for colaboradores
        for (const colaborador of colaboradoresResult.rows) {
          const outputDir = colaboradoresDir;
          const templateFile = "colaboradora.pdf";

          const diplomaPath = path.join(
            outputDir,
            `${colaborador.rol.toLowerCase()}_${colaborador.id_colaborador}.pdf`,
          );
          await generateDiploma(
            path.join(process.cwd(), `/diplomas/${templateFile}`),
            diplomaPath,
            colaborador.nombre_completo,
            sedeName,
            formattedDate
          );
        }

        // Create ZIP archive
        await createZipArchive(tempDir, zipPath, res);

        // Send the ZIP file
        res.download(zipPath, `diplomas_sede_${sedeId}.zip`, async (err) => {
          if (err) {
            console.error("Error sending zip file:", err);
            if (!res.headersSent) {
              res
                .status(500)
                .json({ success: false, message: "Error downloading file" });
            }
          }

          // Clean up temp files
          try {
            await fs.remove(tempDir);
            await fs.remove(zipPath);
          } catch (cleanupErr) {
            console.error("Cleanup error:", cleanupErr);
          }
        });
      } else {
        // Invalid role
        return res.status(403).json({
          success: false,
          message: "You do not have permission to generate diplomas",
        });
      }
    } catch (error) {
      console.error("Error generating diplomas:", error);
      res.status(500).json({
        success: false,
        message: "Error generating diplomas",
        error: error.message,
      });
    }
  },
);

export default router;
