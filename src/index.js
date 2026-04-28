const express = require("express");
const cors = require("cors");

process.loadEnvFile();

const db = require("./config/db");
const usuariosRoutes = require("./routes/usuariosRoutes");
const app = express();

// middlewares
app.use(cors());
app.use(express.json());

// ruta de prueba
app.get("/", (req, res) => {
  res.send("Servidor funcionando");
});

// TEST DB
app.get("/test-db", async (req, res) => {
  try {
    const [rows] = await db.query("SELECT 1 AS conectado");
    res.json(rows);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.use("/api/usuarios", usuariosRoutes);

const PUERTO = process.env.PUERTO;
app.listen(PUERTO || 3000, () => {
  console.log(`Servidor corriendo en ${PUERTO}`);
});