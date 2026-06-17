const { body, validationResult } = require("express-validator");
const Roles = require('../utils/Roles');

/**
 * @function validateFields
 * @description Middleware interceptor que evalua los resultados de la validacion
 * Si detecta errores, aborta la petición y devuelve un Status 400  manejado
 */
const validateFields = (req, res, next) => {
    const error = validationResult(req);
    if (!error.isEmpty()) {
        return res.status(400).json({
            status: false,
            mensaje: "Error en la validacion de los datos enviados",
            errores: error.array()
        });
    }
    next();
};

/**
 * @constant validateCreateUser
 * @description Validaciones estrictas para registrar un nuevo usuario.
 */
const validateCreateUser = [
    body('documento', 'El documento es obligatorio y debe ser numérico').notEmpty().isNumeric(),
    body('apellido', 'El apellido no puede estar vacío').trim().notEmpty().escape(), //valor plano
    body('nombres', 'El nombre no puede estar vacío').trim().notEmpty().escape(),
    body('email', 'Debe ser un email válido').isEmail().normalizeEmail(), //estandariza el email
    body('contrasenia', 'La contraseña debe tener al menos 6 caracteres').trim().isLength({ min: 6 }), //Contraseña sin espacios
    body('rol', `El rol debe ser valido: Admin (${Roles.ADMIN}), Médico (${Roles.MEDICO}) o Paciente (${Roles.PACIENTE})`)
        .isInt({ min: 1, max: 4 }),
    validateFields
];

/**
 * @constant validateUpdateUser
 * @description Validaciones flexibles para la modificación de un usuario.
 */
const validateUpdateUser = [
    body('documento', 'El documento debe ser numérico').optional().isNumeric(),
    body('apellido', 'El apellido no puede estar vacío').optional().trim().notEmpty().escape(),
    body('nombres', 'El nombre no puede estar vacío').optional().trim().notEmpty().escape(),
    body('email', 'Debe ser un email válido').optional().isEmail().normalizeEmail(),
    body('contrasenia', 'La contraseña debe tener al menos 6 caracteres').optional().trim().isLength({ min: 6 }),
    body('rol', `El rol debe ser válido: Admin (${Roles.ADMIN}), Médico (${Roles.MEDICO}) o Paciente (${Roles.PACIENTE})`)
        .optional().isInt({ min: 1, max: 4 }),
    validateFields
];

/**
 * @constant validateSpecialty
 * @description Validación para garantizar la integridad y seguridad de las especialidades.
 */
const validateSpecialty = [
    body('nombre', 'El nombre de la especialidad es obligatorio y no puede estar vacío').trim().notEmpty().escape(),
    validateFields
];

module.exports = {
    validateCreateUser,
    validateUpdateUser,
    validateSpecialty
};