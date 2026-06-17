const appointmentsService = require('../service/AppointmentsService');
const Roles = require('../utils/Roles');

/**
 * @class AppointmentsController
 * @description Controlador que gestiona las peticiones HTTP para turnos.
 * Intermediario entre los paths de Express y la capa de servicios.
 */
class AppointmentsController {
    constructor(appointmentsService) {
        this.appointmentsService = appointmentsService;
    }

    /**
     * @method getAll
     * @description Se recupera todos los turnos registrados
     */
    getAll = async (req, res, next) => {
        try {
            const appointments = await this.appointmentsService.getAll();
            res.status(200).json({
                status: true,
                mensaje: "Turnos recuperados",
                datos: appointments
            });
        } catch (error) {
            next(error);
        }
    }

    /**
     * @method getMyAppointments
     * @description Recupera los turnos asociados al usuario autenticado.
     * Dependiendo de su rol, el servicio filtrará y devolverá 
     * únicamente los turnos que le correspondan a su perfil.
     * @param {Object} req - Objeto de petición de Express. Requiere que `req.user` contenga el `id_usuario` y `rol` inyectados por el token JWT.
     * @param {Object} res - Objeto de respuesta de Express. Retorna un JSON con el listado de turnos.
     * @param {Function} next - Middleware global de manejo de errores.
     */
    getMyAppointments = async (req, res, next) => {
        try {
            const userId = req.user.id_usuario;
            const rol = req.user.rol;
            const appointments = await appointmentsService.getMyAppointments(userId, rol);

            res.status(200).json({
                status: 'success',
                mensaje: 'Mis turnos fueron recuperados correctamente',
                datos: appointments
            });
        } catch (error) {
            next(error);
        }
    }
    /**
     * @method getById
     * @description Busca y retorna el detalle del turno especificado por Id. 
     */
    getById = async (req, res, next) => {
        try {
            const id = parseInt(req.params.id);
            const appointment = await this.appointmentsService.getById(id);
            res.status(200).json({
                status: true,
                mensaje: "Turno encontrado con éxito",
                datos: appointment
            });
        } catch (error) {
            next(error);
        }
    }

    /**
     * @method add
     * @description Registra un nuevo turno y envia un evento de socket
     * para notificar a los clientes conectados en tiempo real.
     */
    add = async (req, res, next) => {
        try {
            const appointmentInfo = req.body;
            const usuarioLogueado = req.user;

            if (usuarioLogueado.rol === Roles.PACIENTE) {
                if (!appointmentInfo.id_paciente) {
                    return res.status(400).json({
                        status: false,
                        mensaje: "Como paciente, debes enviar tu id_paciente."
                    });
                }
            }

            const insertId = await this.appointmentsService.add(appointmentInfo);

            const io = req.app.get('io');
            io.emit('nuevo_turno', {
                mensaje: "¡Alerta! Se acaba de registrar un nuevo turno.",
                id_turno_reserva: insertId,
                fecha: appointmentInfo.fecha_hora
            });

            res.status(201).json({
                status: true,
                mensaje: "Turno registrado con éxito",
                datos: { id_appointment: insertId }
            });
        } catch (error) {
            next(error);
        }
    }

    /**
     * @method modify
     * @description Se actualiza la informacion de un turno ya existente.
     */
    modify = async (req, res, next) => {
        try {
            const id = parseInt(req.params.id);
            await this.appointmentsService.modify(id, req.body);
            res.status(200).json({
                status: true,
                mensaje: "Turno actualizado con éxito"
            });
        } catch (error) {
            next(error);
        }
    }

    /**
     * @method softDelete
     * @description Elimina un turno del sistema
     */
    softDelete = async (req, res, next) => {
        try {
            const id = parseInt(req.params.id);
            await this.appointmentsService.softDelete(id);
            res.status(200).json({
                status: true,
                mensaje: "Turno eliminado con éxito (baja lógica)"
            });
        } catch (error) {
            next(error);
        }
    }

    /**
     * @method getStatistics
     * @description Ejecuta y recupera las estadísticas generales de la clínica 
     * Delega la lógica matemática a un procedimiento almacenado en la base de datos.
     * @param {Object} req - Objeto de petición de Express.
     * @param {Object} res - Objeto de respuesta de Express. Retorna un JSON con las métricas calculadas.
     * @param {Function} next - Middleware global de manejo de errores.
     */
    getStatistics = async (req, res, next) => {
        try {
            const statistics = await appointmentsService.getClinicStatistics();
            res.status(200).json({
                status: 'success',
                mensaje: 'Estadísticas generadas',
                datos: statistics
            });
        } catch (error) {
            next(error);
        }
    }
}

module.exports = new AppointmentsController(appointmentsService);