const express = require("express");
const http = require("http");
const cors = require("cors");
const morgan = require("morgan");

process.loadEnvFile();

const v1Routes = require("./routes/v1/index");
const errorHandler = require("./middlewares/errorHandler");
const swaggerDocs = require("./config/swagger.config");
const configureSockets = require("./config/socket.config");

const app = express();
const server = http.createServer(app);

configureSockets(server, app);

const corsOptions = {
  origin: ['http://localhost:4200', 'http://localhost:5173'],
  optionsSuccessStatus: 200
};

app.use(cors(corsOptions));
app.use(morgan("dev"));
app.use(express.json());
app.use("/api/v1", v1Routes);

const PORT = process.env.PUERTO || 3000;

swaggerDocs(app, PORT);

app.use(errorHandler);

server.listen(PORT, () => {
  console.log(`Corriendo S&S en el puerto ${PORT}`);
});