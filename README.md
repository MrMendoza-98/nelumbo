<p align="center">
  <a href="http://nestjs.com/" target="blank"><img src="https://nestjs.com/img/logo-small.svg" width="120" alt="Nest Logo" /></a>
</p>

[circleci-image]: https://img.shields.io/circleci/build/github/nestjs/nest/master?token=abc123def456
[circleci-url]: https://circleci.com/gh/nestjs/nest

  <p align="center">A progressive <a href="http://nodejs.org" target="_blank">Node.js</a> framework for building efficient and scalable server-side applications.</p>
    <p align="center">
<a href="https://www.npmjs.com/~nestjscore" target="_blank"><img src="https://img.shields.io/npm/v/@nestjs/core.svg" alt="NPM Version" /></a>
<a href="https://www.npmjs.com/~nestjscore" target="_blank"><img src="https://img.shields.io/npm/l/@nestjs/core.svg" alt="Package License" /></a>
<a href="https://www.npmjs.com/~nestjscore" target="_blank"><img src="https://img.shields.io/npm/dm/@nestjs/common.svg" alt="NPM Downloads" /></a>
<a href="https://circleci.com/gh/nestjs/nest" target="_blank"><img src="https://img.shields.io/circleci/build/github/nestjs/nest/master" alt="CircleCI" /></a>
<a href="https://discord.gg/G7Qnnhy" target="_blank"><img src="https://img.shields.io/badge/discord-online-brightgreen.svg" alt="Discord"/></a>
<a href="https://opencollective.com/nest#backer" target="_blank"><img src="https://opencollective.com/nest/backers/badge.svg" alt="Backers on Open Collective" /></a>
<a href="https://opencollective.com/nest#sponsor" target="_blank"><img src="https://opencollective.com/nest/sponsors/badge.svg" alt="Sponsors on Open Collective" /></a>
  <a href="https://paypal.me/kamilmysliwiec" target="_blank"><img src="https://img.shields.io/badge/Donate-PayPal-ff3f59.svg" alt="Donate us"/></a>
    <a href="https://opencollective.com/nest#sponsor"  target="_blank"><img src="https://img.shields.io/badge/Support%20us-Open%20Collective-41B883.svg" alt="Support us"></a>
  <a href="https://twitter.com/nestframework" target="_blank"><img src="https://img.shields.io/twitter/follow/nestframework.svg?style=social&label=Follow" alt="Follow us on Twitter"></a>
</p>
  <!--[![Backers on Open Collective](https://opencollective.com/nest/backers/badge.svg)](https://opencollective.com/nest#backer)
  [![Sponsors on Open Collective](https://opencollective.com/nest/sponsors/badge.svg)](https://opencollective.com/nest#sponsor)-->

# API REST Control de Vehículos en Parqueaderos

## Descripción
API para gestionar parqueaderos de socios, registro de vehículos, historial, indicadores y simulación de envío de correos. Protegida por JWT y roles (ADMIN, SOCIO).

## Requisitos
- Node.js >= 18
- PostgreSQL

## Instalación
1. Clonar el repositorio
2. Instalar dependencias:
   ```bash
   npm install
   ```
3. Configurar la base de datos en `.env` (ejemplo incluido)
4. Ejecutar migraciones y seed inicial (usuario admin)
5. Iniciar el servidor:
   ```bash
   npm run start:dev
   ```

## Estructura del código
- `src/auth`: Autenticación y autorización JWT
- `src/users`: Usuarios y roles
- `src/parkings`: Parqueaderos
- `src/vehicles`: Vehículos y registros
- `src/indicators`: **Sistema de indicadores y estadísticas** 📊
- `src/mail`: **Microservicio de simulación de envío de correo** ✨
- `src/common`: Utilidades, DTOs, pipes, guards

## Observaciones
- El usuario admin se precarga: `admin@mail.com` / `admin`
- El sistema usa patrón de servicios/repositorios
- Endpoints protegidos por roles y JWT
- Validaciones y manejo de errores con excepciones
- **Microservicio de correo con simulación completa** ✨
- **Sistema de indicadores con top 10 vehículos más frecuentes** 📊
- Documentación y colección Postman incluidas

## Ejemplo de configuración .env
```
DB_HOST=localhost
DB_PORT=5432
DB_USER=postgres
DB_PASS=tu_password
DB_NAME=nelumbo
JWT_SECRET=tu_jwt_secret
```

## Cómo correr el proyecto en local
1. Instala PostgreSQL y crea la base de datos
2. Configura `.env`
3. Ejecuta `npm install`
4. Ejecuta migraciones y seed
5. Ejecuta `npm run start:dev`

## Enlace de descarga
El enlace de descarga y la colección Postman se proporcionarán al finalizar el desarrollo.

## Support

Nest is an MIT-licensed open source project. It can grow thanks to the sponsors and support by the amazing backers. If you'd like to join them, please [read more here](https://docs.nestjs.com/support).

## Stay in touch

- Author - [Kamil Myśliwiec](https://twitter.com/kammysliwiec)
- Website - [https://nestjs.com](https://nestjs.com/)
- Twitter - [@nestframework](https://twitter.com/nestframework)

## License

Nest is [MIT licensed](https://github.com/nestjs/nest/blob/master/LICENSE).
