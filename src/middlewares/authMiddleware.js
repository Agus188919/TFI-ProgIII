const jwt = require('jsonwebtoken');
const ErrorException = require('../utils/ErrorException');

/**
 * @function verifyToken
 * @description Middleware que intercepta las peticiones protegidas. 
 * Se Extrae, valida y decodifica el token JWT enviado.
 * De ser valido, se inyecta el payload
 */
const verifyToken = async (req, res, next) => {
    let token;
    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) // Extraigo token de cabecera
        token = req.headers.authorization.split(' ')[1];
    if (!token)
        return next(new ErrorException("Acceso denegado. Por favor, iniciá sesión para continuar.", 401)); //No hay token, no hay acceso

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.user = decoded;
        next();
    } catch (error) {
        if (error.name === 'TokenExpiredError') {
            return next(new ErrorException("Tu sesión ha expirado. Por favor, iniciá sesión nuevamente.", 401)); // Diferencio tipo de error
        }
        return next(new ErrorException("El token proporcionado es inválido o está corrupto.", 401));
    }
};

module.exports = { verifyToken };