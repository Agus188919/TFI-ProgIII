/**
 * @class UserDTO
 * @description Transforma y filtra los datos de usuario
 */
class UserDTO {
    constructor(user) {
        this.id_usuario = user.id_usuario;
        this.documento = user.documento;
        this.apellido = user.apellido;
        this.nombres = user.nombres;
        this.email = user.email;
        this.foto_path = user.foto_path || null;
        this.rol = user.rol;
    }
}

module.exports = UserDTO;