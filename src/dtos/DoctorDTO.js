/**
 * @class DoctorDTO
 * @description Modela la información pública del staff médico.
 */
class DoctorDTO {
    constructor(doctor) {
        this.id_medico = doctor.id_medico;
        this.matricula = doctor.matricula;
        this.descripcion = doctor.descripcion;
        this.valor_consulta = doctor.valor_consulta;
        this.id_usuario = doctor.id_usuario;
        this.apellido = doctor.apellido;
        this.nombres = doctor.nombres;
        this.nombreCompleto = `${doctor.nombres} ${doctor.apellido}`;
        this.email = doctor.email;
        this.documento = doctor.documento;
        this.especialidad = {
            id_especialidad: doctor.id_especialidad,
            nombre: doctor.especialidad
        };
    }
}

module.exports = DoctorDTO;