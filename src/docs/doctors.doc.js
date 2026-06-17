/**
 * @module doctorsDocs
 * @description Documentación modular para las rutas de Médicos
 */
const doctorsPaths = {
    "/api/v1/doctors": {
        get: {
            summary: "Obtiene la lista de todos los médicos activos",
            tags: ["Médicos"],
            security: [{ bearerAuth: [] }],
            responses: {
                200: { description: "Lista de médicos obtenida con éxito" }
            }
        },
        post: {
            summary: "Registra un nuevo médico. Solo Admin",
            tags: ["Médicos"],
            security: [{ bearerAuth: [] }],
            requestBody: {
                required: true,
                content: {
                    "application/json": {
                        schema: {
                            type: "object",
                            required: ["id_usuario", "id_especialidad", "matricula", "valor_consulta"],
                            properties: {
                                id_usuario: { type: "integer", example: 5 },
                                id_especialidad: { type: "integer", example: 2 },
                                matricula: { type: "string", example: "12345" },
                                descripcion: { type: "string", example: "Odontopediatra" },
                                valor_consulta: { type: "number", format: "float", example: 45000.50 }
                            }
                        }
                    }
                }
            },
            responses: {
                201: { description: "Médico registrado exitosamente" },
                400: { description: "Error de validación o datos faltantes" }
            }
        }
    },
    "/api/v1/doctors/{id}": {
        get: {
            summary: "Obtiene los detalles de un médico por su ID",
            tags: ["Médicos"],
            security: [{ bearerAuth: [] }],
            parameters: [
                { name: "id", in: "path", description: "ID del médico", required: true, schema: { type: "integer" } }
            ],
            responses: {
                200: { description: "Médico encontrado" },
                404: { description: "Médico no encontrado" }
            }
        },
        put: {
            summary: "Actualiza los datos de un médico",
            tags: ["Médicos"],
            security: [{ bearerAuth: [] }],
            parameters: [
                { name: "id", in: "path", description: "ID del médico a actualizar", required: true, schema: { type: "integer" } }
            ],
            requestBody: {
                required: true,
                content: {
                    "application/json": {
                        schema: {
                            type: "object",
                            // En tu doctorsDocs.js - Bloque PUT
                            properties: {
                                valor_consulta: { type: "number", example: 18000 },
                                id_especialidad: { type: "integer", example: 2 },
                                matricula: { type: "string", example: "12345" }
                            }
                        }
                    }
                }
            },
            responses: {
                200: { description: "Médico actualizado correctamente" }
            }
        },
        delete: {
            summary: "Eliminación de Médico",
            tags: ["Médicos"],
            security: [{ bearerAuth: [] }],
            parameters: [
                { name: "id", in: "path", description: "ID del médico a dar de baja", required: true, schema: { type: "integer" } }
            ],
            responses: {
                200: { description: "Médico dado de baja exitosamente" }
            }
        }
    },
    "/api/v1/doctors/{id}/obras-sociales": {
        post: {
            summary: "Asocia una obra social a un médico específico",
            tags: ["Médicos"],
            security: [{ bearerAuth: [] }],
            parameters: [
                { name: "id", in: "path", description: "ID del médico", required: true, schema: { type: "integer" } }
            ],
            requestBody: {
                required: true,
                content: {
                    "application/json": {
                        schema: {
                            type: "object",
                            required: ["id_obra_social"],
                            properties: {
                                id_obra_social: { type: "integer", example: 1 }
                            }
                        }
                    }
                }
            },
            responses: {
                201: { description: "Obra social asociada al médico con éxito" },
                400: { description: "Error de validación" },
                404: { description: "Médico u Obra Social no encontrados" }
            }
        }
    }
};

module.exports = doctorsPaths;