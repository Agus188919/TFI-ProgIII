const { Server } = require("socket.io");

const configureSockets = (server, app) => {
    const io = new Server(server, {
        cors: {
            origin: "*",
            methods: ["GET", "POST"]
        }
    });

    io.on("connection", (socket) => {
        console.log(`Conectado: ${socket.id}`);

        socket.on("disconnect", () => {
            console.log(`Desconectado: ${socket.id}`);
        });
    });

    app.set("io", io);
};

module.exports = configureSockets;