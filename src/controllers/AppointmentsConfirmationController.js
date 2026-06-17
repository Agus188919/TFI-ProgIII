const PDFDocument = require('pdfkit');
const appointmentsService = require('../service/AppointmentsService');

class AppointmentsConfirmationController {

    /**
         * @method downloadReceipt
         * @description Genera y descarga un comprobante individual en formato PDF para un turno específico.
         * Incluye información del paciente, médico, obra social y el valor total a abonar.
         * @param {Object} req - Objeto de petición de Express. Espera el parámetro `id` en la URL.
         * @param {Object} res - Objeto de respuesta de Express. Retorna el stream del archivo PDF.
         * @param {Function} next - Middleware global de manejo de errores.
         */
    downloadReceipt = async (req, res, next) => {
        try {
            const { id } = req.params;
            const appointmentDTO = await appointmentsService.getById(id);
            const doc = new PDFDocument();
            res.setHeader('Content-Type', 'application/pdf');
            res.setHeader('Content-Disposition', `attachment; filename=comprobante_turno_${id}.pdf`);
            doc.pipe(res);
            doc.fontSize(20).text('Clínica FMammana - Comprobante de Turno', { align: 'center' });
            doc.moveDown();
            doc.fontSize(14).text(`Turno N°: ${appointmentDTO.idTurnoReserva}`);
            doc.text(`Fecha y Hora: ${appointmentDTO.fechaHora}`);
            doc.text(`Paciente: ${appointmentDTO.paciente.nombreCompleto}`);
            doc.text(`Médico: ${appointmentDTO.medico.nombreCompleto}`);
            doc.text(`Obra Social: ${appointmentDTO.paciente.obraSocial}`);
            doc.moveDown();
            doc.fontSize(16).text(`Valor a abonar: $${appointmentDTO.valorTotal}`, { underline: true });
            doc.end();
        } catch (error) {
            next(error);
        }
    };

    /**
     * @method generateReceiptGlobal
     * @description Genera y descarga un reporte administrativo global en formato PDF.
     * Detalla la cantidad total de turnos registrados y un listado completo con fecha, paciente y obra social.
     * Acceso restringido a rol de Administrador.
     * @param {Object} req - Objeto de petición de Express.
     * @param {Object} res - Objeto de respuesta de Express. Retorna el stream del archivo PDF.
     * @param {Function} next - Middleware global de manejo de errores.
     */
    generateReceiptGlobal = async (req, res, next) => {
        try {
            const appointment = await appointmentsService.getAll();
            const doc = new PDFDocument();
            res.setHeader('Content-Type', 'application/pdf');
            res.setHeader('Content-Disposition', 'attachment; filename=informe_turnos.pdf');
            doc.pipe(res);
            doc.fontSize(20).text('Reporte General de Turnos - Clínica', { align: 'center' });
            doc.moveDown();
            doc.fontSize(14).text(`Cantidad total de turnos registrados: ${appointment.length}`);
            doc.moveDown();
            doc.fontSize(16).text('Detalle de atenciones:', { underline: true });
            doc.moveDown();
            doc.fontSize(12);
            appointment.forEach(turno => {
                doc.text(`- Paciente: ${turno.paciente.nombreCompleto} | OS: ${turno.paciente.obraSocial} | Fecha: ${turno.fechaHora}`);
            });

            doc.end();
        } catch (error) {
            next(error);
        }
    };
}

module.exports = new AppointmentsConfirmationController();