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




//DELETE y búsqueda x id

const eliminarUsuario = async (req, res) => {
    try {
        const { id } = req.params;                
        const [usuario] = await db.execute("SELECT id_usuario FROM usuarios WHERE id_usuario = ? AND activo = 1", [id]);    
        if (usuario.length === 0) {
            return res.status(404).json({ mensaje: "usuario no existe o  fue borrado" });
        } 
        await db.execute("UPDATE usuarios SET activo = 0 WHERE id_usuario = ?", [id]);        
        res.json({ mensaje: "Usuario eliminado " });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

const usuarioById = async (req, res) => {
    try {
        const id = req.params.id;            
        const query = "SELECT * FROM usuarios WHERE id_usuario = ? AND activo = 1";
        const [rows] = await db.execute(query, [id]);         
        if (rows.length === 0) {
            return res.status(404).json({ mensaje: "Usuario no encontrado" });
        }
        
        res.json(rows[0]);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};


const editarUsuario = async (req, res) => {
    try {
        const { id } = req.params;
        const { documento, apellido, nombres, email, contrasenia, foto_path, rol } = req.body;
        const [usuario] = await db.execute("SELECT id_usuario FROM usuarios WHERE id_usuario = ? AND activo = 1", [id]);
        
        if (usuario.length === 0) {
            return res.status(404).json({ mensaje: "Usuario no encontrado para editar" });
        }

        const query = `
            UPDATE usuarios 
            SET documento = ?, apellido = ?, nombres = ?, email = ?, contrasenia = ?, foto_path = ?, rol = ?
            WHERE id_usuario = ?
        `;

        await db.execute(query, [documento, apellido, nombres, email, contrasenia, foto_path, rol, id]);

        res.json({ mensaje: "Usuario actualizado correctamente" });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

module.exports = {
    getUsuarios,
    crearUsuario,
    eliminarUsuario,
    usuarioById,
    editarUsuario
    
};
