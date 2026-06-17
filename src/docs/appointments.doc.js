const appointmentsPaths = {
    "/api/v1/appointments": {
        get: {
            summary: "Recupera todos los turnos registrados",
            tags: ["Turnos"],
            security: [{ bearerAuth: [] }],
            responses: {
                200: { description: "Lista de turnos recuperada" }
            }
        },
        post: {
            summary: "Crear un nuevo turno",
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
                                id_obra_social: { type: "integer" },
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
    },
    "/api/v1/appointments/me": {
        get: {
            summary: "Obtiene los turnos propios del usuario logueado",
            tags: ["Turnos"],
            security: [{ bearerAuth: [] }],
            responses: {
                200: { description: "Turnos propios obtenidos correctamente" },
                403: { description: "Rol sin turnos asociados" }
            }
        }
    },
    "/api/v1/appointments/informe/general": {
        get: {
            summary: "Descarga un informe global en PDF con la cantidad total y detalle de turnos",
            description: "Genera un reporte administrativo con estadísticas de pacientes y obras sociales.Solo rol Administrador.",
            tags: ["Turnos"],
            security: [{ bearerAuth: [] }],
            responses: {
                200: {
                    description: "Archivo PDF generado y descargado correctamente",
                    content: {
                        "application/pdf": {
                            schema: {
                                type: "string",
                                format: "binary"
                            }
                        }
                    }
                },
                401: { description: "No autorizado (Falta token o expiró)" },
                403: { description: "Rol sin permisos" },
                500: { description: "Error interno al generar el documento" }
            }
        }
    },
    "/api/v1/appointments/{id}/comprobante": {
        get: {
            summary: "Descarga el comprobante de un turno específico en PDF",
            description: "Genera un archivo PDF con el detalle del turno. Requiere token de autenticación.",
            tags: ["Turnos - Reportes"],
            security: [{ bearerAuth: [] }],
            parameters: [
                {
                    name: "id",
                    in: "path",
                    required: true,
                    description: "ID numérico del turno",
                    schema: { type: "integer" }
                }
            ],
            responses: {
                200: {
                    description: "Archivo PDF generado y descargado correctamente",
                    content: {
                        "application/pdf": {
                            schema: { type: "string", format: "binary" }
                        }
                    }
                },
                401: { description: "No autorizado" },
                404: { description: "Turno no encontrado" },
                500: { description: "Error interno al generar el PDF" }
            }
        }
    }
};

module.exports = appointmentsPaths;