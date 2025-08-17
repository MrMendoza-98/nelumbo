export const mailConfig = {
  // Configuración de simulación
  simulation: {
    // Tasa de éxito del envío (0.95 = 95%)
    successRate: 0.95,
    // Delay mínimo en milisegundos
    minDelay: 100,
    // Delay máximo en milisegundos
    maxDelay: 2000,
    // Número máximo de reintentos
    maxRetries: 3,
  },
  
  // Configuración de plantillas
  templates: {
    parkingNotification: {
      subject: 'Notificación de Parqueo - Nelumbo',
      from: 'noreply@nelumbo.com',
    },
    reminder: {
      subject: 'Recordatorio - Nelumbo',
      from: 'noreply@nelumbo.com',
    },
    system: {
      subject: 'Notificación del Sistema - Nelumbo',
      from: 'system@nelumbo.com',
    },
  },
  
  // Configuración de límites
  limits: {
    // Tamaño máximo del cuerpo del correo (caracteres)
    maxBodyLength: 5000,
    // Tamaño máximo del asunto (caracteres)
    maxSubjectLength: 200,
    // Número máximo de correos en lote
    maxBulkSize: 100,
    // Tiempo máximo de procesamiento por correo (ms)
    maxProcessingTime: 10000,
  },
  
  // Configuración de logging
  logging: {
    // Nivel de log para el servicio
    level: 'info',
    // Habilitar logs detallados
    verbose: false,
    // Habilitar logs de métricas
    metrics: true,
  },
};
