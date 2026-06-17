# Sistema de Gestión de Turnos Clínicos - API REST

Este proyecto consiste en el desarrollo de una API REST robusta para la gestión integral de turnos, usuarios y autorizaciones de una clínica médica. El sistema implementa una arquitectura en capas, control de acceso basado en roles, validaciones centralizadas y notificaciones en tiempo real.

## ✒️ Autoría

* **Desarrolladora:** Florencia Agustina Mammana
* **Asignatura:** Técnicatura en Programación 
---

## 🛠️ Tecnologías y Librerías Utilizadas

* **Backend:** Node.js & Express.js
* **Base de Datos:** MySQL (con la librería nativa `mysql2/promise` para manejo de conexiones asíncronas).
* **Autenticación y Seguridad:** * `jsonwebtoken` (JWT) para la emisión y validación de tokens de acceso seguro.
* `bcryptjs` para el hashing unidireccional con salting de contraseñas.


* **Validación de Datos:** `express-validator` para la sanitización e inspección rigurosa de los cuerpos de las peticiones.
* **Tiempo Real:** `Socket.io` para la emisión de alertas inmediatas ante la reserva de nuevos turnos.

---

## 📁 Estructura del Proyecto (Arquitectura en Capas)

El diseño del software sigue una separación estricta de responsabilidades para garantizar la escalabilidad y el mantenimiento:

* **`/controllers`:** Intermediarios de Express. Capturan las peticiones HTTP, extraen los parámetros y gestionan las respuestas enviando los códigos de estado adecuados (`200`, `201`, `401`, `403`, `500`).
* **`/service`:** Capa de lógica de negocio pura. Orquesta las operaciones complejas y las reglas operativas de la clínica.
* **`/dao` (Data Access Object):** Capa de persistencia. Centraliza y ejecuta de forma directa las consultas SQL (`SELECT`, `INSERT`, `UPDATE`) hacia la base de datos MySQL.
* **`/dtos` (Data Transfer Object):** Estructuras encargadas de moldear, filtrar y limpiar los datos que salen del servidor (por ejemplo, omitiendo contraseñas u ocultando campos sensibles).
* **`/middlewares`:** Componentes transversales que interceptan las solicitudes:
* `authMiddleware`: Valida la autenticidad del token e inyecta la identidad del usuario en el objeto `req.user`.
* `roleMiddleware`: Evalúa los permisos mediante una lista blanca de roles permitidos para cada endpoint.
* `validatorMiddleware`: Captura los errores de consistencia detectados por los esquemas de validación.


* **`/utils`:** Clases globales de soporte, constantes de roles (`ADMIN`, `MEDICO`, `PACIENTE`) y el gestor personalizado de excepciones (`ErrorException`).

---

## ⚙️ Configuración del Entorno (`.env`)

Para desplegar el servidor localmente, es necesario crear un archivo `.env` en la raíz del proyecto con las siguientes variables:

```env
PORT=3000
DB_HOST=localhost
DB_USER=tu_usuario_mysql
DB_PASSWORD=tu_contrasenia_mysql
DB_NAME=tfi_prog3
JWT_SECRET=tu_clave_secreta_jwt
JWT_EXPIRES_IN=24h

```

---

## 🚀 Endpoints Principales de la API

### Autenticación (`/api/v1/auth`)

* `POST /login`: Valida las credenciales utilizando la verificación cruzada de `bcrypt` y retorna el token JWT junto con el perfil estructurado del usuario.

### Gestión de Turnos (`/api/v1/appointments`)

* `GET /`: Recupera el listado completo de turnos (Acceso restringido).
* `GET /me`: **Acceso Dinámico de Identidad Propia.** Obtiene exclusivamente los turnos del usuario autenticado (Filtra por paciente o médico según el rol inyectado desde el token).
* `GET /:id`: Busca los detalles de un turno específico por su identificador único.
* `POST /`: Registra una nueva reserva validando de forma mandatoria la existencia del médico, la obra social y la coherencia del formato de fecha/hora. Ante el éxito, emite un evento vía `Socket.io`.
* `PUT /:id`: Permite la modificación de la fecha, hora o el estado de atención médica (Restringido a médicos y administradores).
* `DELETE /:id`: Aplica una **baja lógica** (`activo = 0`) para preservar el histórico de datos en auditorías de la clínica (Exclusivo Administrador).
* `GET /stats`: Ejecuta métricas complejas mediante procedimientos almacenados en la base de datos (Exclusivo Administrador).

### Gestión de Usuarios (`/api/v1/users`)

* `POST /`: Endpoint centralizado para el registro de nuevos perfiles integrando las validaciones correspondientes de documento, correo electrónico único y asignación de roles.

---

## 🔒 Características Destacadas de Seguridad

1. **Estrategia Stateless con JWT:** No se almacena sesión en el servidor; toda la validación se delega al descifrado simétrico del token de autorización.
2. **Robustez en Enrutamiento:** Las rutas dinámicas (`/:id`) se encuentran posicionadas estratégicamente al final del flujo del enrutador de Express para evitar colisiones lógicas con los accesos fijos como `/me` o `/stats`.
3. **Manejo Centralizado de Errores:** Todos los bloques `catch` de la aplicación delegan la excepción al middleware `next(error)`, asegurando que la API responda siempre en formato JSON homogéneo ante fallos imprevistos, previniendo fugas de información interna del sistema.