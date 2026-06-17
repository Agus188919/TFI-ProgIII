// Centralizamos la importación del servicio en la parte superior
const usersService = require('../service/UsersService');

/**
 * @class UsersController
 * @description Controlador central que gestiona todos los tipo de usuarios 
 */
class UsersController {
    constructor(usersService) {
        this.usersService = usersService;
    }

    /**
     * @method getAll
     * @description Recupera todos los usuarios registrados
     */
    getAll = async (req, res, next) => {
        try {
            const users = await this.usersService.getAll();
            res.status(200).json({
                status: true,
                mensaje: "Usuarios obtenidos correctamente",
                datos: users
            });
        } catch (error) {
            next(error);
        }
    }

    /**
     * @method getById
     * @description Recupera un usuario por Id especifico
     */
    getById = async (req, res, next) => {
        try {
            const id = parseInt(req.params.id);
            const user = await this.usersService.getById(id);
            res.status(200).json({
                status: true,
                mensaje: "Usuario encontrado con éxito",
                datos: user
            });
        } catch (error) {
            next(error);
        }
    }

    /**
     * @method add
     * @description Registra un nuevo usuario condicionado por su rol
     */
    add = async (req, res, next) => {
        try {
            const insertId = await this.usersService.add(req.body);
            res.status(201).json({
                status: true,
                mensaje: "Usuario creado correctamente",
                datos: { id_usuario: insertId }
            });
        } catch (error) {
            next(error);
        }
    }

    /**
     * @method modify
     * @description Actualiza la info general de un usuario especifico.
     */
    modify = async (req, res, next) => {
        try {
            const id = parseInt(req.params.id);
            await this.usersService.modify(id, req.body);
            res.status(200).json({
                status: true,
                mensaje: "Usuario actualizado correctamente"
            });
        } catch (error) {
            next(error);
        }
    }

    /**
     * @method softDelete
     * @description Elimina a un usuario
     */
    softDelete = async (req, res, next) => {
        try {
            const id = parseInt(req.params.id);
            await this.usersService.softDelete(id);
            res.status(200).json({
                status: true,
                mensaje: "Usuario dado de baja correctamente"
            });
        } catch (error) {
            next(error);
        }
    }
}

module.exports = new UsersController(usersService);