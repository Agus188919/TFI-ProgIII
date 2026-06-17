const oSDAO = require('../dao/OSDAO');
const ErrorException = require('../utils/ErrorException');
const OSDTO = require('../dtos/OSDTO');

/**
 * @class ObrasSocialesService
 * @description Lógica de negocio para la gestión de coberturas médicas y obras sociales.
 */
class OSService {
    constructor(oSDAO) {
        this.oOSSDAO = oSDAO;
    }

    /**
     * @method getAll
     * @description Recupera el listado de todas las obras sociales activas y las formatea utilizando OSDTO >> ObraSocialDTO.
     * @returns {Promise<Array<OSDTO>>} Arreglo de objetos con la información de las obras sociales estandarizada.
     */
    async getAll() {
        const insurancesProvider = await this.oOSSDAO.getAll();
        return insurancesProvider.map(os => new OSDTO(os));
    }

    /**
     * @method getById
     * @description Busca una obra social por su ID y la formatea con el DTO. Valida su existencia antes de retornar.
     * @param {number} id - ID numérico de la obra social a buscar.
     * @returns {Promise<OSDTO>} Objeto OSDTO con los datos de la obra social.
     * @throws {ErrorException} Lanza error 404 si la obra social no existe o fue dada de baja.
     */
    async getById(id) {
        const insuranceProvider = await this.oOSSDAO.getById(id);
        if (!insuranceProvider) throw new ErrorException("Obra social no encontrada o inactiva", 404);

        return new OSDTO(insuranceProvider);
    }

    /**
     * @method add
     * @description Valida los datos obligatorios y registra una nueva cobertura médica. 
     * Captura errores de unicidad de la base de datos y los transforma en errores HTTP controlados.
     * @param {Object} bodyInfo - Objeto con los datos enviados en la petición.
     * @param {string} bodyInfo.nombre - Nombre de la obra social.
     * @param {number} bodyInfo.porcentaje_descuento - Porcentaje de cobertura.
     * @param {boolean|number} bodyInfo.es_particular - Indicador de si es un paciente particular.
     * @returns {Promise<number>} ID autoincremental de la obra social recién creada.
     * @throws {ErrorException} Lanza error 400 si faltan datos o si el nombre ya está registrado.
     */
    async add(bodyInfo) { //revisar nombres
        const { nombre, porcentaje_descuento, es_particular } = bodyInfo;
        if (!nombre || porcentaje_descuento === undefined || es_particular === undefined)
            throw new ErrorException("Todos los campos (nombre, porcentaje_descuento, es_particular) son requeridos", 400);

        try {
            return await this.oOSSDAO.add({ nombre, porcentaje_descuento, es_particular });
        } catch (error) {
            if (error.code === 'ER_DUP_ENTRY') {
                throw new ErrorException(`La obra social '${nombre}' ya existe.`, 400);
            }
            throw error;
        }
    }

    /**
     * @method modify
     * @description Valida la entrada y actualiza los campos de una obra social existente.
     * @param {number} id - ID de la obra social a actualizar.
     * @param {Object} bodyInfo - Objeto con los nuevos valores.
     * @returns {Promise<boolean>} Retorna true si la operación de modificación fue exitosa.
     * @throws {ErrorException} Lanza error 400 si faltan datos y 404 si la obra social no se encontró en la BD.
     */
    async modify(id, bodyInfo) {
        const { nombre, porcentaje_descuento, es_particular } = bodyInfo;
        if (!nombre || porcentaje_descuento === undefined || es_particular === undefined)
            throw new ErrorException("Datos incompletos para actualizar", 400);

        const modify = await this.oOSSDAO.modify(id, { nombre, porcentaje_descuento, es_particular });
        if (!modify) throw new ErrorException("Obra social no encontrada para actualizar", 404);

        return true;
    }

    /**
     * @method softDelete
     * @description Delega la petición de baja lógica de una obra social al DAO.
     * @param {number} id - ID de la obra social a dar de baja.
     * @returns {Promise<boolean>} Retorna true si la baja lógica se aplicó correctamente.
     * @throws {ErrorException} Lanza error 404 si el registro no existía previamente.
     */
    async softDelete(id) {
        const deleted = await this.oOSSDAO.softDelete(id);
        if (!deleted) throw new ErrorException("Obra social no encontrada para eliminar", 404);

        return true;
    }
}

module.exports = new OSService(oSDAO);