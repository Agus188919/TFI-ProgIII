const db = require('../db/db');

/**
 * @class SpecialtiesDAO
 * @description DAO para la entidad de Especialidades medicas.
 * Gestiona el alta, baja, modificación y consulta de las areas de atencion de la clinica
 */
class SpecialtiesDAO {
    /**
     * @method getAll
     * @description Recupera el listado completo de las especialidades medicas activas
     * @returns {Promise<Array>} Lista de especialidades.
     */
    async getAll() {
        const [rows] = await db.query("SELECT * FROM especialidades WHERE activo = 1");
        return rows;
    }

    /**
     * @method getById
     * @description Busca una especialidad por su Id
     * @param {number} id - ID interno de la especialidad.
     * @returns {Promise<Object|null>} Objeto con los datos de la especialidad o nulo si no existe.
     */
    async getById(id) {
        const [rows] = await db.query("SELECT * FROM especialidades WHERE id_especialidad = ? AND activo = 1", [id]);
        return rows[0] || null;
    }

    /**
     * @method add
     * @description Registra una nueva especialidad medica en el sistema.
     * @param {Object} specialtyInfo - Objeto que contiene los datos de la especialidad 
     * @returns {Promise<number>} Id autoincremental de la nueva especialidad.
     */
    async add(specialtyInfo) {
        const { nombre } = specialtyInfo;

        const [result] = await db.query(
            "INSERT INTO especialidades (nombre, activo) VALUES (?, 1)",
            [nombre]
        );
        return result.insertId;
    }

    /**
     * @method modify
     * @description Actualiza la informacion de una especialidad existente.
     * @param {number} id - Id de la especialidad a modificar.
     * @param {Object} specialtyInfo - Objeto con los nuevos datos.
     * @returns {Promise<boolean>} True si la actualización fue correcta
     */
    async modify(id, specialtyInfo) {
        const { nombre } = specialtyInfo;

        const [result] = await db.query(
            "UPDATE especialidades SET nombre = ? WHERE id_especialidad = ? AND activo = 1",
            [nombre, id]
        );
        return result.affectedRows > 0;
    }

    /**
     * @method softDelete
     * @description Elimina la especialidad
     * @param {number} id - ID de la especialidad a eliminar
     * @returns {Promise<boolean>} True si la baja fue exitosa.
     */
    async softDelete(id) {
        const [result] = await db.query("UPDATE especialidades SET activo = 0 WHERE id_especialidad = ?", [id]);
        return result.affectedRows > 0;
    }
}

module.exports = new SpecialtiesDAO();