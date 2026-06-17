const multer = require('multer');
const path = require('path');
const fs = require('fs');
const ErrorException = require('../utils/ErrorException');

// Verificamos y creamos el directorio de destino si no existe (Evita crasheos en producción)
const uploadDir = path.join(process.cwd(), 'uploads/');
if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir, { recursive: true });
}

/**
 * @constant storage
 * @description Configuración del motor de almacenamiento de Multer.
 * Define la ruta destino y genera nombres de archivo únicos
 * para evitar colisiones.
 */
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, uploadDir);
    },
    filename: function (req, file, cb) {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        // Se intenta evitar sobreescrituras colisionadas
        cb(null, 'perfil-' + uniqueSuffix + path.extname(file.originalname));
    }
});

/**
 * @function fileFilter
 * @description Middleware validador de archivos.
 * Capta la petición y verifica el mime para asegurar que sea una imagen.
 */
const fileFilter = (req, file, cb) => {
    if (file.mimetype.startsWith('image/')) {
        cb(null, true);
    } else {
        cb(new ErrorException('Formato inválido. Solo se permiten archivos de imagen.', 400), false);
    }
};

/**
 * @constant upload
 * @description Instancia de Multer usada en las rutas.
 * Abarca almacenamiento en disco, filtrado por tipo de archivo y 
 * una restricción de tamaño.
 */
const upload = multer({
    storage,
    fileFilter,
    limits: {
        fileSize: 5 * 1024 * 1024 // Límite estricto de 5MB
    }
});

module.exports = upload;