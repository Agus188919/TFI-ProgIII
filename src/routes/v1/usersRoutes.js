const express = require("express");
const userController = require("../../controllers/UsersController");
const validator = require("../../middlewares/validador");
const upload = require('../../middlewares/uploadMiddleware');
const router = express.Router();
const Roles = require("../../utils/Roles");
const { verifyToken } = require("../../middlewares/authMiddleware");
const { RestrictTo: restrictTo } = require("../../middlewares/roleMiddleware");


/**
 * @module UsersRoutes
 * @description Define endpoints para la gestión de usuarios de la clínica.
 * Conecta las peticiones HTTP con los controladores y aplica validaciones previas.
 */

/**
 * @route GET /api/v1/users
 * @description Recupera el listado completo de usuarios registrados.
 */
router.get("/", userController.getAll);

/**
 * @route GET /api/v1/users/:id
 * @description Obtiene un usuario por su ID.
 */
router.get("/:id", userController.getById);

/**
 * @route POST /api/v1/users
 * @description Agregamos un nuevo usuario
 * @middleware validateCreateUser - Verifica que los datos obligatorios estén presentes y sean válidos.
 */
router.post("/", validator.validateCreateUser, userController.add);

/**
 * @route PUT /api/v1/users/:id
 * @description Actualiza la informacion de un usuario ya registrado.
 * @middleware validateUpdateUser >> Verifica el formato de los datos enviados.
 */
router.put("/:id", validator.validateUpdateUser, userController.modify);

/**
 * @route DELETE /api/v1/users/:id
 * @description Elimina a un usuario del sistema por su ID.
 */
router.delete("/:id", verifyToken, restrictTo(Roles.ADMIN), userController.softDelete);

/**
 * @route POST /api/v1/users/:id/foto
 * @description Carga y guarda la foto de perfil del user.
 * @middleware foto >> Procesa la imagen, verifica su formato y la guarda.
 */
router.post('/:id/foto', verifyToken, upload.single('foto'), (req, res, next) => {
    try {
        if (!req.file) { //Verificamos si el archivo llega
            return res.status(400).json({
                status: false,
                mensaje: "No se recibio imagen o el formato no es valido."
            });
        }

        res.status(200).json({ // Todo ok, guardamos
            status: true,
            mensaje: "Imagen subida con éxito",
            ruta: req.file.path
        });
    } catch (error) {
        next(error); // De haber error, se pasa al middleware global de error.
    }
});

module.exports = router;