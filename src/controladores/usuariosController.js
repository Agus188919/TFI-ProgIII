const db = require('../db/db');

const usuariosController = {

    // Browse
    getUsuarios: async (req, res) => {
        try {
            const [rows] = await db.query("SELECT * FROM usuarios WHERE activo = 1");
            res.json(rows);
        } catch (error) {
            res.status(500).json({ status: false, mensaje: "Error al obtener usuarios", error: error.message });
        }
    },

    // Add
    crearUsuario: async (req, res) => {
        try {
            const { documento, apellido, nombres, email, contrasenia, foto_path, rol } = req.body;

            // Ajuste: manejamos nulos y aseguramos números
            const foto = foto_path || null;
            const rolNum = parseInt(rol);

            const query = `
                INSERT INTO usuarios 
                (documento, apellido, nombres, email, contrasenia, foto_path, rol, activo) 
                VALUES (?, ?, ?, ?, ?, ?, ?, 1)
            `;

            const [result] = await db.query(query, [documento, apellido, nombres, email, contrasenia, foto, rolNum]);

            res.status(201).json({
                status: true,
                mensaje: "Creado correctamente",
                id_usuario: result.insertId
            });
        } catch (error) {
            res.status(500).json({ status: false, mensaje: "Error al crear usuario", error: error.message });
        }
    },

    // Read
    getUsuarioById: async (req, res) => {
        try {
            const id = parseInt(req.params.id);
            const [rows] = await db.query("SELECT * FROM usuarios WHERE id_usuario = ?", [id]);

            if (rows.length === 0) {
                return res.status(404).json({ status: false, mensaje: "Usuario no encontrado" });
            }
            res.json(rows[0]);
        } catch (error) {
            res.status(500).json({ status: false, mensaje: "Error al obtener usuario", error: error.message });
        }
    },

    // Edit
    editarUsuario: async (req, res) => {
        try {
            const id = parseInt(req.params.id);
            const { documento, apellido, nombres, email, rol } = req.body;

            const [result] = await db.query(
                "UPDATE usuarios SET documento=?, apellido=?, nombres=?, email=?, rol=? WHERE id_usuario=?",
                [documento, apellido, nombres, email, parseInt(rol), id]
            );

            if (result.affectedRows === 0) {
                return res.status(404).json({ status: false, mensaje: "Usuario no encontrado para actualizar" });
            }

            res.json({ status: true, mensaje: "Usuario actualizado correctamente" });
        } catch (error) {
            res.status(500).json({ status: false, mensaje: "Error al actualizar", error: error.message });
        }
    },

    // Delete
    eliminarUsuario: async (req, res) => {
        try {
            const id = parseInt(req.params.id);
            const [result] = await db.query("UPDATE usuarios SET activo = 0 WHERE id_usuario = ?", [id]);

            if (result.affectedRows === 0) {
                return res.status(404).json({ status: false, mensaje: "Usuario no encontrado para eliminar" });
            }

            res.json({ status: true, mensaje: "Usuario dado de baja (lógica)" });
        } catch (error) {
            res.status(500).json({ status: false, mensaje: "Error al eliminar", error: error.message });
        }
    }
}

module.exports = usuariosController;