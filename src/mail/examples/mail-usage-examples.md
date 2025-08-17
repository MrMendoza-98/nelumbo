# Ejemplos de Uso del Microservicio de Correo

## 🚀 Ejemplos Prácticos

### 1. Envío de Correo Individual

#### cURL
```bash
curl -X POST http://localhost:3000/mail/send \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "to": "usuario@ejemplo.com",
    "subject": "Bienvenido a Nelumbo",
    "body": "¡Gracias por registrarte en nuestro sistema de parqueaderos!"
  }'
```

#### JavaScript/Node.js
```javascript
const response = await fetch('http://localhost:3000/mail/send', {
  method: 'POST',
  headers: {
    'Authorization': 'Bearer YOUR_JWT_TOKEN',
    'Content-Type': 'application/json'
  },
  body: JSON.stringify({
    to: 'usuario@ejemplo.com',
    subject: 'Bienvenido a Nelumbo',
    body: '¡Gracias por registrarte en nuestro sistema de parqueaderos!'
  })
});

const result = await response.json();
console.log('Correo enviado:', result);
```

### 2. Envío Masivo de Correos

#### cURL
```bash
curl -X POST http://localhost:3000/mail/send-bulk \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -H "Content-Type: application/json" \
  -d '[
    {
      "to": "usuario1@ejemplo.com",
      "subject": "Recordatorio de Pago",
      "body": "Tu factura está lista para pago."
    },
    {
      "to": "usuario2@ejemplo.com",
      "subject": "Actualización del Sistema",
      "body": "Hemos actualizado nuestro sistema."
    }
  ]'
```

#### JavaScript/Node.js
```javascript
const bulkEmails = [
  {
    to: 'usuario1@ejemplo.com',
    subject: 'Recordatorio de Pago',
    body: 'Tu factura está lista para pago.'
  },
  {
    to: 'usuario2@ejemplo.com',
    subject: 'Actualización del Sistema',
    body: 'Hemos actualizado nuestro sistema.'
  }
];

const response = await fetch('http://localhost:3000/mail/send-bulk', {
  method: 'POST',
  headers: {
    'Authorization': 'Bearer YOUR_JWT_TOKEN',
    'Content-Type': 'application/json'
  },
  body: JSON.stringify(bulkEmails)
});

const result = await response.json();
console.log('Envío masivo completado:', result);
```

### 3. Notificación de Parqueo

#### cURL
```bash
curl -X POST http://localhost:3000/mail/send-parking-notification \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "email": "conductor@ejemplo.com",
    "parkingInfo": {
      "vehiclePlate": "ABC123",
      "parkingName": "Parqueadero Central",
      "entryTime": "2024-01-15T10:30:00.000Z",
      "location": "Nivel 2, Espacio 45"
    }
  }'
```

#### JavaScript/Node.js
```javascript
const parkingNotification = {
  email: 'conductor@ejemplo.com',
  parkingInfo: {
    vehiclePlate: 'ABC123',
    parkingName: 'Parqueadero Central',
    entryTime: new Date().toISOString(),
    location: 'Nivel 2, Espacio 45'
  }
};

const response = await fetch('http://localhost:3000/mail/send-parking-notification', {
  method: 'POST',
  headers: {
    'Authorization': 'Bearer YOUR_JWT_TOKEN',
    'Content-Type': 'application/json'
  },
  body: JSON.stringify(parkingNotification)
});

const result = await response.json();
console.log('Notificación de parqueo enviada:', result);
```

### 4. Correo de Recordatorio

#### cURL
```bash
curl -X POST http://localhost:3000/mail/send-reminder \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "email": "usuario@ejemplo.com",
    "reminderInfo": {
      "type": "parking_expiry",
      "message": "Tu registro de parqueo expira en 7 días. Renueva ahora para mantener acceso.",
      "dueDate": "2024-01-22T00:00:00.000Z"
    }
  }'
```

#### JavaScript/Node.js
```javascript
const reminderEmail = {
  email: 'usuario@ejemplo.com',
  reminderInfo: {
    type: 'parking_expiry',
    message: 'Tu registro de parqueo expira en 7 días. Renueva ahora para mantener acceso.',
    dueDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString()
  }
};

const response = await fetch('http://localhost:3000/mail/send-reminder', {
  method: 'POST',
  headers: {
    'Authorization': 'Bearer YOUR_JWT_TOKEN',
    'Content-Type': 'application/json'
  },
  body: JSON.stringify(reminderEmail)
});

const result = await response.json();
console.log('Recordatorio enviado:', result);
```

