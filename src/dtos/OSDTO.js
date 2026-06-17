/**
 * @class ObraSocialDTO
 * @description Transforma y filtra los datos de la tabla obras_sociales para el frontend.
 */
class ObraSocialDTO {
    constructor(os) {
        this.id_obra_social = os.id_obra_social;
        this.nombre = os.nombre;
        this.porcentaje_descuento = parseFloat(os.porcentaje_descuento);
        this.es_particular = os.es_particular === 1 || os.es_particular === true;
    }
}

module.exports = ObraSocialDTO;