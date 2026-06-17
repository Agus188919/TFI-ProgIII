const Roles = require('../utils/Roles');
const appointmentsDAO = require('../dao/AppointmentDAO');
const doctorsDAO = require('../dao/DoctorsDAO');
const obrasSocialesDAO = require('../dao/OSDAO');
const AppointmentDTO = require('../dtos/AppointmentDTO');
const ErrorException = require('../utils/ErrorException');

/**
 * @class AppointmentsService
 * @description Capa de servicios para la entidad Turnos.
 * Actúa como intermediario entre el controlador y la base de datos.
 * Centraliza la lógica de negocio, validaciones cruzadas y manejo de errores.
 */
class AppointmentsService {
    constructor(appointmentsDAO, doctorsDAO, obrasSocialesDAO) {
        this.appointmentsDAO = appointmentsDAO;
        this.doctorsDAO = doctorsDAO;
        this.obrasSocialesDAO = obrasSocialesDAO;
    }

    /**
     * @method getAll
     * @description Recupera todos los turnos registrados
     * @returns {Promise<Array>} Lista de turnos
     */
    async getAll() {
        const appointments = await this.appointmentsDAO.getAll();
        return appointments.map(appointment => new AppointmentDTO(appointment));
    }

    /**
     * @method getById
     * @description Busca un turno por Id, de no existir, corta el flujo y lanza excepcion
     * @param {number} id: Id del turno.
     * @returns {Promise<Object>} Informacion del turno
     * @throws {ErrorException} Error 404 si el turno no existe o fue dado de baja.
     */
    async getById(id) {
        const appointmentData = await this.appointmentsDAO.getById(id);
        if (!appointmentData) throw new ErrorException("Turno no encontrado o inactivo", 404);

        return new AppointmentDTO(appointmentData);
    }

    /**
     * @method add
     * @description Valida los datos requeridos. Maneja la excepcion especifica
     * @param {Object} bodyInfo: Informacion del turno a agendar
     * @returns {Promise<number>} Id del turno recien creado
     * @throws {ErrorException} Error 400 si faltan datos o si el horario esta ocupado
     */
    async add(bodyInfo) {
        const { id_medico, id_paciente, id_obra_social, fecha_hora } = bodyInfo;
        if (!id_medico || !id_paciente || !id_obra_social || !fecha_hora)
            throw new ErrorException("Datos de reserva incompletos", 400);
        const doctor = await this.doctorsDAO.getById(id_medico);
        if (!doctor) throw new ErrorException("Médico no encontrado", 404); //DOCTOR NO ENCONTRADO
        const obraSocial = await this.obrasSocialesDAO.getById(id_obra_social);
        if (!obraSocial) throw new ErrorException("Obra social no encontrada", 404); //OS NO ENCONTRADDA
        let valor_calculado = 0;
        if (obraSocial.es_particular === 1 || obraSocial.es_particular === true) {
            valor_calculado = doctor.valor_consulta;
        } else {
            const descuento = obraSocial.porcentaje_descuento * doctor.valor_consulta;
            valor_calculado = doctor.valor_consulta - descuento;
        }

        try {
            return await this.appointmentsDAO.createWithTransaction({
                id_medico, id_paciente, id_obra_social, fecha_hora, valor_total: valor_calculado
            });
        } catch (error) {
            if (error.message === "DOCTOR_NOT_AVAILABLE") {
                throw new ErrorException("El médico ya tiene un turno reservado en ese horario", 400); //TURNOS DUPLICADO
            }
            throw error;
        }
    }

    /**
     * @method modify
     * @description Actualiza el estado o el horario de un turno
     * @param {number} id: Id del turno
     * @param {Object} bodyInfo: Nuevos valores a asignar
     * @returns {Promise<boolean>} True si se actualizo correctamente
     * @throws {ErrorException} Error 404 si el turno no existe o esta inactivo
     */
    async modify(id, bodyInfo) {
        const { fecha_hora, atendido } = bodyInfo;
        const modify = await this.appointmentsDAO.modify(id, { fecha_hora, atendido });
        if (!modify) throw new ErrorException("Turno no encontrado o inactivo para actualizar", 404);

        return true;
    }

    /**
     * @method softDelete
     * @description Elimina el turno
     * @param {number} id: ID del turno
     * @returns {Promise<boolean>} True si se genero correctamente la eliminacin
     * @throws {ErrorException} Error 404 si el turno no se pudo encontrar
     */
    async softDelete(id) {
        const deleted = await this.appointmentsDAO.softDelete(id);
        if (!deleted) throw new ErrorException("Turno no encontrado para eliminar", 404);

        return true;
    }

    /**
     * @method getMyAppointments
     * @description Recupera el listado de turnos asociados a un usuario específico, discriminando la búsqueda según su rol.
     * Mapea los resultados crudos de la base de datos en objetos Data Transfer Object (DTO) para estandarizar la respuesta.
     * @param {number} idUsuario - ID interno del usuario autenticado.
     * @param {number} rol - Nivel de acceso/rol del usuario. Medico o Paciente
     * @returns {Promise<Array<AppointmentDTO>>} Arreglo con la información de los turnos formateada.
     * @throws {ErrorException} Lanza un error 403 (Forbidden) si un rol no autorizado intenta acceder a turnos propios
     */
    async getMyAppointments(idUsuario, rol) {
        let turnosCrudos = [];
        if (rol === Roles.MEDICO) {
            turnosCrudos = await this.appointmentsDAO.getByDoctorId(idUsuario);
        } else if (rol === Roles.PACIENTE) {
            turnosCrudos = await this.appointmentsDAO.getByPatientId(idUsuario);
        } else {
            throw new ErrorException("Este rol no tiene turnos propios asociados", 403);
        }

        return turnosCrudos.map(turno => new AppointmentDTO(turno));
    }

    /**
         * @method getClinicStatistics
         * @description Orquesta la petición al DAO para recuperar las estadísticas generales de la clínica 
         * procesadas por un procedimiento almacenado. Valida que el resultado no sea nulo.
         * @returns {Promise<Object>} Objeto con las métricas calculadas
         * @throws {ErrorException} Lanza un error 500 (Internal Server Error) si falla la generación en la base de datos.
         */    async getClinicStatistics() {
        const stats = await this.appointmentsDAO.getStatisticsSP();
        if (!stats) throw new ErrorException("No se pudieron generar las estadísticas", 500);

        return stats;
    }
}

module.exports = new AppointmentsService(appointmentsDAO, doctorsDAO, obrasSocialesDAO);