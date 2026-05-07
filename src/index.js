const express = require("express");
const cors = require("cors");
const morgan = require("morgan");

process.loadEnvFile();

const db = require("./db/db");
const v1Routes = require("./rutas/v1/index");

const app = express();

// middlewares
app.use(cors());
app.use(morgan("dev"));
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

app.use("/api/v1", v1Routes);

const PUERTO = process.env.PUERTO || 3000;
app.listen(PUERTO, () => {
  console.log(`Servidor corriendo en ${PUERTO}`);
});