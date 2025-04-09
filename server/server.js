import express from "express";
import pkg from "pg";
const { Pool } = pkg;
import cors from "cors";
import bodyParser from "body-parser";
import colaboradoresRoutes from "./routes/colaboradores.js";

const app = express();
const port = 5000;

// Middleware
app.use(cors());
app.use(bodyParser.json());

// PostgreSQL connection
export const pool = new Pool({
  user: "anhuar",
  host: "localhost",
  database: "patroneshermosos",
  password: "",
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
