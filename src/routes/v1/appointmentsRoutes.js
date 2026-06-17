const express = require("express");
const { check } = require('express-validator');
const { validateFields } = require('../../middlewares/validatorMiddleware');
const { verifyToken } = require("../../middlewares/authMiddleware");
const { RestrictTo: restrictTo } = require("../../middlewares/roleMiddleware");
const router = express.Router();
const appointmentsController = require("../../controllers/AppointmentsController");
const appointmentsConfirmationController = require("../../controllers/AppointmentsConfirmationController");
const Roles = require("../../utils/Roles");

/**
 * @fileoverview Enrutador para la gestión de turnos médicos de la clínica.
 * Define las rutas y los middlewares de validación, autenticación y autorización (RBAC).
 */

/**
 * @name GET /me
 * @description Obtiene los turnos propios del usuario autenticado. 
 * El servicio filtra internamente dependiendo de si el usuario logueado es médico o paciente.
 * @access Privado - Solo usuarios con rol MEDICO o PACIENTE.
 */
router.get("/me", verifyToken, restrictTo(Roles.MEDICO, Roles.PACIENTE), appointmentsController.getMyAppointments);

/**
 * @name GET /
 * @description Recupera el listado de todos los turnos registrados en el sistema.
 * @access Privado - Requiere token válido.
 */
router.get("/", verifyToken, appointmentsController.getAll);

/**
 * @name GET /stats
 * @description Ejecuta y recupera las estadísticas generales de la clínica delegando la lógica a un procedimiento almacenado.
 * @access Privado - Solo usuarios con rol ADMIN.
 */
router.get("/stats", verifyToken, restrictTo(Roles.ADMIN), appointmentsController.getStatistics);

/**
 * @name GET /:id
 * @description Busca y retorna el detalle completo de un turno específico por su ID.
 * @param {string} id - Identificador único del turno 
 * @access Público/Privado
 */
router.get("/:id", appointmentsController.getById);

/**
 * @name GET /:id/comprobante
 * @description Genera y permite la descarga mediante streams de un comprobante en formato PDF para un turno específico.
 * @param {string} id - Identificador único del turno 
 * @access Privado - Requiere token válido.
 */
router.get('/:id/comprobante', verifyToken, appointmentsConfirmationController.downloadReceipt);

/**
 * @name POST /
 * @description Registra un nuevo turno validando de forma estricta los datos enviados en el cuerpo de la petición.
 * Emite un evento en tiempo real vía WebSockets al crearse con éxito.
 * @access Privado - Roles permitidos: PACIENTE, MEDICO, ADMIN.
 * @param {Object} req.body - Payload de la petición.
 * @param {number} req.body.id_medico - ID del médico (Obligatorio, numérico).
 * @param {number} req.body.id_obra_social - ID de la obra social (Obligatorio, numérico).
 * @param {string} req.body.fecha_hora - Fecha y hora de la reserva (Obligatorio, string).
 */
router.post(
    "/",
    verifyToken, // Tiene que estar logueado si o si
    restrictTo(Roles.PACIENTE, Roles.MEDICO, Roles.ADMIN), // Permiso ampliado para que el admin saque por paciente o medico
    [
        check('id_medico', 'El ID del médico es obligatorio y numérico').notEmpty().isInt(),
        check('id_obra_social', 'El ID de obra social es obligatorio y numérico').notEmpty().isInt(),
        check('fecha_hora', 'La fecha y hora son obligatorias').notEmpty().isString(),
        validateFields
    ],
    appointmentsController.add
);

/**
 * @name PUT /:id
 * @description Actualiza la información de un turno ya existente. Permite modificar el horario o el estado de atención.
 * @param {string} id - Identificador único del turno a modificar
 * @access Privado - Solo usuarios con rol MEDICO o ADMIN.
 * @param {Object} req.body - Payload con los campos a actualizar.
 * @param {string} [req.body.fecha_hora] - Nueva fecha y hora (Opcional).
 * @param {boolean} [req.body.atendido] - Estado de atención médica (Opcional, booleano).
 */
router.put(
    "/:id",
    verifyToken,
    restrictTo(Roles.MEDICO, Roles.ADMIN),
    [
        check('fecha_hora', 'La fecha debe ser válida').optional().isString(),
        check('atendido', 'El estado de atendido debe ser booleano o numérico').optional().isBoolean(),
        validateFields
    ],
    appointmentsController.modify
);

/**
 * @name DELETE /:id
 * @description Aplica una baja lógica (Soft Delete) al turno especificado, manteniendo la integridad del historial.
 * @param {string} id - Identificador único del turno a eliminar 
 * @access Privado - Solo usuarios con rol ADMIN.
 */
router.delete("/:id", verifyToken, restrictTo(Roles.ADMIN), appointmentsController.softDelete);

/**
 * @name GET /informe/general
 * @description Genera y permite la descarga de un reporte global de la clínica en formato PDF utilizando streams.
 * @access Privado - Ruta exclusiva para usuarios con rol ADMIN.
 */
// Ruta exclusiva para el Administrador
router.get('/informe/general', verifyToken, restrictTo(Roles.ADMIN), appointmentsConfirmationController.generateReceiptGlobal);

module.exports = router;