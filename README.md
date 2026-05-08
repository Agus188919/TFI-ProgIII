# 🏥 Sistema de Gestión de Clínica - Backend (TFI)

Proyecto de creacion de una una API REST construida con Node.js y Express, diseñada para gestionar las operaciones de una clínica médica.


## 🛠️ Tecnologías Utilizadas
* **Node.js**: Entorno de ejecución.
* **Express**: Framework para el servidor web.
* **MySQL**: Sistema de gestión de base de datos.
* **Morgan**: Middleware para el registro de solicitudes (logging).
* **Cors**: Manejo de permisos de acceso.
* **Dotenv**: Gestión de variables de entorno.


## 📋 Requisitos Previos
1.  Tener instalado [Node.js](https://nodejs.org/).
2.  Contar con una instancia de **MySQL** activa.
3.  Ejecutar el script SQL de creación de base de datos y tablas (incluido en la carpeta `/db` o adjunto).


## ⚙️ Instalación y Configuración

1.  **Clonar el repositorio:**

2.  **Instalar dependencias:**
    ```bash
    npm install
    ```

3.  **Configurar variables de entorno:**
    Copia el archivo `.env.example` y renombralo a `.env`. Luego, completá los datos de tu conexión local:
    ```bash
    PORT=3000
    DB_HOST=localhost
    DB_USER=root
    DB_PASSWORD=mysql
    DB_NAME=clinica_prog3
    ```

4.  **Iniciar el servidor:**
    * Para desarrollo (con nodemon): `npm run dev`
    * Para producción: `npm start`


## 🛣️ Endpoints Principales (Entidad: Usuarios)
La API responde en el prefijo base: `http://localhost:PORT/api/v1/usuarios`

| Método | Endpoint | Descripción |
| :--- | :--- | :--- |
| **GET** | `/` | Listar todos los usuarios activos. |
| **GET** | `/:id` | Obtener un usuario específico por ID. |
| **POST** | `/` | Crear un nuevo usuario. |
| **PUT** | `/:id` | Editar los datos de un usuario existente. |
| **DELETE** | `/:id` | Realizar borrado lógico del usuario. |

---

## 👥 Integrantes del Grupo
* María Belén Lizardo
* Cristian Emmanuel Sambrana
* Linda Galeano
* Luciana Espil
* Florencia Agustina Mammana
