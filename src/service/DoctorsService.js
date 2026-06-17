const doctorsDAO = require('../dao/DoctorsDAO');
const DoctorDTO = require('../dtos/DoctorDTO');
const ErrorException = require('../utils/ErrorException');

/**
 * @class DoctorsService
 * @description Capa de servicios para medicos
 * Centraliza las validaciones y actua como puente entre el 
 * controlador y el acceso a datos 
 */
class DoctorsService {
    constructor(doctorsDAO) {
        this.doctorsDAO = doctorsDAO;
    }

    /**
     * @method getAll
     * @description Recupera la lista de todos los medicos activos 
     * @returns {Promise<Array>} Listado de profesionales.
     */
    async getAll(idEspecialidad = null) {
        const doctorsData = await this.doctorsDAO.getAll(idEspecialidad);
        return doctorsData.map(doc => new DoctorDTO(doc));;
    }
    /**
     * @method getById
     * @description Busca un prefesional por su Id. Lanza un error si no existe o esta inactivo
     * @param {number} id: Id del medico a buscar
     * @returns {Promise<Object>} Infoirmacion del medico
     * @throws {ErrorException} Error 404 si el profesional no se encuentra
     */
    async getById(id) {
        const doctor = await this.doctorsDAO.getById(id);
        if (!doctor) throw new ErrorException("Médico no encontrado o inactivo", 404);
        return new DoctorDTO(doctor);
    }

    /**
     * @method add
     * @description Valida la informacion requerida y registra el perfil profesional de un nuevo profesional
     * @param {Object} bodyInfo: Datos profesionales a registrar
     * @returns {Promise<number>} Id del medico creado
     * @throws {ErrorException} Error 400 si faltan datos obligatorios
     */
    async add(bodyInfo) {
        const { id_usuario, id_especialidad, matricula, descripcion, valor_consulta } = bodyInfo;
        if (!id_usuario || !id_especialidad || !matricula || valor_consulta === undefined)
            throw new ErrorException("Los campos id_usuario, id_especialidad, matricula y valor_consulta son obligatorios", 400);

        return await this.doctorsDAO.add({ id_usuario, id_especialidad, matricula, descripcion, valor_consulta });
    }

    /**
     * @method modify
     * @description Actualiza los datos profesionales de un medico que ya existe
     * @param {number} id: Id del medico a modificar
     * @param {Object} bodyInfo: Nuevos datos a almacenar
     * @returns {Promise<boolean>} True si la actualziacion fue exitosa
     * @throws {ErrorException} Error 404 si el profesional no existe o esta inactivo
     */
    async modify(id, bodyInfo) {
        const { id_especialidad, matricula, descripcion, valor_consulta } = bodyInfo;
        const modify = await this.doctorsDAO.modify(id, { id_especialidad, matricula, descripcion, valor_consulta }); //corregir 
        if (!modify) throw new ErrorException("Médico no encontrado o inactivo para actualizar", 404);

        return true;
    }

    /**
     * @method softDelete
     * @description Elimnina un profesional
     * @param {number} id: Id del profesional
     * @returns {Promise<boolean>} True si el borrado fue correcto
     * @throws {ErrorException} Error 404 si el profesional no se pudo encontrar
     */
    async softDelete(id) {
        const deleted = await this.doctorsDAO.softDelete(id);
        if (!deleted) throw new ErrorException("Médico no encontrado para eliminar", 404);

        return true;
    }
    async associateWithObraSocial(id_medico, id_obra_social) {
        if (!id_medico || !id_obra_social) throw new ErrorException("Faltan datos para la asociación", 400);
        return await this.doctorsDAO.linkOS(id_medico, id_obra_social);
    }
}

module.exports = new DoctorsService(doctorsDAO);