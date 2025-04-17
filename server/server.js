import express from "express";
import pkg from "pg";
const { Pool } = pkg;
import cors from "cors";
import bodyParser from "body-parser";
import colaboradoresRoutes from "./routes/colaboradores.js";

const app = express();
const port = 5000;

// Middleware
app.use(
  cors({
    origin: ["http://localhost:5173", "http://10.50.126.14:5173"],
    methods: ["GET", "POST", "PUT", "DELETE"],
    credentials: true,
  }),
);
app.use(bodyParser.json());

// PostgreSQL connection

// export const pool = new Pool({
//   user: process.env.DB_USER || "postgres",
//   host: process.env.DB_HOST || "localhost",
//   database: process.env.DB_NAME || "patroneshermosos",
//   password: process.env.DB_PASSWORD || "/BX]#CN!s^xX+]'~*v>^3_K",
//   ssl: process.env.DB_SSL === "true" ? true : false,
// });
//
export const pool = new Pool({
  user: "postgres",
  host: "177.242.39.31",
  database: "patroneshermosos",
  password: "/BX]#CN!s^xX+]'~*v>^3_K",
  port: "15432",
  ssl: {
    rejectUnauthorized: false, // This allows self-signed certificates
  },
});

// Add to server.js
app.get("/test", (req, res) => {
  res.send("Server is working");
});

// Routes
app.use("/api/colaboradores", colaboradoresRoutes);
// app.use("/api/participantes", participantesRoutes);

// Listen on all interfaces
app.listen(process.env.PORT || 5000, "0.0.0.0", () => {
  console.log(`Server running on port ${process.env.PORT || 5000}`);
});
