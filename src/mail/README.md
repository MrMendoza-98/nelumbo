# Microservicio de Simulación de Envío de Correo

## Descripción
Este microservicio simula el envío de correos electrónicos para el sistema Nelumbo. Proporciona una interfaz REST completa para enviar correos, gestionar plantillas, y monitorear el estado de los envíos.

## Características

### 🚀 Funcionalidades Principales
- **Envío de correos individuales** con validación completa
- **Envío masivo de correos** en lote
- **Plantillas predefinidas** para notificaciones de parqueo y recordatorios
- **Sistema de reintentos** con backoff exponencial
- **Logging completo** de todos los envíos
- **Estadísticas y métricas** del servicio
- **Validación robusta** de datos de entrada
- **Sanitización de contenido** para prevenir inyecciones

### 🏗️ Arquitectura
- **Patrón Repository** para acceso a datos
- **Validación con class-validator** para DTOs
- **Manejo de errores** centralizado
- **Logging estructurado** con NestJS Logger
- **Configuración centralizada** y flexible

## Estructura del Código

```
src/mail/
├── constants/           # Constantes del servicio
├── dto/                # Data Transfer Objects
├── interfaces/         # Interfaces TypeScript
├── utils/              # Utilidades y helpers
├── mail.controller.ts  # Controlador REST
├── mail.service.ts     # Lógica de negocio
├── mail.module.ts      # Módulo principal
├── mail-log.entity.ts  # Entidad de base de datos
├── mail.config.ts      # Configuración
└── README.md           # Esta documentación
```

## Endpoints Disponibles

### 🔐 Autenticación
Todos los endpoints requieren autenticación JWT y autorización por roles.

### 📧 Envío de Correos

#### POST `/mail/send`
Envía un correo electrónico individual.

**Roles permitidos:** ADMIN, SOCIO

**Body:**
```json
{
  "to": "usuario@ejemplo.com",
  "subject": "Asunto del correo",
  "body": "Contenido del correo",
  "cc": "copia@ejemplo.com",     // Opcional
  "bcc": "oculta@ejemplo.com"    // Opcional
}
```

**Respuesta:**
```json
{
  "success": true,
  "message": "Correo enviado exitosamente",
  "mailId": 123,
  "sentAt": "2024-01-15T10:30:00.000Z",
  "recipient": "usuario@ejemplo.com"
}
```

#### POST `/mail/send-bulk`
Envía múltiples correos en lote.

**Roles permitidos:** ADMIN

**Body:**
```json
[
  {
    "to": "usuario1@ejemplo.com",
    "subject": "Asunto 1",
    "body": "Contenido 1"
  },
  {
    "to": "usuario2@ejemplo.com",
    "subject": "Asunto 2",
    "body": "Contenido 2"
  }
]
```

#### POST `/mail/send-parking-notification`
Envía notificación automática de parqueo.

**Roles permitidos:** ADMIN, SOCIO

**Body:**
```json
{
  "email": "usuario@ejemplo.com",
  "parkingInfo": {
    "vehiclePlate": "ABC123",
    "parkingName": "Parqueadero Central",
    "entryTime": "2024-01-15T10:30:00.000Z",
    "location": "Nivel 2, Espacio 45"
  }
}
```

#### POST `/mail/send-reminder`
Envía correo de recordatorio.

**Roles permitidos:** ADMIN

**Body:**
```json
{
  "email": "usuario@ejemplo.com",
  "reminderInfo": {
    "type": "parking_expiry",
    "message": "Tu registro de parqueo expira pronto",
    "dueDate": "2024-01-20T00:00:00.000Z"
  }
}
```

### 📊 Consultas y Estadísticas

#### GET `/mail/history`
Obtiene el historial de correos enviados.

**Roles permitidos:** ADMIN

**Query Parameters:**
- `limit`: Número máximo de registros (default: 50)
- `offset`: Número de registros a omitir (default: 0)

#### GET `/mail/stats`
Obtiene estadísticas del servicio de correo.

**Roles permitidos:** ADMIN

**Respuesta:**
```json
{
  "totalSent": 1500,
  "totalFailed": 75,
  "successRate": 95.0,
  "lastSentAt": "2024-01-15T10:30:00.000Z"
}
```

### 🏥 Monitoreo y Salud

#### GET `/mail/health`
Verifica el estado de salud del microservicio.

**Respuesta:**
```json
{
  "status": "healthy",
  "timestamp": "2024-01-15T10:30:00.000Z",
  "service": "mail-microservice"
}
```

#### GET `/mail/ping`
Prueba la conectividad del servicio.

**Respuesta:**
```json
{
  "message": "pong",
  "timestamp": "2024-01-15T10:30:00.000Z"
}
```

## Configuración

### Variables de Entorno
```bash
# Configuración de base de datos (heredada del módulo principal)
DB_HOST=localhost
DB_PORT=5432
DB_USER=postgres
DB_PASS=tu_password
DB_NAME=nelumbo

# Configuración JWT (heredada del módulo de autenticación)
JWT_SECRET=tu_jwt_secret
```

