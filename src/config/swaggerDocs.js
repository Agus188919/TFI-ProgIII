
const swaggerDocumentation = {
    openapi: "3.0.0",
    info: {
        title: "Clinica Medica Florencia Mammana",
        version: "1.0.0",
        description: "Requerimiento y Documentación."
    },
    components: {
        securitySchemes: {
            bearerAuth: {
                type: "http",
                scheme: "bearer",
                bearerFormat: "JWT",
            }
        }
    },
    paths: {
        "/api/v1/appointments": {
            post: {
                summary: "Crear un turno medico",
                tags: ["Turnos"],
                security: [{ bearerAuth: [] }],
                requestBody: {
                    required: true,
                    content: {
                        "application/json": {
                            schema: {
                                type: "object",
                                properties: {
                                    id_medico: { type: "integer" },
                                    id_paciente: { type: "integer" },
                                    fecha_hora: { type: "string", example: "2026-06-15 10:30:00" },
                                    valor_total: { type: "number" }
                                }
                            }
                        }
                    }
                },
                responses: {
                    201: { description: "Turno creado correctamente" },
                    400: { description: "Error de validación" }
                }
            }
        }
    }
};

module.exports = swaggerDocumentation;