const db = require('../db/db');

/**
 * @class ObrasSocialesDAO
 * @description Operaciones de persistencia para la tabla obras_sociales.
 */
class OSDAO {
    /**
     * @method getAll
     * @description Recupera el listado completo de todas las obras sociales activas en el sistema.
     * @returns {Promise<Array>} Lista de obras sociales.
     */
    async getAll() {
        const [rows] = await db.query("SELECT * FROM obras_sociales WHERE activo = 1");
        return rows;
    }

    /**
     * @method getById
     * @description Busca una obra social específica por su ID, garantizando que se encuentre activa.
     * @param {number} id - ID numérico de la obra social a buscar.
     * @returns {Promise<Object|null>} Objeto con los datos de la obra social o null si no existe/está inactiva.
     */
    async getById(id) {
        const [rows] = await db.query("SELECT * FROM obras_sociales WHERE id_obra_social = ? AND activo = 1", [id]);
        return rows[0] || null;
    }

    /**
     * @method add
     * @description Inserta un nuevo registro de obra social en la base de datos.
     * @param {Object} data - Objeto con los datos de la cobertura.
     * @param {string} data.nombre - Nombre comercial de la obra social o prepaga.
     * @param {number} data.porcentaje_descuento - Porcentaje de cobertura que ofrece (ej. 0.40 para 40%).
     * @param {boolean|number} data.es_particular - Indicador si es atención particular sin cobertura.
     * @returns {Promise<number>} ID autoincremental generado para la nueva obra social.
     */
    async add(data) {
        const { nombre, porcentaje_descuento, es_particular } = data;
        const query = `
            INSERT INTO obras_sociales (nombre, porcentaje_descuento, es_particular, activo) 
            VALUES (?, ?, ?, 1)
        `;
        const [result] = await db.query(query, [nombre, porcentaje_descuento, es_particular]);
        return result.insertId;
    }

    /**
     * @method modify
     * @description Actualiza la información de una obra social existente.
     * @param {number} id - ID de la obra social a modificar.
     * @param {Object} data - Objeto con los nuevos valores para nombre, porcentaje y tipo.
     * @returns {Promise<boolean>} True si la actualización afectó al menos a una fila, False en caso contrario.
     */
    async modify(id, data) {
        const { nombre, porcentaje_descuento, es_particular } = data;
        const query = `
            UPDATE obras_sociales 
            SET nombre = ?, porcentaje_descuento = ?, es_particular = ? 
            WHERE id_obra_social = ? AND activo = 1
        `;
        const [result] = await db.query(query, [nombre, porcentaje_descuento, es_particular, id]);
        return result.affectedRows > 0;
    }

    /**
     * @method softDelete
     * @description Realiza una baja lógica de la obra social seteando la columna activo en 0.
     * @param {number} id - ID de la obra social a eliminar.
     * @returns {Promise<boolean>} True si la baja fue exitosa.
     */
    async softDelete(id) {
        const [result] = await db.query("UPDATE obras_sociales SET activo = 0 WHERE id_obra_social = ?", [id]);
        return result.affectedRows > 0;
    }
}

module.exports = new OSDAO();