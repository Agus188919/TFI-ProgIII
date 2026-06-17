const authService = require('../service/AuthService');

/**
 * @class AuthController
 * @description Controlador que gestiona la autenticacion y el acceso a la app
 * Valida credenciales y coordina con el servicio para la creacion de tokens
 */
class AuthController {
    constructor(authService) {
        this.authService = authService;
    }

    /**
     * @method login
     * @description Procesa la solicitud de login. Si las credenciales son corecctas, 
     * devuelve los datos del user junto con su token de acceso.
     */
    login = async (req, res, next) => {
        try {
            const { email, contrasenia } = req.body;
            const result = await this.authService.login(email, contrasenia);

            res.status(200).json({
                status: true,
                mensaje: "Inicio de sesión exitoso",
                datos: result
            });
        } catch (error) {
            next(error);
        }
    }
}

module.exports = new AuthController(authService);