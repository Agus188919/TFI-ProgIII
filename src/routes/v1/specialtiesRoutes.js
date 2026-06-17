const Roles = require("../../utils/Roles");
const express = require("express");
const router = express.Router();
const specialtiesController = require("../../controllers/SpecialtiesController");
const validator = require("../../middlewares/validador");
const { verifyToken } = require("../../middlewares/authMiddleware");
const { RestrictTo: restrictTo } = require("../../middlewares/roleMiddleware");

/**
 * @module SpecialtiesRoutes
 * @description Define los endpoints para la gestion de las especialidades
 * Separa el acceso publico del administrativo estricto
 */

/**
 * @route GET /api/v1/specialties
 * @description Recupera el listado completo de especialidades medicas activas.
 * @access Publico
 */
router.get("/", specialtiesController.getAll);

/**
 * @route GET /api/v1/specialties/:id
 * @description Reccupera los detalles de una especialidad especifica por Id
 * @access Publico
 */
router.get("/:id", specialtiesController.getById);

/**
 * @route POST /api/v1/specialties
 * @description Crea una nueva especialidad 
 * @middleware verifyToken: Requiere inicio de sesion
 * @middleware restrictTo: Solo para Administradores.
 * @middleware validateSpecialty: Verifica que el nombre no este vacio
 * @access Privado Critico
 */
router.post("/", verifyToken, restrictTo(Roles.ADMIN), validator.validateSpecialty, specialtiesController.add);

/**
 * @route PUT /api/v1/specialties/:id
 * @description Actualiza el nombre de una especialidad
 * @middleware verifyToken: Requiere inicio de sesion
 * @middleware restrictTo: Solo permitido para admin
 * @middleware validateSpecialty: Aplica las mismas reglas de validacion que la creacion
 * @access Privado Critico
 */
router.put("/:id", verifyToken, restrictTo(Roles.ADMIN), validator.validateSpecialty, specialtiesController.modify);

/**
 * @route DELETE /api/v1/specialties/:id
 * @description Elimina especialidad 
 * @middleware verifyToken: Requiere inicio de sesion
 * @middleware restrictTo: Solo permitido para admis
 * @access Privado Critico
 */
router.delete("/:id", verifyToken, restrictTo(Roles.ADMIN), specialtiesController.softDelete);

module.exports = router;