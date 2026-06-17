const db = require('../db/db');

/**
 * @class AppointmentsDAO
 * @description DAO para Turnos
 * Encapsula todas las consultas de la bd, gestiona operaciones simples
 *  y transacciones complejas.
 */
class AppointmentsDAO {
    /**
     * @method getAll
     * @description REcupera todos los turnos activos
     * @returns {Promise<Array>} Lista de turnos con los datos de medicos, pacientes y os 
     */
    async getAll() {
        const query = `
            SELECT 
                t.id_turno_reserva, 
                t.fecha_hora, 
                t.valor_total, 
                t.atendido,
                um.apellido AS medico_apellido, 
                um.nombres AS medico_nombre,
                e.nombre AS especialidad,
                up.apellido AS paciente_apellido, 
                up.nombres AS paciente_nombre, 
                up.documento AS paciente_documento,
                os.nombre AS obra_social
            FROM turnos_reservas t
            INNER JOIN medicos m ON t.id_medico = m.id_medico
            INNER JOIN usuarios um ON m.id_usuario = um.id_usuario
            INNER JOIN especialidades e ON m.id_especialidad = e.id_especialidad
            INNER JOIN pacientes p ON t.id_paciente = p.id_paciente
            INNER JOIN usuarios up ON p.id_usuario = up.id_usuario
            INNER JOIN obras_sociales os ON t.id_obra_social = os.id_obra_social
            WHERE t.activo = 1
            ORDER BY t.fecha_hora ASC
        `;
        const [rows] = await db.query(query);
        return rows;
    }

    /**
     * @method getById
     * @description Busca un turno activo por Id especifico
     * @param {number} id - ID del turno a buscar.
     * @returns {Promise<Object|null>} Turno completo o nulo
     */
    async getById(id) {
        const query = `
            SELECT 
                t.id_turno_reserva, 
                t.fecha_hora, 
                t.valor_total, 
                t.atendido,
                um.apellido AS medico_apellido, 
                um.nombres AS medico_nombre,
                e.nombre AS especialidad,
                up.apellido AS paciente_apellido, 
                up.nombres AS paciente_nombre, 
                up.documento AS paciente_documento,
                os.nombre AS obra_social
            FROM turnos_reservas t
            INNER JOIN medicos m ON t.id_medico = m.id_medico
            INNER JOIN usuarios um ON m.id_usuario = um.id_usuario
            INNER JOIN especialidades e ON m.id_especialidad = e.id_especialidad
            INNER JOIN pacientes p ON t.id_paciente = p.id_paciente
            INNER JOIN usuarios up ON p.id_usuario = up.id_usuario
            INNER JOIN obras_sociales os ON t.id_obra_social = os.id_obra_social
            WHERE t.id_turno_reserva = ? AND t.activo = 1
        `;
        const [rows] = await db.query(query, [id]);
        return rows[0] || null;
    }

    /**
     * @method add
     * @description Agrega turno sin validacion
     */
    async add(appointmentInfo) {
        const { id_medico, id_paciente, id_obra_social, fecha_hora, valor_total } = appointmentInfo;
        const query = `
            INSERT INTO turnos_reservas 
            (id_medico, id_paciente, id_obra_social, fecha_hora, valor_total, atendido, activo) 
            VALUES (?, ?, ?, ?, ?, 0, 1)
        `;
        const [result] = await db.query(query, [id_medico, id_paciente, id_obra_social, fecha_hora, valor_total]);
        return result.insertId;
    }

    /**
     * @method modify
     * @description Actualiza el horario o el estado de atencion de un turno.
     */
    async modify(id, appointmentInfo) {
        const { fecha_hora, atendido } = appointmentInfo;
        const query = "UPDATE turnos_reservas SET fecha_hora = ?, atendido = ? WHERE id_turno_reserva = ? AND activo = 1";
        const [result] = await db.query(query, [fecha_hora, atendido, id]);
        return result.affectedRows > 0;
    }

