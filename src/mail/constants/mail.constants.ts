export const MAIL_CONSTANTS = {
  // Estados del correo
  STATUS: {
    PENDING: 'pending',
    SENT: 'sent',
    FAILED: 'failed',
    DELIVERED: 'delivered',
    BOUNCED: 'bounced',
    SPAM: 'spam',
  },

  // Tipos de correo
  TYPES: {
    GENERAL: 'general',
    PARKING_NOTIFICATION: 'parking_notification',
    REMINDER: 'reminder',
    SYSTEM: 'system',
    WELCOME: 'welcome',
    PASSWORD_RESET: 'password_reset',
  },

  // Prioridades
  PRIORITIES: {
    LOW: 'low',
    NORMAL: 'normal',
    HIGH: 'high',
    URGENT: 'urgent',
  },

  // Códigos de error
  ERROR_CODES: {
    INVALID_EMAIL: 'INVALID_EMAIL',
    EMAIL_TOO_LONG: 'EMAIL_TOO_LONG',
    SUBJECT_TOO_LONG: 'SUBJECT_TOO_LONG',
    BODY_TOO_LONG: 'BODY_TOO_LONG',
    RATE_LIMIT_EXCEEDED: 'RATE_LIMIT_EXCEEDED',
    QUOTA_EXCEEDED: 'QUOTA_EXCEEDED',
    TEMPORARY_FAILURE: 'TEMPORARY_FAILURE',
    PERMANENT_FAILURE: 'PERMANENT_FAILURE',
  },

  // Mensajes de error
  ERROR_MESSAGES: {
    INVALID_EMAIL: 'El formato del email no es válido',
    EMAIL_TOO_LONG: 'El email es demasiado largo',
    SUBJECT_TOO_LONG: 'El asunto es demasiado largo',
    BODY_TOO_LONG: 'El cuerpo del correo es demasiado largo',
    RATE_LIMIT_EXCEEDED: 'Se ha excedido el límite de envío',
    QUOTA_EXCEEDED: 'Se ha excedido la cuota de envío',
    TEMPORARY_FAILURE: 'Error temporal, intente más tarde',
    PERMANENT_FAILURE: 'Error permanente, no se puede enviar',
  },

  // Límites por defecto
  DEFAULT_LIMITS: {
    MAX_EMAIL_LENGTH: 254,
    MAX_SUBJECT_LENGTH: 200,
    MAX_BODY_LENGTH: 5000,
    MAX_BULK_SIZE: 100,
    MAX_RETRIES: 3,
    RATE_LIMIT: 100, // emails por minuto
  },

  // Configuración de reintentos
  RETRY_CONFIG: {
    INITIAL_DELAY: 1000, // 1 segundo
    MAX_DELAY: 300000, // 5 minutos
    BACKOFF_MULTIPLIER: 2,
  },

  // Headers personalizados
  CUSTOM_HEADERS: {
    X_MAIL_ID: 'X-Mail-ID',
    X_MAIL_TYPE: 'X-Mail-Type',
    X_MAIL_PRIORITY: 'X-Mail-Priority',
    X_MAIL_SOURCE: 'X-Mail-Source',
  },
} as const;