### 5. Consulta del Historial

#### cURL
```bash
# Obtener últimos 20 correos
curl -X GET "http://localhost:3000/mail/history?limit=20&offset=0" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"

# Obtener correos con paginación
curl -X GET "http://localhost:3000/mail/history?limit=10&offset=20" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"
```

#### JavaScript/Node.js
```javascript
// Obtener últimos 20 correos
const response = await fetch('http://localhost:3000/mail/history?limit=20&offset=0', {
  headers: {
    'Authorization': 'Bearer YOUR_JWT_TOKEN'
  }
});

const history = await response.json();
console.log('Historial de correos:', history);

// Paginación
const page = 2;
const limit = 10;
const offset = (page - 1) * limit;

const response2 = await fetch(`http://localhost:3000/mail/history?limit=${limit}&offset=${offset}`, {
  headers: {
    'Authorization': 'Bearer YOUR_JWT_TOKEN'
  }
});

const pageHistory = await response2.json();
console.log(`Página ${page}:`, pageHistory);
```

### 6. Estadísticas del Servicio

#### cURL
```bash
curl -X GET http://localhost:3000/mail/stats \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"
```

#### JavaScript/Node.js
```javascript
const response = await fetch('http://localhost:3000/mail/stats', {
  headers: {
    'Authorization': 'Bearer YOUR_JWT_TOKEN'
  }
});

const stats = await response.json();
console.log('Estadísticas del servicio:', stats);

// Mostrar métricas clave
console.log(`Total de correos enviados: ${stats.totalSent}`);
console.log(`Tasa de éxito: ${stats.successRate.toFixed(2)}%`);
console.log(`Último envío: ${stats.lastSentAt}`);
```

### 7. Verificación de Salud

#### cURL
```bash
curl -X GET http://localhost:3000/mail/health
curl -X GET http://localhost:3000/mail/ping
```

#### JavaScript/Node.js
```javascript
// Verificar salud del servicio
const healthResponse = await fetch('http://localhost:3000/mail/health');
const health = await healthResponse.json();
console.log('Estado del servicio:', health);

// Probar conectividad
const pingResponse = await fetch('http://localhost:3000/mail/ping');
const ping = await pingResponse.json();
console.log('Respuesta del ping:', ping);
```

## 🔧 Integración en Otros Servicios

### En el Servicio de Parqueaderos

```typescript
import { Injectable } from '@nestjs/common';
import { MailService } from '../mail/mail.service';

@Injectable()
export class ParkingService {
  constructor(private mailService: MailService) {}

  async registerVehicleEntry(parkingData: any, user: any) {
    try {
      // Lógica de registro del parqueo
      const parkingRecord = await this.createParkingRecord(parkingData);
      
      // Enviar notificación por correo
      await this.mailService.sendParkingNotification(
        user.email,
        {
          vehiclePlate: parkingData.vehiclePlate,
          parkingName: parkingData.parkingName,
          entryTime: new Date(),
          location: parkingData.location
        }
      );

      return parkingRecord;
    } catch (error) {
      // Manejo de errores
      throw error;
    }
  }

  async sendExpiryReminder(user: any, expiryDate: Date) {
    try {
      await this.mailService.sendReminderEmail(
        user.email,
        {
          type: 'parking_expiry',
          message: `Tu registro de parqueo expira el ${expiryDate.toLocaleDateString()}. Renueva ahora para mantener acceso.`,
          dueDate: expiryDate
        }
      );
    } catch (error) {
      console.error('Error al enviar recordatorio:', error);
    }
  }
}
```

### En el Servicio de Usuarios

```typescript
import { Injectable } from '@nestjs/common';
import { MailService } from '../mail/mail.service';

@Injectable()
export class UserService {
  constructor(private mailService: MailService) {}

  async sendWelcomeEmail(user: any) {
    try {
      await this.mailService.sendMail({
        to: user.email,
        subject: '¡Bienvenido a Nelumbo!',
        body: `
          Hola ${user.name},
          
          ¡Bienvenido a nuestro sistema de gestión de parqueaderos!
          
          Tu cuenta ha sido creada exitosamente.
          
          Saludos,
          Equipo Nelumbo
        `
      });
    } catch (error) {
      console.error('Error al enviar correo de bienvenida:', error);
    }
  }

