import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { MailLog, MailStatus, MailType } from './mail-log.entity';
import { SendMailDto, MailResponseDto } from './dto';

@Injectable()
export class MailService {
  private readonly logger = new Logger(MailService.name);

  constructor(
    @InjectRepository(MailLog)
    private mailLogRepository: Repository<MailLog>,
  ) {}

  /**
   * Simula el envío de un correo electrónico
   * @param sendMailDto Datos del correo a enviar
   * @returns Respuesta con el estado del envío
   */
  async sendMail(sendMailDto: SendMailDto): Promise<MailResponseDto> {
    try {
      this.logger.log(`Simulando envío de correo a: ${sendMailDto.to}`);

      // Simular delay de envío (entre 100ms y 2 segundos)
      const delay = Math.random() * 1900 + 100;
      await new Promise(resolve => setTimeout(resolve, delay));

      // Simular tasa de éxito del 95%
      const isSuccess = Math.random() < 0.95;

      if (!isSuccess) {
        throw new Error('Error simulado de envío de correo');
      }

      // Crear log del correo enviado
      const mailLog = this.mailLogRepository.create({
        to: sendMailDto.to,
        cc: sendMailDto.cc,
        bcc: sendMailDto.bcc,
        subject: sendMailDto.subject,
        body: sendMailDto.body,
        status: MailStatus.SENT,
        type: MailType.GENERAL,
        sent_at: new Date(),
        retry_count: 0,
      });

      await this.mailLogRepository.save(mailLog);

      this.logger.log(`Correo enviado exitosamente a: ${sendMailDto.to}`);

      return {
        success: true,
        message: 'Correo enviado exitosamente',
        mailId: mailLog.id,
        sentAt: mailLog.sent_at || new Date(),
        recipient: mailLog.to,
      };
    } catch (error) {
      this.logger.error(`Error al enviar correo a ${sendMailDto.to}: ${error.message}`);

      // Registrar el intento fallido
      const mailLog = this.mailLogRepository.create({
        to: sendMailDto.to,
        cc: sendMailDto.cc,
        bcc: sendMailDto.bcc,
        subject: sendMailDto.subject,
        body: sendMailDto.body,
        status: MailStatus.FAILED,
        type: MailType.GENERAL,
        error_message: error.message,
        retry_count: 1,
      });

      await this.mailLogRepository.save(mailLog);

      return {
        success: false,
        message: `Error al enviar correo: ${error.message}`,
        mailId: mailLog.id,
        sentAt: mailLog.sent_at || new Date(),
        recipient: mailLog.to,
      };
    }
  }

  /**
   * Envía múltiples correos en lote
   * @param sendMailDtos Array de correos a enviar
   * @returns Array de respuestas
   */
  async sendBulkMail(sendMailDtos: SendMailDto[]): Promise<MailResponseDto[]> {
    this.logger.log(`Iniciando envío masivo de ${sendMailDtos.length} correos`);

    const results: MailResponseDto[] = [];

    for (const mailDto of sendMailDtos) {
      const result = await this.sendMail(mailDto);
      results.push(result);
    }

    this.logger.log(`Envío masivo completado. ${results.filter(r => r.success).length}/${results.length} exitosos`);

    return results;
  }

  /**
   * Obtiene el historial de correos enviados
   * @param limit Límite de registros a retornar
   * @param offset Offset para paginación
   * @returns Array de logs de correos
   */
  async getMailHistory(limit: number = 50, offset: number = 0): Promise<MailLog[]> {
    return this.mailLogRepository.find({
      order: { created_at: 'DESC' },
      skip: offset,
      take: limit,
    });
  }

  /**
   * Obtiene estadísticas de envío de correos
   * @returns Estadísticas del servicio de correo
   */
  async getMailStats(): Promise<{
    totalSent: number;
    totalFailed: number;
    successRate: number;
    lastSentAt: Date | null;
  }> {
    const totalSent = await this.mailLogRepository.count();
    
    // Para simplicidad, asumimos que todos los registros son exitosos
    // En un sistema real, podrías agregar un campo 'status' a la entidad
    const totalFailed = 0; // Placeholder
    const successRate = totalSent > 0 ? ((totalSent - totalFailed) / totalSent) * 100 : 0;
    
    const lastMail = await this.mailLogRepository.findOne({
      order: { created_at: 'DESC' },
    });

    return {
      totalSent,
      totalFailed,
      successRate,
      lastSentAt: lastMail?.sent_at || null,
    };
  }

