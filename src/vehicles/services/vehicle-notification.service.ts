import { Injectable, Logger } from '@nestjs/common';
import { MailService } from '../../mail/mail.service';
import { ParkingsService } from '../../parkings/parkings.service';
import { EmailNotificationData } from '../interfaces/vehicle.interface';

@Injectable()
export class VehicleNotificationService {
  private readonly logger = new Logger(VehicleNotificationService.name);

  constructor(
    private readonly mailService: MailService,
    private readonly parkingsService: ParkingsService,
  ) {}

  /**
   * Envía notificación de registro de vehículo
   */
  async sendRegistrationNotification(data: EmailNotificationData): Promise<boolean> {
    try {
      this.logger.log(`Enviando notificación de registro para vehículo ${data.plate}`);

      const parking = await this.parkingsService.findOne(data.parkingId);
      const emailContent = this.generateRegistrationEmailContent(data, parking.name);

      await this.mailService.sendVehicleRegistrationEmail({
        email: data.email,
        placa: data.plate,
        mensaje: emailContent,
        parqueaderoNombre: parking.name,
      });

      this.logger.log(`Notificación enviada exitosamente a ${data.email}`);
      return true;
    } catch (error) {
      this.logger.error(`Error al enviar notificación: ${error.message}`, error.stack);
      return false;
    }
  }

  /**
   * Genera el contenido del email de registro
   */
  private generateRegistrationEmailContent(data: EmailNotificationData, parkingName: string): string {
    const currentTime = new Date().toLocaleString('es-ES');
    
    return `¡Bienvenido a Nelumbo!

Su vehículo con placa ${data.plate} ha sido registrado exitosamente.

📋 Detalles del registro:
• Placa: ${data.plate}
• Parqueadero: ${parkingName}
• Hora de entrada: ${currentTime}
• Estado: ✅ Activo

${data.ownerName ? `👤 Propietario: ${data.ownerName}` : ''}

🚗 Su vehículo ya está registrado en nuestro sistema.

Saludos,
Equipo Nelumbo`;
  }
}
