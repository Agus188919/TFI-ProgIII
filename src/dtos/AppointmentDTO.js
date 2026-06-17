/**
 * @class AppointmentDTO
 * @description Estructura los datos completos de una reserva de turno.
 */
class AppointmentDTO {
    constructor(appointment) {
        this.id_turno_reserva = appointment.id_turno_reserva;
        this.fecha_hora = appointment.fecha_hora;
        this.valor_total = appointment.valor_total;
        this.atendido = appointment.atendido === 1 || appointment.atendido === true;
        this.doctor = {
            medico_apellido: appointment.medico_apellido,
            medico_nombre: appointment.medico_nombre,
            nombre_completo: `${appointment.medico_nombre} ${appointment.medico_apellido}`,
            especialidad: appointment.especialidad
        };
        this.patient = {
            paciente_apellido: appointment.paciente_apellido,
            paciente_nombre: appointment.paciente_nombre,
            nombreCompleto: `${appointment.paciente_nombre} ${appointment.paciente_apellido}`,
            paciente_documento: appointment.paciente_documento,
            obra_social: appointment.obra_social
        };
    }
}

module.exports = AppointmentDTO;