
/**
 * @constant SqlErrors
 * @description Se intenta replicar un diccionario inmutable que mapea códigos de error sql
 * con codigos de estado HTTP y mensajes para el usuario . 
 */
const SqlErrors = Object.freeze({
    ER_DUP_ENTRY: {
        statusCode: 400,
        mensaje: "El registro ya existe en el sistema (Dato duplicado)."
    },
    ER_ROW_IS_REFERENCED_2: {
        statusCode: 409,
        mensaje: "No se puede eliminar el registro porque está siendo utilizado en otra parte del sistema."
    },
    ER_NO_REFERENCED_ROW_2: {
        statusCode: 400,
        mensaje: "El ID relacional provisto no existe en la base de datos."
    }
});

module.exports = SqlErrors;