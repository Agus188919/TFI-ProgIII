/**
 * @class SpecialtyDTO
 * @description Modela las especialidades médicas del sistema.
 */
class SpecialtyDTO {
    constructor(specialty) {
        this.id_especialidad = specialty.id_especialidad;
        this.nombre = specialty.nombre;
    }
}

module.exports = SpecialtyDTO;