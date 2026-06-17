const express = require("express");
const { check } = require('express-validator');
const { validateFields } = require('../../middlewares/validatorMiddleware');
const { verifyToken } = require("../../middlewares/authMiddleware");
const { RestrictTo: restrictTo } = require("../../middlewares/roleMiddleware");
const router = express.Router();
const appointmentsController = require("../../controllers/AppointmentsController");
const appointmentsConfirmationController = require("../../controllers/AppointmentsConfirmationController");
const Roles = require("../../utils/Roles");

router.get("/me", verifyToken, restrictTo(Roles.MEDICO, Roles.PACIENTE), appointmentsController.getMyAppointments);
router.get("/", verifyToken, appointmentsController.getAll);
router.get("/stats", verifyToken, restrictTo(Roles.ADMIN), appointmentsController.getStatistics);
router.get("/:id", appointmentsController.getById);
router.get('/:id/comprobante', verifyToken, appointmentsConfirmationController.downloadReceipt);
router.post(
    "/",
    verifyToken, // Tiene que estarr logueado si o si
    restrictTo(Roles.PACIENTE, Roles.MEDICO, Roles.ADMIN), // Permiso ampliado para que el admin saque por paciente o medico
    [
        check('id_medico', 'El ID del médico es obligatorio y numérico').notEmpty().isInt(),
        check('id_obra_social', 'El ID de obra social es obligatorio y numérico').notEmpty().isInt(),
        check('fecha_hora', 'La fecha y hora son obligatorias').notEmpty().isString(),
        validateFields
    ],
    appointmentsController.add
);
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
router.delete("/:id", verifyToken, restrictTo(Roles.ADMIN), appointmentsController.softDelete);

// Ruta exclusiva para el Administrador
router.get('/informe/general', verifyToken, restrictTo(Roles.ADMIN), appointmentsConfirmationController.generateReceiptGlobal);
module.exports = router;