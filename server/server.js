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
import dns from "dns";
import { promisify } from "util";

dotenv.config({ path: "./config/.env" });

const app = express();
const port = 8000;

// Middleware
app.use(
  cors({
    origin: ["http://localhost:5173", "http://10.50.126.14:5173"],
    methods: ["GET", "POST", "PUT", "DELETE"],
    credentials: true,
  }),
);
app.use(bodyParser.json());

// Configuration for both connection options
const dbConfig = {
  user: "postgres",
  database: "patroneshermosos",
  password: "/BX]#CN!s^xX+]'~*v>^3_K",
  port: "5432",
  ssl: {
    rejectUnauthorized: false,
  }
};

// Connection options
const localConfig = {
  ...dbConfig,
  host: "192.168.1.68" // Replace with your local network IP
};

const publicConfig = {
  ...dbConfig,
  host: "187.212.7.116" // Your public IP
};

// Function to check if we can reach the local server
const isLocalServerReachable = async () => {
  const lookup = promisify(dns.lookup);

  try {
    // Try to establish a quick connection to test reachability
    const testPool = new Pool({
      ...localConfig,
      connectionTimeoutMillis: 1000, // 1 second timeout
    });

    await testPool.query('SELECT 1');
    await testPool.end();
    return true;
  } catch (error) {
    console.log("Local server not reachable, using public IP");
    return false;
  }
};

// Create and export the pool with dynamic configuration
export const createDbPool = async () => {
  const isLocalReachable = await isLocalServerReachable();
  const config = isLocalReachable ? localConfig : publicConfig;

  console.log(`Using ${isLocalReachable ? 'local' : 'public'} database connection`);
  return new Pool(config);
};

// Use an IIFE to initialize the pool
let pool;
(async () => {
  pool = await createDbPool();
})();

export { pool };

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
app.listen(process.env.PORT || 8000, "0.0.0.0", () => {
  console.log(`Server running on port ${process.env.PORT || 8000}`);
});
