const patientsService = require('../service/PatientsService');

/**
 * @class PatientsController
 * @description Controlador que gestiona las operaciones HTTP de los pacientes
 * Representa el nexo entre las rutas de express y la logica de PatientsService.
 */
class PatientsController {
    constructor(patientsService) {
        this.patientsService = patientsService;
    }

    /**
     * @method getAll
     * @description Recupera todos los pacientes registrados
     */
    getAll = async (req, res, next) => {
        try {
            const patients = await this.patientsService.getAll();
            res.status(200).json({
                status: true,
                mensaje: "Pacientes recuperados con éxito",
                datos: patients
            });
        } catch (error) {
            next(error);
        }
    }

    /**
     * @method getById
     * @description Busca y recupera un paciente por Id.
     */
    getById = async (req, res, next) => {
        try {
            const id = parseInt(req.params.id);
            const patient = await this.patientsService.getById(id);
            res.status(200).json({
                status: true,
                mensaje: "Paciente encontrado con éxito",
                datos: patient
            });
        } catch (error) {
            next(error);
        }
    }

    /**
     * @method add
     * @description Agrega un nuevo paciente
     */
    add = async (req, res, next) => {
        try {
            const insertId = await this.patientsService.add(req.body);
            res.status(201).json({
                status: true,
                mensaje: "Paciente registrado con éxito",
                datos: { id_paciente: insertId }
            });
        } catch (error) {
            next(error);
        }
    }

    /**
     * @method modify
     * @description Actualiza la informacion de un paciente especifico 
     * Se debe tener en cuenta que solo se permite actualizar la OS desde este endpoint
     */
    modify = async (req, res, next) => {
        try {
            const id = parseInt(req.params.id);
            const { id_obra_social } = req.body; // Solo recupero el campo permitido

            await this.patientsService.modify(id, { id_obra_social });

            res.status(200).json({
                status: true,
                mensaje: "Obra social del paciente actualizada con éxito"
            });
        } catch (error) {
            next(error);
        }
    }

    /**
     * @method deletePatient
     * @description Elimina a un paciente
     */
    softDelete = async (req, res, next) => {
        try {
            const id = parseInt(req.params.id);
            await this.patientsService.softDelete(id);
            res.status(200).json({
                status: true,
                mensaje: "Paciente eliminado con éxito (baja lógica)"
            });
        } catch (error) {
            next(error);
        }
    }
}

module.exports = new PatientsController(patientsService);