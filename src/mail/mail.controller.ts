import {
  Controller,
  Post,
  Get,
  Body,
  Query,
  UseGuards,
  HttpStatus,
  HttpCode,
  ValidationPipe,
  ParseIntPipe,
  DefaultValuePipe,
} from '@nestjs/common';
import { MailService } from './mail.service';
import { SendMailDto } from './dto/send-mail.dto';
import { MailResponseDto, BulkMailResponseDto, MailHistoryResponseDto, MailStatsResponseDto } from './dto/mail-response.dto';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { RolesGuard } from '../common/guards/roles.guard';
import { Roles } from '../common/decorators/roles.decorator';

const Role = {
  ADMIN: 'ADMIN' as const,
  SOCIO: 'SOCIO' as const,
} as const;

@Controller('mail')
@UseGuards(JwtAuthGuard, RolesGuard)
export class MailController {
  constructor(private readonly mailService: MailService) {}

  /**
   * Envía un correo electrónico
   * @param sendMailDto Datos del correo
   * @returns Respuesta del envío
   */
  @Post('send')
  @HttpCode(HttpStatus.OK)
  @Roles(Role.ADMIN, Role.SOCIO)
  async sendMail(
    @Body(new ValidationPipe()) sendMailDto: SendMailDto,
  ): Promise<MailResponseDto> {
    return this.mailService.sendMail(sendMailDto);
  }

  /**
   * Envía múltiples correos en lote
   * @param sendMailDtos Array de correos
   * @returns Respuesta del envío masivo
   */
  @Post('send-bulk')
  @HttpCode(HttpStatus.OK)
  @Roles(Role.ADMIN)
  async sendBulkMail(
    @Body(new ValidationPipe()) sendMailDtos: SendMailDto[],
  ): Promise<BulkMailResponseDto> {
    const results = await this.mailService.sendBulkMail(sendMailDtos);
    
    const successful = results.filter(r => r.success).length;
    const failed = results.filter(r => !r.success).length;

    return {
      totalSent: results.length,
      successful,
      failed,
      results,
    };
  }

  /**
   * Envía notificación de parqueo
   * @param email Email del destinatario
   * @param parkingInfo Información del parqueo
   * @returns Respuesta del envío
   */
  @Post('send-parking-notification')
  @HttpCode(HttpStatus.OK)
  @Roles(Role.ADMIN, Role.SOCIO)
  async sendParkingNotification(
    @Body() body: {
      email: string;
      parkingInfo: {
        vehiclePlate: string;
        parkingName: string;
        entryTime: string;
        location?: string;
      };
    },
  ): Promise<MailResponseDto> {
    const entryTime = new Date(body.parkingInfo.entryTime);
    
    return this.mailService.sendParkingNotification(body.email, {
      ...body.parkingInfo,
      entryTime,
    });
  }

  /**
   * Envía correo de recordatorio
   * @param email Email del destinatario
   * @param reminderInfo Información del recordatorio
   * @returns Respuesta del envío
   */
  @Post('send-reminder')
  @HttpCode(HttpStatus.OK)
  @Roles(Role.ADMIN)
  async sendReminderEmail(
    @Body() body: {
      email: string;
      reminderInfo: {
        type: 'parking_expiry' | 'vehicle_registration' | 'payment_due';
        message: string;
        dueDate?: string;
      };
    },
  ): Promise<MailResponseDto> {
    const dueDate = body.reminderInfo.dueDate ? new Date(body.reminderInfo.dueDate) : undefined;
    
    return this.mailService.sendReminderEmail(body.email, {
      ...body.reminderInfo,
      dueDate,
    });
  }

  /**
   * Obtiene el historial de correos enviados
   * @param limit Límite de registros
   * @param offset Offset para paginación
   * @returns Historial de correos
   */
  @Get('history')
  @HttpCode(HttpStatus.OK)
  @Roles(Role.ADMIN)
  async getMailHistory(
    @Query('limit', new DefaultValuePipe(50), ParseIntPipe) limit: number,
    @Query('offset', new DefaultValuePipe(0), ParseIntPipe) offset: number,
  ): Promise<MailHistoryResponseDto> {
    const mails = await this.mailService.getMailHistory(limit, offset);
    const total = await this.mailService.getMailStats().then(stats => stats.totalSent);

    return {
      mails,
      total,
      limit,
      offset,
    };
  }

  /**
   * Obtiene estadísticas del servicio de correo
   * @returns Estadísticas del servicio
   */
  @Get('stats')
  @HttpCode(HttpStatus.OK)
  @Roles(Role.ADMIN)
  async getMailStats(): Promise<MailStatsResponseDto> {
    return this.mailService.getMailStats();
  }

  /**
   * Endpoint de salud del microservicio
   * @returns Estado del servicio
   */
  @Get('health')
  @HttpCode(HttpStatus.OK)
  async healthCheck(): Promise<{ status: string; timestamp: string; service: string }> {
    return {
      status: 'healthy',
      timestamp: new Date().toISOString(),
      service: 'mail-microservice',
    };
  }

  /**
   * Endpoint para probar la conectividad
   * @returns Mensaje de prueba
   */
  @Get('ping')
  @HttpCode(HttpStatus.OK)
  async ping(): Promise<{ message: string; timestamp: string }> {
    return {
      message: 'pong',
      timestamp: new Date().toISOString(),
    };
  }

  /**
   * Endpoint para envío de correo de registro de vehículos
   * @param body Datos del correo de registro
   * @returns Respuesta del envío
   */
  @Post('send-vehicle-registration')
  @HttpCode(HttpStatus.OK)
  @Roles(Role.ADMIN, Role.SOCIO)
  async sendVehicleRegistrationEmail(
    @Body() body: {
      email: string;
      placa: string;
      mensaje: string;
      parqueaderoNombre: string;
    },
  ): Promise<{ mensaje: string }> {
    // Log de la solicitud recibida
    console.log('Solicitud de correo de registro de vehículo recibida:', {
      email: body.email,
      placa: body.placa,
      mensaje: body.mensaje,
      parqueaderoNombre: body.parqueaderoNombre,
      timestamp: new Date().toISOString(),
    });

    // Simular envío del correo
    await this.mailService.sendMail({
      to: body.email,
      subject: `Registro de Vehículo - ${body.placa}`,
      body: body.mensaje,
    });

    return { mensaje: 'Correo Enviado' };
  }
}
