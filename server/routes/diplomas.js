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

    // Load the PDF document
    const pdfDoc = await PDFDocument.load(templateBytes);

    // Get the first page
    const page = pdfDoc.getPages()[0];

    // Embed the standard font
    const font = await pdfDoc.embedFont(StandardFonts.HelveticaBold);
    const regularFont = await pdfDoc.embedFont(StandardFonts.Helvetica);

    const pageWidth = page.getWidth();
    const pageHeight = page.getHeight();

    // Handle long names (>50 chars) or very long names (>100 chars)
    let fontSize = 24; // Default font size
    let lines = [];

    if (recipientName.length > 100) {
      // For very long names, reduce font size
      fontSize = Math.max(14, Math.floor(24 * (100 / recipientName.length)));

      // Split into multiple lines if still needed
      if (recipientName.length > 120) {
        const midPoint = findSplitPosition(recipientName, Math.floor(recipientName.length / 2));
        lines = [
          recipientName.substring(0, midPoint),
          recipientName.substring(midPoint).trim()
        ];
      } else {
        lines = [recipientName];
      }
    } else if (recipientName.length > 50) {
      // For long names, split into two lines at a space
      const midPoint = findSplitPosition(recipientName, Math.floor(recipientName.length / 2));
      lines = [
        recipientName.substring(0, midPoint),
        recipientName.substring(midPoint).trim()
      ];
    } else {
      // Normal length name
      lines = [recipientName];
    }

    // Calculate position and draw name (one or multiple lines)
    let y = pageHeight / 2;

    // Adjust y position if multiple lines
    if (lines.length > 1) {
      y += (fontSize / 2) * (lines.length - 1);
    }

    // Draw each line, centered
    lines.forEach((line, index) => {
      const textWidth = font.widthOfTextAtSize(line, fontSize);
      const x = (pageWidth - textWidth) / 2;
      const lineY = y - index * (fontSize * 1.5); // Add spacing between lines

      page.drawText(line, {
        x,
        y: lineY,
        size: fontSize,
        font,
        color: rgb(0, 0, 0),
      });
    });

    // Add sede name and date below the recipient name
    if (sedeName) {
      let x = 195;
      let y = 222;

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
      let x = 130;
      let y = 205;
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

// Helper function to find a good position to split text (after a space)
function findSplitPosition(text, targetIndex) {
  // Look for the nearest space before or after the target index
  let spaceAfter = text.indexOf(' ', targetIndex);
  let spaceBefore = text.lastIndexOf(' ', targetIndex);

  // If no space after, use space before
  if (spaceAfter === -1) return spaceBefore;

  // If no space before, use space after
  if (spaceBefore === -1) return spaceAfter;

  // Use whichever space is closest to the target index
  return (targetIndex - spaceBefore < spaceAfter - targetIndex) ?
    spaceBefore : spaceAfter;
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

// Helper function to format a date range (starting date + 4 days)
function formatDateRange(startDateStr) {
  if (!startDateStr) return "";

  // Create date objects for start and end dates
  const startDate = new Date(startDateStr);
  const endDate = new Date(startDate);
  endDate.setDate(startDate.getDate() + 4); // Add 4 days

  // Format start date
  const startFormatted = startDate.toLocaleDateString('es-MX', {
    day: 'numeric',
    month: 'long',
    year: 'numeric'
  });

  // Format end date
  const endFormatted = endDate.toLocaleDateString('es-MX', {
    day: 'numeric',
    month: 'long',
    year: 'numeric'
  });

  // Return the date range string
  return `${startFormatted} al ${endFormatted}`;
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
            `sede_${sede.nombre}`,
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
            formattedDate = formatDateRange(sede.fecha_inicio);
          }

          // Generate diplomas for coordinadoras
          for (const coord of coordResult.rows) {
            const diplomaPath = path.join(
              sedeDir,
              `coordinadora_${coord.nombre_completo}.pdf`,
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
              `coordinadora_asociada_${coordAsoc.nombre_completo}.pdf`,
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
              `mentora_${mentora.nombre_completo}.pdf`,
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
          formattedDate = formatDateRange(sedeResult.rows[0].fecha_inicio);
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
            `participante_${participante.nombre_completo}.pdf`,
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
            `${colaborador.rol.toLowerCase()}_${colaborador.nombre_completo}.pdf`,
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