    /**
    * @method getByDoctorId
    * @description Busca y retorna todos los turnos activos asignados a un médico, 
    * cruzando la información a través de su ID de usuario 
    * @param {number} idUsuario - ID del usuario con rol Médico.
    * @returns {Promise<Array>} Lista de turnos en formato crudo desde la base de datos.
     */
    async getByDoctorId(idUsuario) {
        const query = `
            SELECT tr.* FROM turnos_reservas tr
            INNER JOIN medicos m ON tr.id_medico = m.id_medico
            WHERE m.id_usuario = ? AND tr.activo = 1
        `;
        const [rows] = await db.query(query, [idUsuario]);
        return rows;
    }

    /**
    * @method getByPatientId
    * @description Busca y retorna todos los turnos activos agendados por un paciente, 
    * cruzando la información a través de su ID de usuario 
    * @param {number} idUsuario - ID del usuario con rol Paciente.
    * @returns {Promise<Array>} Lista de turnos en formato crudo desde la base de datos.
    */    async getByPatientId(idUsuario) {
        const query = `
            SELECT tr.* FROM turnos_reservas tr
            INNER JOIN pacientes p ON tr.id_paciente = p.id_paciente
            WHERE p.id_usuario = ? AND tr.activo = 1
        `;
        const [rows] = await db.query(query, [idUsuario]);
        return rows;
    }
    /**
     * @method softDelete
     * @description Elimina un turno
     */
    async softDelete(id) {
        const [result] = await db.query("UPDATE turnos_reservas SET activo = 0 WHERE id_turno_reserva = ?", [id]);
        return result.affectedRows > 0;
    }

    /**
     * @method getStatisticsSP
     * @description Ejecuta el procedimiento almacenado "generar_estadisticas" en la base de datos.
     * Como MySQL devuelve múltiples resultados al usar un call, se accede a la posición [0][0] 
     * para extraer y retornar únicamente el objeto plano con las métricas calculadas.
     * @returns {Promise<Object>} Objeto con las estadísticas generales 
     */
    async getStatisticsSP() {
        const [rows] = await db.query("CALL generar_estadisticas()");
        return rows[0][0]; // Devolvemos el objeto plano con los 4 números
    }
    /**
     * @method createWithTransaction
     * @description Medoto para agendar turnos, se realiza bloqueo de modificacion
     * para asegurar que no haya superposicion de turnos cuando existe alta demanda
     * @param {Object} appointmentInfo: Datos del turno a registrar
     * @throws {Error} Si el profesional ya tiene un turno activo en esa misma fecha y hora.
     */
    async createWithTransaction(appointmentInfo) {
        const { id_medico, id_paciente, id_obra_social, fecha_hora, valor_total } = appointmentInfo;
        const connection = await db.getConnection();

        try {
            await connection.beginTransaction();
            const checkQuery = `
                SELECT id_turno_reserva FROM turnos_reservas 
                WHERE id_medico = ? AND fecha_hora = ? AND activo = 1 
                FOR UPDATE
            `;
            const [existing] = await connection.query(checkQuery, [id_medico, fecha_hora]);
            if (existing.length > 0) throw new Error("DOCTOR_NOT_AVAILABLE");

            const insertQuery = `
                INSERT INTO turnos_reservas 
                (id_medico, id_paciente, id_obra_social, fecha_hora, valor_total, atendido, activo)
                VALUES (?, ?, ?, ?, ?, 0, 1)
            `;
            const [result] = await connection.query(insertQuery, [id_medico, id_paciente, id_obra_social, fecha_hora, valor_total]);

            await connection.commit();
            return result.insertId;

        } catch (error) {
            await connection.rollback(); // Anteo fallo pateo la transaccion
            throw error;
        } finally {
            connection.release(); //Libero la conexion para no saturar el poll
        }
    }
}

module.exports = new AppointmentsDAO();