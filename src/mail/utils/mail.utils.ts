import { MAIL_CONSTANTS } from '../constants/mail.constants';

/**
 * Valida el formato de un email
 * @param email Email a validar
 * @returns true si es válido, false en caso contrario
 */
export function isValidEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

/**
 * Valida la longitud de un campo
 * @param value Valor a validar
 * @param maxLength Longitud máxima permitida
 * @returns true si es válido, false en caso contrario
 */
export function isValidLength(value: string, maxLength: number): boolean {
  return value.length <= maxLength;
}

/**
 * Genera un ID único para el correo
 * @returns ID único
 */
export function generateMailId(): string {
  return `mail_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
}

/**
 * Calcula el delay para reintentos usando backoff exponencial
 * @param retryCount Número de reintentos
 * @returns Delay en milisegundos
 */
export function calculateRetryDelay(retryCount: number): number {
  const { INITIAL_DELAY, MAX_DELAY, BACKOFF_MULTIPLIER } = MAIL_CONSTANTS.RETRY_CONFIG;
  const delay = INITIAL_DELAY * Math.pow(BACKOFF_MULTIPLIER, retryCount);
  return Math.min(delay, MAX_DELAY);
}

/**
 * Formatea un mensaje de error
 * @param errorCode Código de error
 * @param details Detalles adicionales del error
 * @returns Mensaje de error formateado
 */
export function formatErrorMessage(errorCode: string, details?: string): string {
  const baseMessage = MAIL_CONSTANTS.ERROR_MESSAGES[errorCode as keyof typeof MAIL_CONSTANTS.ERROR_MESSAGES] || 'Error desconocido';
  return details ? `${baseMessage}: ${details}` : baseMessage;
}

/**
 * Sanitiza el contenido del correo para prevenir inyección
 * @param content Contenido a sanitizar
 * @returns Contenido sanitizado
 */
export function sanitizeContent(content: string): string {
  return content
    .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '')
    .replace(/javascript:/gi, '')
    .replace(/on\w+\s*=/gi, '')
    .trim();
}

/**
 * Valida los datos de entrada del correo
 * @param data Datos a validar
 * @returns Objeto con errores de validación
 */
export function validateMailData(data: any): { isValid: boolean; errors: string[] } {
  const errors: string[] = [];

  if (!data.to || !isValidEmail(data.to)) {
    errors.push(MAIL_CONSTANTS.ERROR_MESSAGES.INVALID_EMAIL);
  }

  if (data.to && !isValidLength(data.to, MAIL_CONSTANTS.DEFAULT_LIMITS.MAX_EMAIL_LENGTH)) {
    errors.push(MAIL_CONSTANTS.ERROR_MESSAGES.EMAIL_TOO_LONG);
  }

  if (!data.subject || !isValidLength(data.subject, MAIL_CONSTANTS.DEFAULT_LIMITS.MAX_SUBJECT_LENGTH)) {
    errors.push(MAIL_CONSTANTS.ERROR_MESSAGES.SUBJECT_TOO_LONG);
  }

  if (!data.body || !isValidLength(data.body, MAIL_CONSTANTS.DEFAULT_LIMITS.MAX_BODY_LENGTH)) {
    errors.push(MAIL_CONSTANTS.ERROR_MESSAGES.BODY_TOO_LONG);
  }

  return {
    isValid: errors.length === 0,
    errors,
  };
}

/**
 * Genera un hash simple para el contenido del correo
 * @param content Contenido del correo
 * @returns Hash del contenido
 */
export function generateContentHash(content: string): string {
  let hash = 0;
  if (content.length === 0) return hash.toString();
  
  for (let i = 0; i < content.length; i++) {
    const char = content.charCodeAt(i);
    hash = ((hash << 5) - hash) + char;
    hash = hash & hash; // Convert to 32bit integer
  }
  
  return Math.abs(hash).toString(36);
}

/**
 * Formatea la fecha para mostrar en logs
 * @param date Fecha a formatear
 * @returns Fecha formateada
 */
export function formatDateForLogs(date: Date): string {
  return date.toISOString().replace('T', ' ').substr(0, 19);
}

/**
 * Calcula estadísticas básicas de un array de resultados
 * @param results Array de resultados
 * @returns Estadísticas calculadas
 */
export function calculateStats(results: any[]): {
  total: number;
  successful: number;
  failed: number;
  successRate: number;
} {
  const total = results.length;
  const successful = results.filter(r => r.success).length;
  const failed = total - successful;
  const successRate = total > 0 ? (successful / total) * 100 : 0;

  return {
    total,
    successful,
    failed,
    successRate,
  };
}