  async sendPasswordResetEmail(user: any, resetToken: string) {
    try {
      await this.mailService.sendMail({
        to: user.email,
        subject: 'Restablecimiento de Contraseña - Nelumbo',
        body: `
          Hola ${user.name},
          
          Has solicitado restablecer tu contraseña.
          
          Token de restablecimiento: ${resetToken}
          
          Si no solicitaste esto, ignora este correo.
          
          Saludos,
          Equipo Nelumbo
        `
      });
    } catch (error) {
      console.error('Error al enviar correo de restablecimiento:', error);
    }
  }
}
```

## 📱 Ejemplos con Postman

### Colección de Postman

```json
{
  "info": {
    "name": "Nelumbo Mail Microservice",
    "description": "Colección para probar el microservicio de correo"
  },
  "item": [
    {
      "name": "Send Single Mail",
      "request": {
        "method": "POST",
        "header": [
          {
            "key": "Authorization",
            "value": "Bearer {{jwt_token}}",
            "type": "text"
          },
          {
            "key": "Content-Type",
            "value": "application/json",
            "type": "text"
          }
        ],
        "body": {
          "mode": "raw",
          "raw": "{\n  \"to\": \"test@example.com\",\n  \"subject\": \"Test Email\",\n  \"body\": \"This is a test email\"\n}"
        },
        "url": {
          "raw": "{{base_url}}/mail/send",
          "host": ["{{base_url}}"],
          "path": ["mail", "send"]
        }
      }
    },
    {
      "name": "Send Bulk Mail",
      "request": {
        "method": "POST",
        "header": [
          {
            "key": "Authorization",
            "value": "Bearer {{jwt_token}}",
            "type": "text"
          },
          {
            "key": "Content-Type",
            "value": "application/json",
            "type": "text"
          }
        ],
        "body": {
          "mode": "raw",
          "raw": "[\n  {\n    \"to\": \"user1@example.com\",\n    \"subject\": \"Bulk Test 1\",\n    \"body\": \"First bulk email\"\n  },\n  {\n    \"to\": \"user2@example.com\",\n    \"subject\": \"Bulk Test 2\",\n    \"body\": \"Second bulk email\"\n  }\n]"
        },
        "url": {
          "raw": "{{base_url}}/mail/send-bulk",
          "host": ["{{base_url}}"],
          "path": ["mail", "send-bulk"]
        }
      }
    }
  ],
  "variable": [
    {
      "key": "base_url",
      "value": "http://localhost:3000"
    },
    {
      "key": "jwt_token",
      "value": "your_jwt_token_here"
    }
  ]
}
```

## 🧪 Pruebas de Integración

### Script de Pruebas Automatizadas

```typescript
import { MailService } from './mail.service';

describe('Mail Service Integration Tests', () => {
  let mailService: MailService;

  beforeEach(async () => {
    // Configuración del módulo de prueba
  });

  it('should send email successfully', async () => {
    const result = await mailService.sendMail({
      to: 'test@example.com',
      subject: 'Integration Test',
      body: 'This is an integration test'
    });

    expect(result.success).toBe(true);
    expect(result.mailId).toBeDefined();
  });

  it('should handle email failure gracefully', async () => {
    // Simular fallo
    jest.spyOn(Math, 'random').mockReturnValue(0.96);

    const result = await mailService.sendMail({
      to: 'test@example.com',
      subject: 'Failure Test',
      body: 'This should fail'
    });

    expect(result.success).toBe(false);
    expect(result.message).toContain('Error al enviar correo');
  });
});
```

## 📊 Monitoreo y Métricas

### Dashboard de Métricas

```typescript
// Ejemplo de implementación de métricas
export class MailMetricsService {
  async getRealTimeMetrics() {
    const stats = await this.mailService.getMailStats();
    
    return {
      ...stats,
      timestamp: new Date(),
      uptime: process.uptime(),
      memoryUsage: process.memoryUsage(),
      cpuUsage: process.cpuUsage()
    };
  }

  async getHourlyStats() {
    // Implementar estadísticas por hora
    const hourlyStats = await this.mailRepository
      .createQueryBuilder('mail')
      .select('DATE_TRUNC(\'hour\', mail.created_at)', 'hour')
      .addSelect('COUNT(*)', 'count')
      .addSelect('COUNT(CASE WHEN mail.status = \'sent\' THEN 1 END)', 'successful')
      .addSelect('COUNT(CASE WHEN mail.status = \'failed\' THEN 1 END)', 'failed')
      .groupBy('hour')
      .orderBy('hour', 'DESC')
      .limit(24)
      .getRawMany();

    return hourlyStats;
  }
}
```

---

**Nota:** Estos ejemplos asumen que tienes un token JWT válido. Para obtener uno, primero debes autenticarte usando el endpoint de login del sistema.
