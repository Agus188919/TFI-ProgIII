// Cambiamos el import por require y agregamos body y param
const { body, param, validationResult } = require("express-validator");

const handleValidationErrors = (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errores: errors.array() });
    }
    next();
};

const validacionDeUsuario = [
    body('documento')
        .notEmpty().withMessage('El documento es obligatorio')
        .isNumeric().withMessage('El documento debe ser solo números'),
    body('apellido')
        .trim().notEmpty().withMessage('El apellido no puede estar vacío'),
    body('nombres')
        .trim().notEmpty().withMessage('El nombre no puede estar vacío'),
    body('email')
        .isEmail().withMessage('Debe ser un email válido'),
    body('rol')
        .isInt({ min: 1, max: 3 }).withMessage('El rol debe ser un número entre 1 y 3'),
    handleValidationErrors
];

const validacionId = [
    param('id').isInt().withMessage('El ID debe ser un número entero'),
    handleValidationErrors
];

module.exports = { validacionDeUsuario, validacionId };