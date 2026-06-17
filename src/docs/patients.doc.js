/**
 * @module patientsDocs
 * @description Documentación modular para las rutas de Pacientes
 */
const patientsPaths = {
    "/api/v1/patients": {
        get: {
            summary: "Obtiene la lista de todos los pacientes activos",
            tags: ["Pacientes"],
            security: [{ bearerAuth: [] }],
            responses: {
                200: { description: "Lista de pacientes obtenida con éxito" }
            }
        },
        post: {
            summary: "Registra un nuevo paciente",
            tags: ["Pacientes"],
            security: [{ bearerAuth: [] }],
            requestBody: {
                required: true,
                content: {
                    "application/json": {
                        schema: {
                            type: "object",
                            properties: {
                                id_usuario: { type: "integer", example: 8 },
                                id_obra_social: { type: "integer", example: 1 },
                                numero_afiliado: { type: "string", example: "123-456789-0" }
                            }
                        }
                    }
                }
            },
            responses: {
                201: { description: "Paciente registrado exitosamente" },
                400: { description: "Error de validación en los datos" }
            }
        }
    },
    "/api/v1/patients/{id}": {
        get: {
            summary: "Obtiene los detalles de un paciente por su ID",
            tags: ["Pacientes"],
            security: [{ bearerAuth: [] }],
            parameters: [
                { name: "id", in: "path", required: true, schema: { type: "integer" } }
            ],
            responses: {
                200: { description: "Paciente encontrado" },
                404: { description: "Paciente no encontrado" }
            }
        },
        put: {
            summary: "Actualiza los datos de cobertura del paciente",
            tags: ["Pacientes"],
            security: [{ bearerAuth: [] }],
            parameters: [
                { name: "id", in: "path", required: true, schema: { type: "integer" } }
            ],
            requestBody: {
                required: true,
                content: {
                    "application/json": {
                        schema: {
                            type: "object",
                            properties: {
                                id_obra_social: { type: "integer", example: 2 },
                                numero_afiliado: { type: "string", example: "987-654321-1" }
                            }
                        }
                    }
                }
            },
            responses: {
                200: { description: "Paciente actualizado correctamente" }
            }
        },
        delete: {
            summary: "Da de baja a un paciente (Soft Delete)",
            tags: ["Pacientes"],
            security: [{ bearerAuth: [] }],
            parameters: [
                { name: "id", in: "path", required: true, schema: { type: "integer" } }
            ],
            responses: {
                200: { description: "Paciente dado de baja exitosamente" }
            }
        }
    }
};

module.exports = patientsPaths;