  /**
   * Simula el envío de un correo de notificación de parqueo
   * @param email Email del destinatario
   * @param parkingInfo Información del parqueo
   * @returns Respuesta del envío
   */
  async sendParkingNotification(
    email: string,
    parkingInfo: {
      vehiclePlate: string;
      parkingName: string;
      entryTime: Date;
      location?: string;
    },
  ): Promise<MailResponseDto> {
    const subject = 'Notificación de Parqueo - Nelumbo';
    const body = `
      Hola,
      
      Tu vehículo con placa ${parkingInfo.vehiclePlate} ha sido registrado 
      en el parqueadero ${parkingInfo.parkingName}.
      
      Hora de entrada: ${parkingInfo.entryTime.toLocaleString()}
      ${parkingInfo.location ? `Ubicación: ${parkingInfo.location}` : ''}
      
      Saludos,
      Equipo Nelumbo
    `;

    // Crear log del correo de notificación de parqueo
    const mailLog = this.mailLogRepository.create({
      to: email,
      subject,
      body: body.trim(),
      status: MailStatus.SENT,
      type: MailType.PARKING_NOTIFICATION,
      sent_at: new Date(),
      retry_count: 0,
    });

    await this.mailLogRepository.save(mailLog);

    return {
      success: true,
      message: 'Notificación de parqueo enviada exitosamente',
      mailId: mailLog.id,
      sentAt: mailLog.sent_at || new Date(),
      recipient: email,
    };
  }

  /**
   * Simula el envío de un correo de recordatorio
   * @param email Email del destinatario
   * @param reminderInfo Información del recordatorio
   * @returns Respuesta del envío
   */
  async sendReminderEmail(
    email: string,
    reminderInfo: {
      type: 'parking_expiry' | 'vehicle_registration' | 'payment_due';
      message: string;
      dueDate?: Date;
    },
  ): Promise<MailResponseDto> {
    const subject = `Recordatorio - ${reminderInfo.type.replace('_', ' ').toUpperCase()}`;
    const body = `
      Hola,
      
      ${reminderInfo.message}
      
      ${reminderInfo.dueDate ? `Fecha límite: ${reminderInfo.dueDate.toLocaleDateString()}` : ''}
      
      Por favor, revisa tu cuenta en el sistema Nelumbo.
      
      Saludos,
      Equipo Nelumbo
    `;

          return this.sendMail({
        to: email,
        subject,
        body: body.trim(),
      });
    }

  /**
   * Simula el envío de un correo de registro de vehículo
   * @param data Datos del correo de registro
   * @returns Respuesta del envío
   */
  async sendVehicleRegistrationEmail(data: {
    email: string;
    placa: string;
    mensaje: string;
    parqueaderoNombre: string;
  }): Promise<{ mensaje: string }> {
    try {
      // Simular delay de envío (entre 100ms y 2 segundos)
      const delay = Math.random() * 1900 + 100;
      await new Promise(resolve => setTimeout(resolve, delay));

      // Simular tasa de éxito del 95%
      const isSuccess = Math.random() < 0.95;

      if (!isSuccess) {
        throw new Error('Error simulado de envío de correo');
      }
      
      const mailLog = this.mailLogRepository.create({
        to: data.email,
        subject: `Registro de Vehículo - ${data.placa}`,
        body: data.mensaje,
        status: MailStatus.SENT,
        type: MailType.GENERAL,
        sent_at: new Date(),
        retry_count: 0,
      });
      await this.mailLogRepository.save(mailLog);
      
      return { mensaje: 'Correo Enviado' };
    } catch (error) {
      const mailLog = this.mailLogRepository.create({
        to: data.email,
        subject: `Registro de Vehículo - ${data.placa}`,
        body: data.mensaje,
        status: MailStatus.FAILED,
        type: MailType.GENERAL,
        error_message: error.message,
        retry_count: 1,
      });
      await this.mailLogRepository.save(mailLog);
      
      throw error;
    }
  }
}
