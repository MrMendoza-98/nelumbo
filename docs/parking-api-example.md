# Parking API - Ejemplo Completo

## 1. Colección de Endpoints

### Autenticación
- **POST /auth/login**
  ```json
  {
    "email": "admin@email.com",
    "password": "admin123"
  }
  ```
  Respuesta:
  ```json
  {
    "accessToken": "jwt_token"
  }
  ```

### Usuarios
- **POST /users**
  ```json
  {
    "name": "Socio Ejemplo",
    "email": "socio@email.com",
    "password": "socio123",
    "role": "SOCIO"
  }
  ```
  Respuesta:
  ```json
  {
    "id": 2,
    "name": "Socio Ejemplo",
    "email": "socio@email.com",
    "role": "SOCIO"
  }
  ```

### Parqueaderos
- **GET /parkings**
  Respuesta:
  ```json
  [
    {
      "id": 1,
      "name": "Central Parking",
      "address": "Calle 123",
      "capacity": 50,
      "price_per_hour": 3000,
      "ownerId": 2
    }
  ]
  ```
- **GET /parkings/:id**
  Respuesta:
  ```json
  {
    "id": 1,
    "name": "Central Parking",
    "address": "Calle 123",
    "capacity": 50,
    "price_per_hour": 3000,
    "ownerId": 2
  }
  ```

### Vehículos
- **POST /vehicles/register-entry**
  ```json
  {
    "plate": "ABC123",
    "parkingId": 1,
    "email": "owner@email.com",
    "ownerName": "Juan Perez"
  }
  ```
  Respuesta:
  ```json
  {
    "message": "Vehicle entry registered successfully",
    "recordId": 10
  }
  ```
- **POST /vehicles/register-exit**
  ```json
  {
    "plate": "ABC123",
    "parkingId": 1
  }
  ```
  Respuesta:
  ```json
  {
    "message": "Vehicle exit registered successfully",
    "totalPrice": 6000
  }
  ```
- **GET /vehicles/parked/:parkingId**
  Respuesta:
  ```json
  [
    {
      "plate": "ABC123",
      "entryTime": "2025-08-18T10:00:00Z"
    }
  ]
  ```
- **GET /vehicles/info/:plate/:parkingId**
  Respuesta:
  ```json
  {
    "plate": "ABC123",
    "parkingId": 1,
    "entryTime": "2025-08-18T10:00:00Z",
    "ownerName": "Juan Perez"
  }
  ```

### Indicadores
- **GET /indicators/top-vehicles**
  Respuesta:
  ```json
  {
    "vehicles": [
      {
        "plate": "ABC123",
        "parkingId": 1,
        "count": 5
      }
    ],
    "total": 1,
    "summary": {
      "totalRegistrations": 5,
      "averageRegistrations": 5,
      "mostFrequentVehicle": "ABC123",
      "mostFrequentParkingId": 1,
      "mostFrequentCount": 5
    },
    "timestamp": "2025-08-18T12:00:00Z"
  }
  ```
- **GET /indicators/earnings/:parkingId**
  Respuesta:
  ```json
  {
    "today": 6000,
    "week": 42000,
    "month": 180000,
    "year": 1200000
  }
  ```

---

## 2. Estructura del Código

```
src/
  auth/           # Autenticación y guards
    auth.controller.ts
    auth.service.ts
    jwt-auth.guard.ts
    roles.guard.ts
    roles.decorator.ts
  users/          # Usuarios
    user.entity.ts
    users.controller.ts
    users.service.ts
  parkings/       # Parqueaderos
    parking.entity.ts
    parkings.controller.ts
    parkings.service.ts
  vehicles/       # Vehículos y registros
    vehicle.entity.ts
    parking-record.entity.ts
    parking-history.entity.ts
    vehicles.controller.ts
    vehicles.service.ts
  indicators/     # Indicadores y estadísticas
    indicators.controller.ts
    indicators.service.ts
    interfaces/
  mail/           # Envío de correos (simulado)
    mail.controller.ts
    mail.service.ts
  common/         # Utilidades, guards, decoradores
    guards/
    decorators/
  app.module.ts
.env
```

---

## 3. Modelo Entidad Relación

- **User** (id, name, email, password, role)
  - Relación: 1:N con Parking (un SOCIO puede tener varios parqueaderos)
- **Parking** (id, name, address, capacity, price_per_hour, ownerId)
  - Relación: N:1 con User (ownerId)
  - Relación: 1:N con ParkingRecord
- **Vehicle** (id, plate, ownerName, email)
  - Relación: 1:N con ParkingRecord
- **ParkingRecord** (id, plate, parkingId, entryTime, exitTime, totalPrice)
  - Relación: N:1 con Parking
  - Relación: N:1 con Vehicle
- **ParkingHistory** (id, plate, parkingId, entryTime, exitTime, totalPrice)
  - Relación: N:1 con Parking
  - Relación: N:1 con Vehicle
- **MailLog** (id, email, subject, message, sentAt)
  - Relación: N:1 con User (opcional)

---


