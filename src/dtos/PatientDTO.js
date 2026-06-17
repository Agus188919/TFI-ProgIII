/**
 * @class PatientDTO
 * @description Modela la información administrativa del paciente.
 */
class PatientDTO {
    constructor(patient) {
        this.id_paciente = patient.id_paciente;
        this.id_usuario = patient.id_usuario;
        this.documento = patient.documento;
        this.apellido = patient.apellido;
        this.nombres = patient.nombres;
        this.nombreCompleto = `${patient.nombres} ${patient.apellido}`;
        this.email = patient.email;
        this.obraSocial = {
            id_obra_social: patient.id_obra_social,
            nombre: patient.obra_social
        };
    }
}

module.exports = PatientDTO;