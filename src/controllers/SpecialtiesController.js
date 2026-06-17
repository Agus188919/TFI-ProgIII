const specialtiesService = require('../service/SpecialtiesService');

/**
 * @class SpecialtiesController
 * @description Controlador que gestiona las peticiones HTTP para las especialidades
 */
class SpecialtiesController {
    constructor(specialtiesService) {
        this.specialtiesService = specialtiesService;
    }

    /**
     * @method getAll
     * @description Recupera todas las especialidades 
     */
    getAll = async (req, res, next) => {
        try {
            const specialties = await this.specialtiesService.getAll();
            res.status(200).json({
                status: true,
                mensaje: "Especialidades recuperadas con éxito",
                datos: specialties
            });
        } catch (error) {
            next(error);
        }
    }

    /**
     * @method getById
     * @description Retorna la especialidad indicada por ID
     */
    getById = async (req, res, next) => {
        try {
            const id = parseInt(req.params.id);
            const specialty = await this.specialtiesService.getById(id);
            res.status(200).json({
                status: true,
                mensaje: "Especialidad encontrada con éxito",
                datos: specialty
            });
        } catch (error) {
            next(error);
        }
    }

    /**
     * @method addSpecialty
     * @description Crea una nueva especialidad medica
     */
    add = async (req, res, next) => {
        try {
            const insertId = await this.specialtiesService.add(req.body);
            res.status(201).json({
                status: true,
                mensaje: "Especialidad registrada con éxito",
                datos: { id_especialidad: insertId }
            });
        } catch (error) {
            next(error);
        }
    }

    /**
     * @method editSpecialty
     * @description Actualiza la informacion de una especialidad ya almacenada
     */
    modify = async (req, res, next) => {
        try {
            const id = parseInt(req.params.id);
            await this.specialtiesService.modify(id, req.body);
            res.status(200).json({
                status: true,
                mensaje: "Especialidad actualizada con éxito"
            });
        } catch (error) {
            next(error);
        }
    }

    /**
     * @method softDelete
     * @description Elimina una especialidad 
     */
    softDelete = async (req, res, next) => {
        try {
            const id = parseInt(req.params.id);
            await this.specialtiesService.softDelete(id);
            res.status(200).json({
                status: true,
                mensaje: "Especialidad eliminada"
            });
        } catch (error) {
            next(error);
        }
    }
}

module.exports = new SpecialtiesController(specialtiesService);