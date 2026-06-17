const SqlErrors = require('../utils/dbErrors');

/**
 * @function errorHandler
 * @description Se captan todos los errores de la app.
 * Traduce los errores sql usando un diccionario y protege información 
 * sensible.
 */
const errorHandler = (err, req, res, next) => {
    console.error(`[FATAL ERROR]: ${err.message}`);
    let statusCode = err.statusCode || 500;
    let mensaje = err.message || "Error interno del servidor";
    if (err.code && SqlErrors[err.code]) {
        statusCode = SqlErrors[err.code].statusCode;
        mensaje = SqlErrors[err.code].mensaje;
    }

    const response = {
        status: false,
        mensaje: mensaje
    };
    if (process.env.NODE_ENV === 'development') response.errorStack = err.stack;

    res.status(statusCode).json(response); // Envio de respuesta.
};

module.exports = errorHandler;