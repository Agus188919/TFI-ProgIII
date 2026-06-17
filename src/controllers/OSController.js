const obrasSocialesService = require('../service/OSService');

/**
 * @class ObrasSocialesController
 * @description Controlador para gestionar las peticiones HTTP de la entidad Obras Sociales.
 */
class ObrasSocialesController {

    /**
     * @method getAll
     * @description Recupera el listado completo de todas las obras sociales activas registradas en el sistema.
     * @param {Object} req - Objeto de petición de Express.
     * @param {Object} res - Objeto de respuesta de Express. Retorna un JSON con la lista de obras sociales.
     * @param {Function} next - Middleware global de manejo de errores.
     */
    async getAll(req, res, next) {
        try {
            const obrasSociales = await obrasSocialesService.getAll();
            res.status(200).json({
                status: 'success',
                mensaje: 'Obras sociales obtenidas con éxito',
                datos: obrasSociales
            });
        } catch (error) {
            next(error);
        }
    }

    /**
     * @method getById
     * @description Busca y recupera la información detallada de una obra social específica mediante su ID.
     * @param {Object} req - Objeto de petición de Express. Se espera que contenga el parámetro numérico `id` en la URL.
     * @param {Object} res - Objeto de respuesta de Express. Retorna un JSON con los datos de la obra social solicitada.
     * @param {Function} next - Middleware global de manejo de errores.
     */
    async getById(req, res, next) {
        try {
            const { id } = req.params;
            const obraSocial = await obrasSocialesService.getById(id);
            res.status(200).json({
                status: 'success',
                mensaje: 'Obra social encontrada',
                datos: obraSocial
            });
        } catch (error) {
            next(error);
        }
    }

    /**
     * @method add
     * @description Registra una nueva obra social en la base de datos.
     * @param {Object} req - Objeto de petición de Express. El `req.body` debe contener los datos validados de la obra social 
     * @param {Object} res - Objeto de respuesta de Express. Retorna un código 201 y el ID autoincremental asignado.
     * @param {Function} next - Middleware global de manejo de errores.
     */
    async add(req, res, next) {
        try {
            const insertId = await obrasSocialesService.add(req.body);
            res.status(201).json({
                status: 'success',
                mensaje: 'Obra social registrada exitosamente',
                datos: { id_obra_social: insertId }
            });
        } catch (error) {
            next(error);
        }
    }

    /**
     * @method modify
     * @description Actualiza los datos de una obra social ya existente.
     * @param {Object} req - Objeto de petición de Express. Requiere el `id` en los parámetros de la URL y los nuevos datos en el `req.body`.
     * @param {Object} res - Objeto de respuesta de Express. Retorna un mensaje de éxito.
     * @param {Function} next - Middleware global de manejo de errores.
     */
    async modify(req, res, next) {
        try {
            const { id } = req.params;
            await obrasSocialesService.modify(id, req.body);
            res.status(200).json({
                status: 'success',
                mensaje: 'Obra social actualizada correctamente',
                datos: null
            });
        } catch (error) {
            next(error);
        }
    }

    /**
     * @method softDelete
     * @description Elimina la Obra Social
     * @param {Object} req - Objeto de petición de Express. Requiere el parámetro `id` en la URL.
     * @param {Object} res - Objeto de respuesta de Express. Retorna un mensaje confirmando la baja.
     * @param {Function} next - Middleware global de manejo de errores.
     */
    async softDelete(req, res, next) {
        try {
            const { id } = req.params;
            await obrasSocialesService.softDelete(id);
            res.status(200).json({
                status: 'success',
                mensaje: 'Obra social dada de baja exitosamente',
                datos: null
            });
        } catch (error) {
            next(error);
        }
    }
}

module.exports = new ObrasSocialesController();