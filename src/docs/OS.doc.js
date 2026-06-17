/**
 * @module obrasSocialesDocs
 * @description Documentación modular para la gestión de Obras Sociales
 */
const obrasSocialesPaths = {
    "/api/v1/obras-sociales": {
        get: {
            summary: "Obtiene el listado completo de Obras Sociales",
            tags: ["Obras Sociales"],
            security: [{ bearerAuth: [] }],
            responses: {
                200: { description: "Listado obtenido exitosamente" },
                401: { description: "No autorizado" }
            }
        },
        post: {
            summary: "Registra una nueva Obra Social en el sistema",
            tags: ["Obras Sociales"],
            security: [{ bearerAuth: [] }],
            requestBody: {
                required: true,
                content: {
                    "application/json": {
                        schema: {
                            type: "object",
                            required: ["nombre", "porcentaje_descuento", "es_particular"],
                            properties: {
                                nombre: {
                                    type: "string",
                                    example: "OSDE",
                                    description: "Nombre de la obra social. Maximo 100 caracteres"
                                },
                                porcentaje_descuento: {
                                    type: "number",
                                    format: "float",
                                    example: 0.40,
                                    description: "Decimal entre 0 y 1"
                                },
                                es_particular: {
                                    type: "boolean",
                                    example: false,
                                    description: "True si es particular, False si es os/prepaga"
                                }
                            }
                        }
                    }
                }
            },
            responses: {
                201: { description: "Obra social registrada exitosamente" },
                400: { description: "Error de validación en los datos ingresados" },
                401: { description: "No autorizado" }
            }
        }
    }
};

module.exports = obrasSocialesPaths;