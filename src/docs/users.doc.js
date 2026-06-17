/**
 * @module usersDocs
 * @description Documentación modular para Usuarios y Autenticación
 */
const usersPaths = {
    "/api/v1/users": {
        post: {
            summary: "Registra un nuevo usuario en el sistema",
            tags: ["Autenticación y Usuarios"],
            requestBody: {
                required: true,
                content: {
                    "application/json": {
                        schema: {
                            type: "object",
                            required: ["documento", "apellido", "nombres", "email", "contrasenia", "rol"], // Marcamos los campos obligatorios
                            properties: {
                                documento: { type: "string", example: "99999999", description: "Número de documento de identidad" },
                                apellido: { type: "string", example: "Mammana" },
                                nombres: { type: "string", example: "Florencia" },
                                email: { type: "string", example: "floremammana@gmail.com" },
                                contrasenia: { type: "string", example: "123456" },
                                rol: { type: "integer", example: 3, description: "1: Médico, 2: Paciente, 3: Admin" }
                            }
                        }
                    }
                }
            },
            responses: {
                201: { description: "Usuario registrado con éxito" },
                400: { description: "Error de validación" }
            }
        }
    },
    "/api/v1/auth/login": {
        post: {
            summary: "Inicia sesión y devuelve el token JWT",
            tags: ["Autenticación y Usuarios"],
            requestBody: {
                required: true,
                content: {
                    "application/json": {
                        schema: {
                            type: "object",
                            properties: {
                                email: { type: "string", example: "florammammana@gmail.com" },
                                contrasenia: { type: "string", example: "123456" }
                            }
                        }
                    }
                }
            },
            responses: {
                200: {
                    description: "Login exitoso",
                    content: {
                        "application/json": {
                            schema: {
                                type: "object",
                                properties: {
                                    status: { type: "string", example: "success" },
                                    mensaje: { type: "string", example: "Login exitoso" },
                                    token: { type: "string", example: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..." }
                                }
                            }
                        }
                    }
                },
                401: { description: "Credenciales inválidas" }
            }
        }
    },
    "/api/v1/users/{id}/foto": {
        post: {
            summary: "Subir o actualizar la foto de perfil de un usuario",
            tags: ["Autenticación y Usuarios"],
            security: [{ bearerAuth: [] }],
            parameters: [
                {
                    name: "id",
                    in: "path",
                    description: "ID del usuario al que se le subirá la foto",
                    required: true,
                    schema: { type: "integer" }
                }
            ],
            requestBody: {
                required: true,
                content: {
                    "multipart/form-data": {
                        schema: {
                            type: "object",
                            properties: {
                                foto: {
                                    type: "string",
                                    format: "binary",
                                    description: "Imagen de perfil. Formatos: JPG/PNG, Max: 5MB"
                                }
                            }
                        }
                    }
                }
            },
            responses: {
                200: { description: "Imagen subida con éxito" },
                400: { description: "Error de validación (El archivo no es una imagen o supera los 5MB)" }
            }
        }
    }
};

module.exports = usersPaths;