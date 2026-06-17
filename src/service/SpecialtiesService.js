const specialtiesDAO = require('../dao/SpecialtiesDAO');
const ErrorException = require('../utils/ErrorException');

/**
 * @class SpecialtiesService
 * @description Capa de servicios Especialidades
 * Centraliza las validaciones de negocio y maneja los errores específicos
 * de la bd antes de interactuar con el DAO.
 */
class SpecialtiesService {
    constructor(specialtiesDAO) {
        this.specialtiesDAO = specialtiesDAO;
    }

    /**
     * @method getAll
     * @description Obtiene la lista de todas las especialidades activas
     * @returns {Promise<Array>} Listado de especialidades.
     */
    async getAll() {
        return await this.specialtiesDAO.getAll();
    }

    /**
     * @method getById
     * @description Busca una especialidad por su Id. Lanza un error si no existe.
     * @param {number} id: ID de la especialidad.
     * @returns {Promise<Object>} Datos de la especialidad.
     * @throws {ErrorException} Error 404 si no se encuentra.
     */
    async getById(id) {
        const specialty = await this.specialtiesDAO.getById(id);
        if (!specialty) throw new ErrorException("Especialidad no encontrada o inactiva", 404);

        return specialty;
    }

    /**
     * @method add
     * @description Valida y registra una nueva especialidad, controlando que no haya duplicados en la bd
     * @param {Object} bodyInfo - Objeto con el nombre de la especialidad
     * @returns {Promise<number>} Id de la nueva especialidad
     * @throws {ErrorException} Error 400 si falta el nombre o si la especialidad ya existe
     */
    async add(bodyInfo) {
        const { nombre } = bodyInfo;
        if (!nombre) throw new ErrorException("El nombre de la especialidad es requerido", 400);

        try {
            return await this.specialtiesDAO.add({ nombre });
        } catch (error) {
            if (error.code === 'ER_DUP_ENTRY') throw new ErrorException(`La especialidad '${nombre}' ya existe en el sistema.`, 400);
            throw error;
        }
    }

    /**
     * @method modify
     * @description Modifica el nombre de una especialidad existente.
     * @param {number} id: ID de la especialidad a modificar
     * @param {Object} bodyInfo - Objeto con el nuevo nombre.
     * @returns {Promise<boolean>} True si se actualizo correctamente.
     * @throws {ErrorException} Error 404 si la especialidad no existe o está inactiva.
     */
    async modify(id, bodyInfo) {
        const { nombre } = bodyInfo;
        const modify = await this.specialtiesDAO.modify(id, { nombre });
        if (!modify) throw new ErrorException("Especialidad no encontrada para actualizar", 404);

        return true;
    }

    /**
     * @method softDelete
     * @description Realiza una eliminacion de especialidad
     * @param {number} id - ID de la especialidad a eliminar
     * @returns {Promise<boolean>} True si la eliminación fue exitosa.
     * @throws {ErrorException} Error 404 si no se encuentra.
     */
    async softDelete(id) {
        const deleted = await this.specialtiesDAO.softDelete(id);
        if (!deleted) throw new ErrorException("Especialidad no encontrada para eliminar", 404);

        return true;
    }
}

module.exports = new SpecialtiesService(specialtiesDAO);