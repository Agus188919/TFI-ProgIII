const usersDAO = require('../dao/UsersDAO');
const UserDTO = require('../dtos/UserDTO');
const ErrorException = require('../utils/ErrorException');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

/**
 * @class AuthService
 * @description Capa de servicios para la autentificacion de usuarios
 * Gestiona la validacion de credenciales 
 */
class AuthService {
    constructor(usersDAO) {
        this.usersDAO = usersDAO;
    }

    /**
     * @method login
     * @description Verifica las credenciales del usuario y genera su token de acceso.
     * @param {string} email: Correo electronico ingresado.
     * @param {string} contrasenia : Contraseña en texto plano a verificar
     * @returns {Promise<Object>} Objeto que contiene el token y los datos del usuario
     * @throws {ErrorException} Error 400 si faltan datos, o 401 si las credenciales son incorrectas.
     */
    async login(email, contrasenia) {
        if (!email || !contrasenia) throw new ErrorException("Email y contraseña requeridos", 400);
        const user = await this.usersDAO.getByEmail(email);
        if (!user) throw new ErrorException("Email o contraseña inválidos", 401);
        console.log("contra: " + contrasenia);
        console.log("contra user: " + user.contrasenia);
        const keyValid = await bcrypt.compare(contrasenia, user.contrasenia);
        if (!keyValid) throw new ErrorException("Email o contraseña inválidos", 401);

        const payload = {
            id_usuario: user.id_usuario,
            rol: user.rol,
            email: user.email
        };

        const token = jwt.sign(payload, process.env.JWT_SECRET, {
            expiresIn: process.env.JWT_EXPIRES_IN,
        });

        return {
            token,
            usuario: new UserDTO(user)
        };
    }
}

module.exports = new AuthService(usersDAO);