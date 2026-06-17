const ErrorException = require('../utils/ErrorException');

/**
 * @function RestrictTo
 * @description Middleware para autorizaciones basadas en los diferentes roles definidos
 * Verifica si el rol del usuario ya autenticado coincide con alguno de los roles permitidos
 * @param {...string} allowedRoles - Lista de roles que tienen permiso (ejem: 'admin').
 * @returns {Function} Middleware de Express que evalúa los permisos.
 * @throws {ErrorException} 403 Forbidden si el rol no está en la lista.
 */
const RestrictTo = (...allowedRoles) => {
    return (req, res, next) => {
        if (!allowedRoles.includes(req.user.rol)) {
            return next(new ErrorException("Tu rol no tiene permisos para realizar esta acción.", 403));
        }
        next();
    };
};

module.exports = { RestrictTo };