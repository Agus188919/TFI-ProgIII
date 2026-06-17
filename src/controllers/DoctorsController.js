const doctorsService = require('../service/DoctorsService');

/**
 * @class DoctorsController
 * @description Controlador que gestiona las peticiones HTTP del personal medico
 * Maneja la conexion entre las rutas de la API y la capa de servicios.
 */
class DoctorsController {
    constructor(doctorsService) {
        this.doctorsService = doctorsService;
    }

    /**
     * @method getAll
     * @description Obtiene todos los medicos activos registrados
     */
    /**
       * @method getAll
       * @description Obtiene los medicos activos, con soporte para filtrado por especialidad
       */
    getAll = async (req, res, next) => {
        try {
            const { especialidad } = req.query;
            const doctors = await this.doctorsService.getAll(especialidad);

            res.status(200).json({
                status: true,
                mensaje: "Médicos recuperados con éxito",
                datos: doctors
            });
        } catch (error) {
            next(error);
        }
    }

    /**
     * @method getDoctorById
     * @description Recupera la informacion de un medico por Id.
     */
    getById = async (req, res, next) => {
        try {
            const id = parseInt(req.params.id);
            const doctor = await this.doctorsService.getById(id);
            res.status(200).json({
                status: true,
                mensaje: "Médico encontrado con éxito",
                datos: doctor
            });
        } catch (error) {
            next(error);
        }
    }

    /**
     * @method add
     * @description Registra un nuevo profesional 
     */
    add = async (req, res, next) => {
        try {
            const insertId = await this.doctorsService.add(req.body);
            res.status(201).json({
                status: true,
                mensaje: "Médico registrado con éxito",
                datos: { id_doctor: insertId }
            });
        } catch (error) {
            next(error);
        }
    }

    /**
     * @method modify
     * @description Actualiza los datos de un profesional ya existente
     */
    modify = async (req, res, next) => {
        try {
            const id = parseInt(req.params.id);
            await this.doctorsService.modify(id, req.body);
            res.status(200).json({
                status: true,
                mensaje: "Médico actualizado con éxito"
            });
        } catch (error) {
            next(error);
        }
    }

    /**
     * @method softDelete
     * @description Elimina un medico, especicado por id, del sistema 
     */
    softDelete = async (req, res, next) => {
        try {
            const id = parseInt(req.params.id);
            await this.doctorsService.softDelete(id);
            res.status(200).json({
                status: true,
                mensaje: "Médico eliminado"
            });
        } catch (error) {
            next(error);
        }
    }
    /**
     * @method associateOS
     * @description Endpoint para que el admin asocie un médico a una OS
     */
    associateOS = async (req, res, next) => {
        try {
            const id_medico = parseInt(req.params.id);
            const { id_obra_social } = req.body;

            await this.doctorsService.associateWithObraSocial(id_medico, id_obra_social);

            res.status(200).json({
                status: true,
                mensaje: "Obra social asociada al médico correctamente"
            });
        } catch (error) {
            next(error);
        }
    }
}

module.exports = new DoctorsController(doctorsService);