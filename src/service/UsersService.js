const usersDAO = require('../dao/UsersDAO');
const ErrorException = require('../utils/ErrorException');
const UserDTO = require('../dtos/UserDTO');
const bcrypt = require('bcryptjs');

/**
 * @class UsersService
 * @description Capa de servicios para la entidad de Usuarios
 */
class UsersService {
    constructor(usersDAO) {
        this.usersDAO = usersDAO;
    }

    /**
     * @method getAll
     * @description Obtiene el listado completo de usuarios activos 
     * @returns {Promise<Array>} Lista de usuarios.
     */
    async getAll() {
        const users = await this.usersDAO.getAll();
        return users.map(user => new UserDTO(user));
    }

    /**
     * @method getById
     * @description Busca un usuario por su ID. Lanza una excepción si no existe.
     * @param {number} id - ID del usuario.
     * @returns {Promise<Object>} Datos del usuario.
     * @throws {ErrorException} Error 404 si el usuario no es encontrado.
     */
    async getById(id) {
        const user = await this.usersDAO.getById(id);
        if (!user) throw new ErrorException("Usuario no encontrado o inactivo", 404);
        return new UserDTO(user);
    }

    /**
     * @method add
     * @description Encripta la contraseña de forma segura y registra un nuevo usuario.
     * @param {Object} bodyInfo - Datos personales y de acceso del nuevo usuario.
     * @returns {Promise<number>} ID autoincremental del usuario creado.
     * @throws {ErrorException} Error 400 si faltan datos críticos 
     */
    async add(bodyInfo) {
        const { documento, apellido, nombres, email, contrasenia, foto_path, rol } = bodyInfo;
        if (!email || !contrasenia || !rol)
            throw new ErrorException("El email, la contraseña y el rol son campos obligatorios", 400);
        const salt = await bcrypt.genSalt(10);
        const hashedKey = await bcrypt.hash(contrasenia, salt);

        return await this.usersDAO.add({
            documento,
            apellido,
            nombres,
            email,
            foto: foto_path || null,
            rol: parseInt(rol),
            contrasenia: hashedKey
        });
    }

    /**
     * @method modify
     * @description Actualiza los datos generales de un usuario existente.
     * @param {number} id: ID del usuario a modificar.
     * @param {Object} bodyInfo: Nuevos datos a persistir
     * @returns {Promise<boolean>} True si la actualización fue exitosa.
     * @throws {ErrorException} Error 404 si el usuario no existe o está inactivo.
     */
    async modify(id, bodyInfo) {
        const modify = await this.usersDAO.modify(id, bodyInfo);
        if (!modify) throw new ErrorException("Usuario no encontrado o inactivo para actualizar", 404);

        return true;
    }

    /**
     * @method softDelete
     * @description Aplica una baja lógica al usuario para revocar su acceso al sistema.
     * @param {number} id: ID del usuario a dar de baja.
     * @returns {Promise<boolean>} True si la baja fue exitosa.
     * @throws {ErrorException} Error 404 si el usuario no se pudo encontrar.
     */
    async softDelete(id) {
        const deleted = await this.usersDAO.softDelete(id);
        if (!deleted) throw new ErrorException("Usuario no encontrado para eliminar", 404);

        return true;
    }
}

module.exports = new UsersService(usersDAO);