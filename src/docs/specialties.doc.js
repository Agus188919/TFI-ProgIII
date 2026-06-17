/**
 * @module specialtiesDocs
 * @description Documentación modular para las Especialidades Médicas
 */
const specialtiesPaths = {
    "/api/v1/specialties": {
        get: {
            summary: "Obtiene la lista de especialidades médicas",
            tags: ["Especialidades"],
            security: [{ bearerAuth: [] }],
            responses: {
                200: { description: "Especialidades obtenidas con éxito" }
            }
        },
        post: {
            summary: "Crea una nueva especialidad. Solo Admin",
            tags: ["Especialidades"],
            security: [{ bearerAuth: [] }],
            requestBody: {
                required: true,
                content: {
                    "application/json": {
                        schema: {
                            type: "object",
                            properties: {
                                nombre: { type: "string", example: "Odontologia" },
                                descripcion: { type: "string", example: "Especialidad dedicada a los dientes" }
                            }
                        }
                    }
                }
            },
            responses: {
                201: { description: "Especialidad creada con éxito" },
                400: { description: "El nombre de la especialidad es obligatorio" }
            }
        }
    },
    "/api/v1/specialties/{id}": {
        put: {
            summary: "Modifica una especialidad existente",
            tags: ["Especialidades"],
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
                                nombre: { type: "string", example: "Cardiología Infantil" }
                            }
                        }
                    }
                }
            },
            responses: {
                200: { description: "Especialidad actualizada" }
            }
        },
        delete: {
            summary: "Elimina una especialidad",
            tags: ["Especialidades"],
            security: [{ bearerAuth: [] }],
            parameters: [
                { name: "id", in: "path", required: true, schema: { type: "integer" } }
            ],
            responses: {
                200: { description: "Especialidad eliminada correctamente" }
            }
        }
    }
};

module.exports = specialtiesPaths;