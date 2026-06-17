const swaggerUi = require('swagger-ui-express');
const appointmentsPaths = require("../docs/appointments.doc");
const usersPaths = require("../docs/users.doc");
const OSPaths = require("../docs/OS.doc");
const doctorsPaths = require("../docs/doctors.doc");
const patientsPaths = require("../docs/patients.doc");
const specialtiesPaths = require("../docs/specialties.doc");

const swaggerDocumentation = {
    openapi: "3.0.0",
    info: {
        title: "Clínica Médica Florencia Mammana",
        version: "1.0.0",
        description: "Requerimientos y documentación de la API del TFI Prog III."
    },
    servers: [
        {
            url: "http://localhost:3000"
        }
    ],
    components: {
        securitySchemes: {
            bearerAuth: {
                type: "http",
                scheme: "bearer",
                bearerFormat: "JWT"
            }
        }
    },
    security: [{ bearerAuth: [] }],
    paths: {
        ...appointmentsPaths,
        ...usersPaths,
        ...OSPaths,
        ...doctorsPaths,
        ...patientsPaths,
        ...specialtiesPaths
    }
};

const swaggerDocs = (app, port) => {
    app.use('/api/v1/docs', swaggerUi.serve, swaggerUi.setup(swaggerDocumentation));
    console.log(`Documentacion presente en: http://localhost:${port}/api/v1/docs`);
};

module.exports = swaggerDocs;