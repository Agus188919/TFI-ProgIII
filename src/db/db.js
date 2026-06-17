const mysql = require("mysql2/promise");

/**
 * @class Database
 * @description Se crea y garantiza una unica conexion sql manejando el mismo 
 * pool en toda la app.
 * Optimizo consumo de memoria y evito bloqueo en el motor de la bd.
 */
class Database {
  constructor() {
    if (!Database.instance) {
      this.pool = mysql.createPool({
        host: process.env.DB_HOST,
        user: process.env.DB_USER,
        password: process.env.DB_PASSWORD,
        database: process.env.DB_NAME,
        waitForConnections: true,
        connectionLimit: 10,
        queueLimit: 0
      });

      Database.instance = this;
      console.log("Inicio db");
    }

    return Database.instance;
  }

  /**
     * @returns Pool de conexiones activo
     */
  getPool() {
    return this.pool;
  }
}

const databaseInstance = new Database();
Object.freeze(databaseInstance); //Inmutable

module.exports = databaseInstance.getPool();