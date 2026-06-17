const db = require('../db/db');

/**
 * @class DoctorsDAO
 * @description DAO para profesionales
 * Encapsula las consultas a la db y gestiona la relacion 
 * entre las tablas de profesionales, usuarios  y especialidades.
 */
class DoctorsDAO {
    /**
     * @method getAll
     * @description Recupera todos los medicos, opcionalmente filtrados por especialidad
     * @param {number} [idEspecialidad] - ID de la especialidad (opcional)
     * @returns {Promise<Array>} Listado de medicos registrados y activos.
     */
    async getAll(idEspecialidad = null) {
        let query = `
            SELECT 
                m.id_medico,
                m.matricula, 
                m.descripcion, 
                m.valor_consulta,
                u.id_usuario, 
                u.documento, 
                u.apellido, 
                u.nombres, 
                u.email,
                e.id_especialidad, 
                e.nombre AS especialidad
            FROM medicos m
            INNER JOIN usuarios u ON m.id_usuario = u.id_usuario
            INNER JOIN especialidades e ON m.id_especialidad = e.id_especialidad
            WHERE m.activo = 1 AND u.activo = 1
        `;
        const params = [];

        if (idEspecialidad) {
            query += ` AND m.id_especialidad = ?`;
            params.push(idEspecialidad);
        }

        const [rows] = await db.query(query, params);
        return rows;
    }

    /**
     * @method getById
     * @description Recupera un medico especifico por Id se asegura que el 
     * perfil del medico y el usuario asociado se encuentre activo
     * @param {number} id - ID interno del médico.
     * @returns {Promise<Object|null>} Detalle del medico o fila nula
     */
    async getById(id) {
        const query = `
            SELECT 
                m.id_medico,
                m.matricula,
                m.descripcion,
                m.valor_consulta,
                u.id_usuario,
                u.documento,
                u.apellido,
                u.nombres,
                u.email,
                e.id_especialidad,
                e.nombre AS especialidad
            FROM medicos m
            INNER JOIN usuarios u ON m.id_usuario = u.id_usuario
            INNER JOIN especialidades e ON m.id_especialidad = e.id_especialidad
            WHERE m.id_medico = ? AND m.activo = 1 AND u.activo = 1
        `;
        const [rows] = await db.query(query, [id]);
        return rows[0] || null;
    }

    /**
     * @method add
     * @description Agregamos un profesional medico
     * @param {Object} doctorInfo - Datos del profesional
     * @returns {Promise<number>} ID autoincremental generado en la bd
     */
    async add(doctorInfo) {
        const { id_usuario, id_especialidad, matricula, descripcion, valor_consulta } = doctorInfo;
        const query = `
            INSERT INTO medicos 
            (id_usuario, id_especialidad, matricula, descripcion, valor_consulta, activo) 
            VALUES (?, ?, ?, ?, ?, 1)
        `;
        const [result] = await db.query(query, [id_usuario, id_especialidad, matricula, descripcion, valor_consulta]);
        return result.insertId;
    }

    /**
     * @method modify
     * @description Actualiza la informacion de un profesional médico.
     * @param {number} id - ID del médico a modificar.
     * @param {Object} doctorInfo - Objeto con los nuevos datos a escribir en la bd.
     * @returns {Promise<boolean>} Retorna true si se modifico al menos una fila
     */
    async modify(id, doctorInfo) {
        const { id_especialidad, matricula, descripcion, valor_consulta } = doctorInfo;
        const query = "UPDATE medicos SET id_especialidad = ?, matricula = ?, descripcion = ?, valor_consulta = ? WHERE id_medico = ? AND activo = 1";
        const [result] = await db.query(query, [id_especialidad, matricula, descripcion, valor_consulta, id]);
        return result.affectedRows > 0;
    }

    /**
     * @method softDelete
     * @description Elimina el medico sin afectar al usuario relacionado
     * @param {number} id - ID del medico a dar de baja.
     * @returns {Promise<boolean>} Retorna true si el borrado fue correcto
     */
    async softDelete(id) {
        const [result] = await db.query("UPDATE medicos SET activo = 0 WHERE id_medico = ?", [id]);
        return result.affectedRows > 0;
    }
    /**
     * @method linkObraSocial
     * @description Asocia un médico a una obra social en la tabla intermedia
     */
    async linkOS(id_medico, id_obra_social) {
        const query = `INSERT INTO medicos_obras_sociales (id_medico, id_obra_social) VALUES (?, ?)`;
        const [result] = await db.query(query, [id_medico, id_obra_social]);
        return result.affectedRows > 0;
    }
}

module.exports = new DoctorsDAO();