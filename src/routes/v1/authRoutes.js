const express = require("express");
const router = express.Router();
const authController = require("../../controllers/AuthController");

/**
 * @module AuthRoutes
 * @description Define los endpoints para la autenticacion y acceso al sistema.
 * Estas rutas no requieren token previo, ya que su objetivo es generarlo.
 */

/**
 * @route POST /api/v1/auth/login
 * @description Procesa las credenciales del usuario como el email y la contraseña
 * Si son correctas, devuelve la informacion del perfil junto con el token 
 * necesario para acceder al resto de las rutas protegidas.
 * @access Público
 */
router.post("/login", authController.login);

module.exports = router;