const db = require('../config/db');

const getUsuarios = async (req, res) => {
    try {
        const [rows] = await db.query("SELECT * FROM usuarios WHERE activo = 1");
        res.json(rows);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

const crearUsuario = async (req, res) => {
    try {
        const { documento, apellido, nombres, email, contrasenia, foto_path, rol } = req.body;

        const query = `
      INSERT INTO usuarios 
      (documento, apellido, nombres, email, contrasenia, foto_path, rol, activo) 
      VALUES (?, ?, ?, ?, ?, ?, ?, 1)
    `;

        const [result] = await db.query(query, [documento, apellido, nombres, email, contrasenia, foto_path, rol]);

        res.status(201).json({
            mensaje: "Creado correctamente",
            id_usuario: result.insertId
        });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};
module.exports = {
    getUsuarios,
    crearUsuario
};