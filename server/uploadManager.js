import multer from "multer";
import path from "path";
import fs from "fs";


// Create uploads directory if it doesn't exist
export const uploadsDir = path.join(process.cwd(), 'uploads');
if (!fs.existsSync(uploadsDir)){
    fs.mkdirSync(uploadsDir, { recursive: true });
}



export const participantesDir = path.join(uploadsDir, 'participantes');
if (!fs.existsSync(participantesDir)){
    fs.mkdirSync(participantesDir, { recursive: true });
}

// Define storage locally
export const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, participantesDir);
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, file.fieldname + '-' + uniqueSuffix + path.extname(file.originalname));
  }
});

// Define upload locally
export const upload = multer({
  storage: storage,
  fileFilter: function (req, file, cb) {
    if (file.mimetype !== 'application/pdf') {
      return cb(new Error('Solo se permiten archivos PDF'));
    }
    cb(null, true);
  },
  limits: {
    fileSize: 15 * 1024 * 1024 // 15MB limit
  }
});