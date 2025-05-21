import multer from "multer";
import path from "path";
import fs from "fs";

// Create uploads directory if it doesn't exist
export const uploadsDir = path.join(process.cwd(), "uploads");
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
}

export const participantesDir = path.join(uploadsDir, "participantes");
if (!fs.existsSync(participantesDir)) {
  fs.mkdirSync(participantesDir, { recursive: true });
}

export const convocatoriasDir = path.join(uploadsDir, "convocatorias");
if (!fs.existsSync(convocatoriasDir)) {
  fs.mkdirSync(convocatoriasDir, { recursive: true });
}

// // Define storage locally
// export const storage = multer.diskStorage({
//   destination: function (req, file, cb) {
//     cb(null, participantesDir);
//   },
//   filename: function (req, file, cb) {
//     const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
//     cb(
//       null,
//       file.fieldname + "-" + uniqueSuffix + path.extname(file.originalname),
//     );
//   },
// });

export const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    if (file.fieldname === "convocatoria") {
      cb(null, convocatoriasDir);
    } else if (file.fieldname === "archivo_tutor") {
      // Assuming 'foto_identificacion' is for participantes
      cb(null, participantesDir);
    } else {
      // Default or error handling if fieldname is unexpected
      cb(new Error("Invalid file fieldname for upload destination"), null);
    }
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    cb(
      null,
      file.fieldname + "-" + uniqueSuffix + path.extname(file.originalname),
    );
  },
});

// Define upload locally
export const upload = multer({
  storage: storage,
  fileFilter: function (req, file, cb) {
    if (file.mimetype !== "application/pdf") {
      return cb(new Error("Solo se permiten archivos PDF"));
    }
    cb(null, true);
  },
  limits: {
    fileSize: 15 * 1024 * 1024, // 15MB limit
  },
});
