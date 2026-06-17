const { validationResult } = require('express-validator');

/**
 * @function validateFields
 * @description Middleware interceptor global para la validacion de rutas.
 * Revisa el objeto en busca de errores generados por express-validator.
 * Si encuentra errores, interrumpe el flujo y devuelve un error
 */
const validateFields = (req, res, next) => {
    const errors = validationResult(req); //ERrores de validaciones anteriroes

    if (!errors.isEmpty()) { // Tiramos la conexion si error > 0
        return res.status(400).json({
            status: false,
            mensaje: "Error en los datos enviados",
            errores: errors.mapped()
        });
    }
    next();
};

module.exports = { validateFields };