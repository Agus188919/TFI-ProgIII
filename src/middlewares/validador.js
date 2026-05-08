const { body, param, validationResult } = require("express-validator");

// Función única para capturar y mostrar errores
const validarCampos = (req, res, next) => {
    const errores = validationResult(req);
    if (!errores.isEmpty()) {
        return res.status(400).json({ 
            ok: false,
            errores: errores.array() 
        });
    }
    next();
};

// Reglas específicas
const validacionDeUsuario = [
    body('documento', 'El documento es obligatorio y debe ser numérico').isNumeric(),
    body('apellido', 'El apellido no puede estar vacío').trim().notEmpty(),
    body('nombres', 'El nombre no puede estar vacío').trim().notEmpty(),
    body('email', 'Debe ser un email válido').isEmail(),
    body('contrasenia', 'La contraseña debe tener al menos 6 caracteres').isLength({ min: 6 }),
    body('rol', 'El rol debe ser un número entre 1 y 3').isInt({ min: 1, max: 3 }),
    validarCampos
];

module.exports = { 
    validarCampos, 
    validacionDeUsuario 
};