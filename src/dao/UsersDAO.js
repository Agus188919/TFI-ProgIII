const db = require('../db/db');

/**
 * @class UsersDAO
 * @description DAO para la entidad de Usuarios
 * Centraliza los datos personales, los roles 
 * y las credenciales de acceso para todos los involucrados de la clínica.
 */
class UsersDAO {
    /**
     * @method getAll
     * @description Recupera el listado de todos los usuarios activos en el sistema
     * sin importar su rol
     * @returns {Promise<Array>} Lista completa de usuarios
     */
    async getAll() {
        const [rows] = await db.query("SELECT * FROM usuarios WHERE activo = 1");
        return rows;
    }

    /**
     * @method getById
     * @description Busca los datos de un usuario por Id
     * @param {number} id: ID interno del usuario.
     * @returns {Promise<Object|null>} Objeto con los datos del usuario o nulo  si no existe o si esta inactivo.
     */
    async getById(id) {
        const [rows] = await db.query("SELECT * FROM usuarios WHERE id_usuario = ? AND activo = 1", [id]);
        return rows[0] || null;
    }

    /**
     * @method add
     * @description Registra un nuevo usuario en la base de datos con sus credenciales y rol.
     * @param {Object} userData - Objeto con los datos personales y de acceso del usuario.
     * @returns {Promise<number>} Is autoincremental  enerado para el nuevo usuario.
     */
    async add(userData) {
        const { documento, apellido, nombres, email, contrasenia, foto, rol } = userData;
        const query = `
            INSERT INTO usuarios 
            (documento, apellido, nombres, email, contrasenia, foto_path, rol, activo) 
            VALUES (?, ?, ?, ?, ?, ?, ?, 1)
        `;
        const [result] = await db.query(query, [documento, apellido, nombres, email, contrasenia, foto, rol]);
        return result.insertId;
    }

    /**
     * @method modify
     * @description Actualiza la información general y de contacto del perfil del usuario.
     * @param {number} id - ID del usuario a modificar
     * @param {Object} userData - Objeto con los nuevos datos a persistir.
     * @returns {Promise<boolean>} True si la actualización fue exitosa.
     */
    async modify(id, userData) {
        const { documento, apellido, nombres, email, rol } = userData;
        const query = `
            UPDATE usuarios 
            SET documento = ?, apellido = ?, nombres = ?, email = ?, rol = ? 
            WHERE id_usuario = ? AND activo = 1
        `;
        const [result] = await db.query(query, [documento, apellido, nombres, email, parseInt(rol), id]);
        return result.affectedRows > 0;
    }

    /**
     * @method softDelete
     * @description Elimina usuario, sin eliminar su historial en la bd
     * @param {number} id - ID del usuario a eliminar
     * @returns {Promise<boolean>} True si la baja fue correcta.
     */
    async softDelete(id) {
        const [result] = await db.query("UPDATE usuarios SET activo = 0 WHERE id_usuario = ?", [id]);
        return result.affectedRows > 0;
    }

    /**
     * @method getByEmail
     * @description Busca a un usuario por su correo electronico. 
     * Necesario para el inicio de sesion. 
     * @param {string} email - Correo electrónico a buscar
     * @returns {Promise<Object|null>} Objeto con los datos del usuario 
     */
    async getByEmail(email) {
        const [rows] = await db.query("SELECT * FROM usuarios WHERE email = ? AND activo = 1", [email]);
        return rows[0] || null;
    }
}

module.exports = new UsersDAO();