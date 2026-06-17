const { check } = require('express-validator');
const { validateFields } = require('../middlewares/validatorMiddleware');
/**
 * @constant validateOS
 * @description Reglas de validación para la creación y edición de obras sociales.
 */
const validateOS = [
    check('nombre')
        .exists().withMessage('El nombre de la obra social es requerido')
        .notEmpty().withMessage('El nombre no puede estar vacío')
        .isString().withMessage('El nombre debe ser una cadena de texto')
        .isLength({ max: 100 }).withMessage('El nombre no puede exceder los 100 caracteres'),

    check('porcentaje_descuento')
        .exists().withMessage('El porcentaje de descuento es requerido')
        .isFloat({ min: 0, max: 1 }).withMessage('El porcentaje debe ser un número decimal entre 0 y 1'),

    check('es_particular')
        .exists().withMessage('El campo es_particular es requerido')
        .isBoolean().withMessage('El campo es_particular debe ser un valor booleano'),
    validateFields
];

module.exports = { validateOS: validateOS };