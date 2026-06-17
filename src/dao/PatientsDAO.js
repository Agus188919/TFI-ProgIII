const db = require('../db/db');

/**
 * @class PatientsDAO
 * @description DAO para la entidad de Pacientes
 * Gestiona la relacion entre los datos médicos como
 * la os y los datos personales como el usuario.
 */
class PatientsDAO {
    /**
     * @method getAll
     * @description Recupera todos los pacientes registrados y activos, 
     * incluyendo su información personal y os
     * @returns {Promise<Array>} Lista de pacientes.
     */
    async getAll() {
        const query = `
            SELECT 
                p.id_paciente,
                u.id_usuario,
                u.documento,
                u.apellido,
                u.nombres,
                u.email,
                os.id_obra_social,
                os.nombre AS obra_social
            FROM pacientes p
            INNER JOIN usuarios u ON p.id_usuario = u.id_usuario
            INNER JOIN obras_sociales os ON p.id_obra_social = os.id_obra_social
            WHERE u.activo = 1
        `;
        const [rows] = await db.query(query);
        return rows;
    }

    /**
     * @method getById
     * @description Busca un paciente por ID corroborando que su usuario 
     * se encuentre activo.
     * @param {number} id - ID de paciente.
     * @returns {Promise<Object|null>} Objeto con los datos del paciente o nulo
     */
    async getById(id) {
        const query = `
            SELECT 
                p.id_paciente,
                u.id_usuario,
                u.documento,
                u.apellido,
                u.nombres, 
                u.email, 
                os.id_obra_social,
                os.nombre AS obra_social
            FROM pacientes p
            INNER JOIN usuarios u ON p.id_usuario = u.id_usuario
            INNER JOIN obras_sociales os ON p.id_obra_social = os.id_obra_social
            WHERE p.id_paciente = ? AND u.activo = 1
        `;
        const [rows] = await db.query(query, [id]);
        return rows[0] || null;
    }

    /**
     * @method add
     * @description Agrega un nuevo paciente asociando un usuario existente a una os.
     * @param {Object} patientInfo - Objeto con los IDs de usuario y os.
     * @returns {Promise<number>} ID autoincremental del nuevo paciente.
     */
    async add(patientInfo) {
        const { id_usuario, id_obra_social } = patientInfo;
        const query = `
            INSERT INTO pacientes (id_usuario, id_obra_social) 
            VALUES (?, ?)
        `;
        const [result] = await db.query(query, [id_usuario, id_obra_social]);
        return result.insertId;
    }

    /**
     * @method modify
     * @description Actualiza solo los datos de la os del paciente.
     * @param {number} id - ID del paciente a modificar.
     * @param {Object} patientInfo - Objeto con el nuevo id_obra_social.
     * @returns {Promise<boolean>} True si la actualización fue exitosa.
     */
    async modify(id, patientInfo) {
        const { id_obra_social } = patientInfo;
        const query = `
            UPDATE pacientes 
            SET id_obra_social = ? 
            WHERE id_paciente = ?
        `;
        const [result] = await db.query(query, [id_obra_social, id]);
        return result.affectedRows > 0;
    }

    /**
     * @method softDelete
     * @description Elimina un paciente
     * @param {number} id - ID del paciente a dar de baja.
     * @returns {Promise<boolean>} True si el usuario fue desactivado correctamente
     */
    async softDelete(id) {
        const patient = await this.getById(id);

        if (!patient) return false;

        const query = "UPDATE usuarios SET activo = 0 WHERE id_usuario = ?";
        const [result] = await db.query(query, [patient.id_usuario]);
        return result.affectedRows > 0;
    }
}

module.exports = new PatientsDAO();