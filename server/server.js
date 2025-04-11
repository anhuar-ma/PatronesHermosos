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
export const pool = new Pool({
  user: "postgres",
  host: "177.242.39.31",
  database: "patroneshermosos",
  port: "15432",
  password: "/BX]#CN!s^xX+]'~*v>^3_K",
  ssl: {
    rejectUnauthorized: false, // Only use in development
  },
});

// Add to server.js
app.get("/test", (req, res) => {
  res.send("Server is working");
});

// Routes
app.use("/api/colaboradores", colaboradoresRoutes);
// app.use("/api/participantes", participantesRoutes);

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
