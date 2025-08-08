import express from "express";
import pkg from "pg";
const { Pool } = pkg;
import cors from "cors";
import bodyParser from "body-parser";
import colaboradoresRoutes from "./routes/colaboradores.js";
import coordinadorasRoutes from "./routes/coordinadoras.js";
import coordinadoras_asociadasRoutes from "./routes/coordinadoras_asociadas.js";
import gruposRoutes from "./routes/grupos.js";
import mentorasRoutes from "./routes/mentoras.js";
import participantesRoutes from "./routes/participantes.js";
import sedesRoutes from "./routes/sedes.js";
import authRoutes from "./routes/authRoute.js";
import diplomasRoutes from "./routes/diplomas.js";
import estadisticas from "./routes/estadisticas.js";
import informantes from "./routes/informantes.js";
import deleteDB from "./routes/deleteDB.js";
import dotenv from "dotenv";
import multer from "multer";
import path from "path";
import fs from "fs";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 8000;

// Middleware
app.use(
  cors({
    origin: process.env.NODE_ENV === 'production'
      ? ["https://your-production-domain.com"]
      : ["http://localhost:5173", "http://localhost:3000"],
    methods: ["GET", "POST", "PUT", "DELETE"],
    credentials: true,
  }),
);
app.use(bodyParser.json());

// Database configuration using environment variables
const dbConfig = {
  user: process.env.DB_USER || "postgres",
  host: process.env.DB_HOST || "localhost",
  database: process.env.DB_NAME || "patroneshermosos",
  password: process.env.DB_PASSWORD,
  port: process.env.DB_PORT || 5432,
  ssl: process.env.NODE_ENV === 'production' ? {
    rejectUnauthorized: false,
  } : false,
};

// Create database pool
export const pool = new Pool(dbConfig);

// Test database connection
pool.connect((err, client, release) => {
  if (err) {
    console.error('Error connecting to the database:', err.stack);
  } else {
    console.log('Connected to database successfully');
    release();
  }
});

// Add to server.js
app.get("/test", (req, res) => {
  res.send("Server is working");
});

// Routes
app.use("/api/colaboradores", colaboradoresRoutes);
app.use("/api/coordinadoras", coordinadorasRoutes);
app.use("/api/coordinadoras_asociadas", coordinadoras_asociadasRoutes);
app.use("/api/grupos", gruposRoutes);
app.use("/api/mentoras", mentorasRoutes);
app.use("/api/participantes", participantesRoutes);
app.use("/api/informantes", informantes);
app.use("/api/sedes", sedesRoutes);
app.use("/api/auth", authRoutes);
// Serve static files from uploads directory
app.use("/uploads", express.static(path.join(process.cwd(), "uploads")));
//Diplomas
app.use("/api/diplomas", diplomasRoutes);
//estadisticas
app.use("/api/estadisticas", estadisticas);
app.use("/api/deleteDB", deleteDB);

// Listen on all interfaces
app.listen(PORT, "0.0.0.0", () => {
  console.log(`Server running on port ${PORT}`);
});
