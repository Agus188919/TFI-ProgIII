const Roles = require("../../utils/Roles");
const express = require("express");
const router = express.Router();
const patientsController = require("../../controllers/PatientsController");
const { verifyToken } = require("../../middlewares/authMiddleware");
const { RestrictTo: restrictTo } = require("../../middlewares/roleMiddleware");

/**
 * @module PatientsRoutes
 * @description Define los endpoints para la gestión de pacientes 
 */

/**
 * @route GET /api/v1/patients
 * @description Obtiene el listado completo de pacientes activos
 * @middleware verifyToken >> Requiere inicio de sesion
 * @middleware restrictTo >> Visible para medicos y administrativo
 * @access Privado 
 */
router.get("/", verifyToken, restrictTo(Roles.ADMIN, Roles.MEDICO), patientsController.getAll);

/**
 * @route GET /api/v1/patients/:id
 * @description Obtiene la informacion medica y personal de un paciente especifico
 * @middleware verifyToken: Requiere inicio de sesion
 * @middleware restrictTo: Visible para medicos y administrativo.
 * @access Privado 
 */
router.get("/:id", verifyToken, restrictTo(Roles.ADMIN, Roles.MEDICO), patientsController.getById);

/**
 * @route POST /api/v1/patients
 * @description Registra un nuevo paciente 
 * @middleware verifyToken: Requiere inicio de sesion
 * @middleware restrictTo: Solo permitido para personal administrativo.
 * @access Privado Estricto
 */
router.post("/", verifyToken, restrictTo(Roles.ADMIN), patientsController.add);

/**
 * @route PUT /api/v1/patients/:id
 * @description Actualiza los datos medicos de un paciente
 * @middleware verifyToken: Requiere inicio de sesion
 * @middleware restrictTo: Solo permitido para personal administrativo
 * @access Privado Estricto 
 */
router.put("/:id", verifyToken, restrictTo(Roles.ADMIN), patientsController.modify);

/**
 * @route DELETE /api/v1/patients/:id
 * @description Elimina a un paciente
 * @middleware verifyToken: Requiere inicio de sesion
 * @middleware restrictTo: Accion limitada al rol Admin
 * @access Privado Critico
 */
router.delete("/:id", verifyToken, restrictTo(Roles.ADMIN), patientsController.softDelete);

module.exports = router;