### Configuración del Servicio
El archivo `mail.config.ts` contiene configuraciones específicas:

```typescript
export const mailConfig = {
  simulation: {
    successRate: 0.95,        // 95% de éxito
    minDelay: 100,            // Delay mínimo: 100ms
    maxDelay: 2000,           // Delay máximo: 2 segundos
    maxRetries: 3,            // Máximo 3 reintentos
  },
  limits: {
    maxBodyLength: 5000,      // Máximo 5000 caracteres
    maxSubjectLength: 200,    // Máximo 200 caracteres
    maxBulkSize: 100,         // Máximo 100 correos por lote
  }
};
```

## Simulación del Envío

### 🎭 Características de Simulación
- **Delay realista:** Entre 100ms y 2 segundos
- **Tasa de éxito configurable:** Por defecto 95%
- **Errores simulados:** Para probar manejo de fallos
- **Logging detallado:** De todo el proceso

### 🔄 Sistema de Reintentos
- **Backoff exponencial:** Delays incrementales
- **Máximo de reintentos:** Configurable
- **Logging de intentos:** Para auditoría

## Base de Datos

### Entidad MailLog
```typescript
@Entity('mail_logs')
export class MailLog {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  to: string;

  @Column({ nullable: true })
  cc?: string;

  @Column({ nullable: true })
  bcc?: string;

  @Column()
  subject: string;

  @Column('text')
  body: string;

  @Column({ enum: MailStatus })
  status: MailStatus;

  @Column({ enum: MailType })
  type: MailType;

  @Column({ nullable: true })
  error_message?: string;

  @Column({ nullable: true })
  retry_count: number;

  @Column({ nullable: true })
  sent_at?: Date;

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;
}
```

### Estados del Correo
- `pending`: Pendiente de envío
- `sent`: Enviado exitosamente
- `failed`: Falló el envío
- `delivered`: Entregado al destinatario
- `bounced`: Rebotó
- `spam`: Marcado como spam

### Tipos de Correo
- `general`: Correo general
- `parking_notification`: Notificación de parqueo
- `reminder`: Recordatorio
- `system`: Notificación del sistema
- `welcome`: Correo de bienvenida
- `password_reset`: Restablecimiento de contraseña

## Validaciones

### 📝 Validaciones de Entrada
- **Email válido:** Formato RFC 5322
- **Longitud del asunto:** Máximo 200 caracteres
- **Longitud del cuerpo:** Máximo 5000 caracteres
- **Campos requeridos:** `to`, `subject`, `body`

### 🛡️ Sanitización
- **Prevención de XSS:** Eliminación de scripts
- **Sanitización de HTML:** Limpieza de tags peligrosos
- **Escape de caracteres:** Para prevenir inyecciones

## Logging y Monitoreo

### 📊 Métricas Disponibles
- **Total de correos enviados**
- **Tasa de éxito**
- **Tiempo promedio de procesamiento**
- **Tamaño de la cola**
- **Trabajadores activos**

### 🔍 Logs Estructurados
- **Nivel INFO:** Operaciones normales
- **Nivel ERROR:** Errores y fallos
- **Nivel DEBUG:** Información detallada (configurable)

## Pruebas

### 🧪 Pruebas Unitarias
```bash
# Ejecutar pruebas del módulo de correo
npm test src/mail/mail.service.spec.ts

# Ejecutar todas las pruebas
npm test
```

### 🚀 Pruebas de Integración
```bash
# Ejecutar pruebas E2E
npm run test:e2e
```

## Uso en Otros Módulos

### Importación del Servicio
```typescript
import { MailService } from '../mail/mail.service';

@Injectable()
export class ParkingService {
  constructor(private mailService: MailService) {}

  async registerParking(parkingData: any) {
    // ... lógica de registro
    
    // Enviar notificación por correo
    await this.mailService.sendParkingNotification(
      user.email,
      {
        vehiclePlate: parkingData.plate,
        parkingName: parkingData.parkingName,
        entryTime: new Date(),
      }
    );
  }
}
```

## Consideraciones de Producción

### ⚠️ Limitaciones Actuales
- **Simulación:** No envía correos reales
- **Cola:** No implementa cola de mensajes
- **Rate Limiting:** Básico, configurable
- **Monitoreo:** Métricas básicas

### 🚀 Mejoras Futuras
- **Integración con SMTP real** (SendGrid, AWS SES, etc.)
- **Sistema de colas** (Redis, RabbitMQ)
- **Rate limiting avanzado**
- **Métricas con Prometheus**
- **Alertas automáticas**
- **Plantillas HTML avanzadas**
- **Sistema de suscripciones**

## Soporte

### 🐛 Reportar Problemas
Para reportar problemas o solicitar mejoras, contacta al equipo de desarrollo.

### 📚 Documentación Adicional
- [NestJS Documentation](https://docs.nestjs.com/)
- [TypeORM Documentation](https://typeorm.io/)
- [Class Validator](https://github.com/typestack/class-validator)

---

**Versión:** 1.0.0  
**Última actualización:** Enero 2024  
**Mantenido por:** Equipo Nelumbo
