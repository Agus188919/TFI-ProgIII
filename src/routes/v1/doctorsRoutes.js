const express = require("express");
const router = express.Router();
const doctorsController = require("../../controllers/DoctorsController");
const Roles = require("../../utils/Roles");
const { check } = require('express-validator');
const { validateFields } = require('../../middlewares/validatorMiddleware');
const { verifyToken } = require("../../middlewares/authMiddleware");
const { RestrictTo: restrictTo } = require("../../middlewares/roleMiddleware");

/**
 * @module DoctorsRoutes
 * @description Define los endpoints para la gestion del personal medico
 * Implementa seguridad por token y control de acceso basado en roles  
 * para restringir la modificacion solo a personal administrativo.
 */

/**
 * @route GET /api/v1/doctors
 * @description Recupera el listado completo de medicos activos 
 * @access Público
 */
router.get("/", doctorsController.getAll);

/**
 * @route GET /api/v1/doctors/:id
 * @description Obtiene los detalles de un medico especifico
 * @middleware verifyToken >> Requiere que el usuario haya iniciado sesion.
 * @access Privado 
 */
router.get("/:id", verifyToken, doctorsController.getById);

/**
 * @route POST /api/v1/doctors
 * @description Registra un nuevo profesional medico en el sistema.
 * @middleware verifyToken >> Requiere inicio de sesion
 * @middleware restrictTo >> Solo se permite para Administradores 
 * @access Privado Estricto
 */
router.post(
    "/",
    verifyToken,
    restrictTo(Roles.ADMIN),
    [
        check('id_usuario', 'El ID de usuario es obligatorio y numérico').notEmpty().isInt(),
        check('id_especialidad', 'El ID de especialidad es obligatorio y numérico').notEmpty().isInt(),
        check('matricula', 'La matrícula es obligatoria').notEmpty().isString(),
        check('valor_consulta', 'El valor de consulta debe ser numérico').notEmpty().isNumeric(),
        validateFields
    ],
    doctorsController.add
);

/**
 * @route PUT /api/v1/doctors/:id
 * @description Actualiza los datos profesionales (matrícula, especialidad) de un médico.
 * @middleware verifyToken - Requiere inicio de sesión.
 * @middleware restrictTo - Solo permitido para Administradores 
 * @access Privado Estricto
 */
router.put(
    "/:id",
    verifyToken,
    restrictTo(Roles.ADMIN),
    [
        check('id_especialidad', 'El ID de especialidad debe ser numérico').optional().isInt(),
        check('matricula', 'La matrícula debe ser una cadena de texto').optional().isString(),
        check('valor_consulta', 'El valor de consulta debe ser numérico').optional().isNumeric(),
        validateFields
    ],
    doctorsController.modify
);

/**
 * @route DELETE /api/v1/doctors/:id
 * @description Elimina a un medico del sistema.
 * @middleware verifyToken - Requiere inicio de sesión.
 * @middleware restrictTo - Solo permitido para Administradores 
 * @access Privado Estricto
 */
router.delete("/:id", verifyToken, restrictTo(Roles.ADMIN), doctorsController.softDelete);
/**
 * @route POST /api/v1/doctors/:id/obras-sociales
 * @description Asocia un médico a una obra social (Tabla intermedia)
 */
router.post("/:id/obras-sociales", verifyToken, restrictTo(Roles.ADMIN), doctorsController.associateOS);

module.exports = router;