const patientsDAO = require('../dao/PatientsDAO');
const PatientDTO = require('../dtos/PatientDTO');
const ErrorException = require('../utils/ErrorException');

/**
 * @class PatientsService
 * @description Capa de servicios para los Pacientes
 */
class PatientsService {
    constructor(patientsDAO) {
        this.patientsDAO = patientsDAO;
    }

    /**
     * @method getAll
     * @description Recupera todos los pacientes activos 
     * @returns {Promise<Array>} Lista de pacientes
     */
    async getAll() {
        const patients = await this.patientsDAO.getAll();
        return patients.map(patient => new PatientDTO(patient));
    }

    /**
     * @method getById
     * @description Busca un paciente por su Id. Lanza una excepcon si no existe o fue dado de baja
     * @param {number} id: ID del paciente
     * @returns {Promise<Object>} Datos del paciente
     * @throws {ErrorException} Error 404 si el paciente no existe
     */
    async getById(id) {
        const patient = await this.patientsDAO.getById(id);
        if (!patient) throw new ErrorException("Paciente no encontrado o inactivo", 404);
        return new PatientDTO(patient);
    }

    /**
     * @method registerPatients
     * @description Valida los datos requeridos y asocia un usuario base existente a una os
     * @param {Object} bodyInfo - Objeto con los IDs necesarios
     * @returns {Promise<number>} ID del nuevo registro de paciente.
     * @throws {ErrorException} Error 400 si faltan los IDs obligatorios
     */
    async add(bodyInfo) {
        const { id_usuario, id_obra_social } = bodyInfo;
        if (!id_usuario || !id_obra_social) throw new ErrorException("Los campos id_usuario e id_obra_social son obligatorios", 400);

        return await this.patientsDAO.add({ id_usuario, id_obra_social });
    }

    /**
     * @method modify
     * @description Actualiza la informacion de la os de un paciente existente
     * @param {number} id: Id del paciente a actualizar
     * @param {Object} bodyInfo: Nuevos datos a persistir
     * @returns {Promise<boolean>} True si la actualización fue exitosa.
     * @throws {ErrorException} Error 400 si faltan datos o 404 si el paciente no existe.
     */
    async modify(id, bodyInfo) {
        const { id_obra_social } = bodyInfo;
        if (!id_obra_social) throw new ErrorException("El id_obra_social es obligatorio para actualizar", 400);
        const modify = await this.patientsDAO.modify(id, { id_obra_social });
        if (!modify) throw new ErrorException("Paciente no encontrado o inactivo para actualizar", 404);

        return true;
    }

    /**
     * @method softDelete
     * @description Elimina un paciente
     * @param {number} id: Id del paciente a eliminar
     * @returns {Promise<boolean>} True si la eliminacion fue exitosa
     * @throws {ErrorException} Error 404 si el paciente no se pudo encontrar.
     */
    async softDelete(id) {
        const deleted = await this.patientsDAO.softDelete(id);
        if (!deleted) throw new ErrorException("Paciente no encontrado para eliminar", 404);

        return true;
    }
}

module.exports = new PatientsService(patientsDAO);