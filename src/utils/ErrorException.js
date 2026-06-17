class ErrorException extends Error {
    constructor(mensaje, statusCode) {
        super(mensaje);
        this.statusCode = statusCode;
        this.status = false;
    }
}
module.exports = ErrorException;