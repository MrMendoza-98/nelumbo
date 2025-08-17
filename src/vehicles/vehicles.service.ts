import { Injectable, BadRequestException, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, IsNull } from 'typeorm';
import { Vehicle } from './vehicle.entity';
import { ParkingRecord } from './parking-record.entity';
import { VehicleNotificationService } from './services/vehicle-notification.service';
import { 
  VehicleRegistrationResult, 
  VehicleExitResult, 
  ParkedVehicle,
  EmailNotificationData 
} from './interfaces/vehicle.interface';

@Injectable()
export class VehiclesService {
  private readonly logger = new Logger(VehiclesService.name);

  constructor(
    @InjectRepository(Vehicle)
    private readonly vehicleRepository: Repository<Vehicle>,
    @InjectRepository(ParkingRecord)
    private readonly parkingRecordRepository: Repository<ParkingRecord>,
    private readonly notificationService: VehicleNotificationService,
  ) {}

  /**
   * Registra el ingreso de un vehículo al parqueadero
   */
  async registreIngreso(
    plate: string, 
    parkingId: number, 
    email?: string,
    ownerName?: string
  ): Promise<VehicleRegistrationResult> {
    this.logger.log(`Registrando ingreso del vehículo ${plate} al parqueadero ${parkingId}`);

    // Validar que el vehículo no esté ya parqueado
    await this.validateVehicleNotParked(plate);

    // Registrar el vehículo y el ingreso
    const vehicle = await this.ensureVehicleExists(plate, email, ownerName);
    const parkingRecord = await this.createParkingRecord(plate, parkingId);

    // Enviar notificación por email si se proporciona
    let emailSent = false;
    let emailMessage = '';
    
    if (email && ownerName) {
      emailSent = await this.sendRegistrationEmail({
        email,
        plate,
        parkingId,
        ownerName
      });
      emailMessage = emailSent 
        ? 'Correo de confirmación enviado exitosamente'
        : 'Error al enviar correo de confirmación';
    }

    this.logger.log(`Ingreso registrado exitosamente para vehículo ${plate}`);

    return {
      success: true,
      message: 'Ingreso registrado exitosamente',
      plate,
      parkingId,
      emailSent,
      emailMessage,
      timestamp: new Date()
    };
  }

  /**
   * Registra la salida de un vehículo del parqueadero
   */
  async registrarSalida(plate: string, parkingId: number): Promise<VehicleExitResult> {
    this.logger.log(`Registrando salida del vehículo ${plate} del parqueadero ${parkingId}`);

    const parkingRecord = await this.findActiveParkingRecord(plate, parkingId);
    parkingRecord.exitTime = new Date();
    await this.parkingRecordRepository.save(parkingRecord);

    this.logger.log(`Salida registrada exitosamente para vehículo ${plate}`);

    return {
      success: true,
      message: 'Salida registrada exitosamente',
      plate,
      parkingId,
      exitTime: parkingRecord.exitTime
    };
  }

  /**
   * Lista los vehículos actualmente parqueados en un parqueadero
   */
  async listVehiculosParqueados(parkingId: number): Promise<ParkedVehicle[]> {
    this.logger.log(`Listando vehículos parqueados en parqueadero ${parkingId}`);

    const records = await this.parkingRecordRepository.find({
      where: { parkingId, exitTime: IsNull() },
      order: { entryTime: 'DESC' }
    });

    return records.map(record => ({
      plate: record.plate,
      entryTime: record.entryTime,
      parkingId: record.parkingId
    }));
  }

  /**
   * Obtiene información completa de un vehículo
   */
  async getVehicleInfo(plate: string) {
    this.logger.log(`Obteniendo información del vehículo ${plate}`);

    const vehicle = await this.vehicleRepository.findOne({ where: { plate } });
    if (!vehicle) {
      throw new BadRequestException(`Vehículo con placa ${plate} no encontrado`);
    }

    // Buscar si está actualmente parqueado
    const activeRecord = await this.parkingRecordRepository.findOne({
      where: { plate, exitTime: IsNull() }
    });

    return {
      id: vehicle.id,
      plate: vehicle.plate,
      ownerName: vehicle.ownerName,
      email: vehicle.email,
      createdAt: vehicle.createdAt,
      updatedAt: vehicle.updatedAt,
      isCurrentlyParked: !!activeRecord,
      currentParkingId: activeRecord?.parkingId || null,
      currentEntryTime: activeRecord?.entryTime || null
    };
  }

  /**
   * Envía correo de registro de vehículo (método legacy para compatibilidad)
   */
  async sendVehicleRegistrationEmail(
    email: string,
    placa: string,
    mensaje: string,
    parqueaderoId: number,
  ): Promise<{ mensaje: string }> {
    this.logger.log(`Enviando correo de registro para vehículo ${placa}`);

    try {
      const emailSent = await this.notificationService.sendRegistrationNotification({
        email,
        plate: placa,
        parkingId: parqueaderoId
      });

      if (emailSent) {
        return { mensaje: 'Correo Enviado' };
      } else {
        throw new Error('No se pudo enviar el correo');
      }
    } catch (error) {
      this.logger.error(`Error al enviar correo: ${error.message}`);
      throw new BadRequestException('Error al enviar el correo de registro');
    }
  }

  // Métodos privados para mantener el código limpio

  /**
   * Valida que el vehículo no esté ya parqueado
   */
  private async validateVehicleNotParked(plate: string): Promise<void> {
    const activeRecord = await this.parkingRecordRepository.findOne({
      where: { plate, exitTime: IsNull() }
    });

    if (activeRecord) {
      throw new BadRequestException(`El vehículo con placa ${plate} ya está parqueado en algún parqueadero`);
    }
  }

  /**
   * Asegura que el vehículo existe en la base de datos
   */
  private async ensureVehicleExists(plate: string, email?: string, ownerName?: string): Promise<Vehicle> {
    let vehicle = await this.vehicleRepository.findOne({ where: { plate } });
    
    if (!vehicle) {
      // Crear nuevo vehículo con información del propietario
      vehicle = this.vehicleRepository.create({ 
        plate,
        email,
        ownerName
      });
      await this.vehicleRepository.save(vehicle);
      this.logger.log(`Nuevo vehículo creado con placa ${plate} y propietario ${ownerName || 'No especificado'}`);
    } else if (email && ownerName) {
      // Actualizar información del propietario si no estaba disponible antes
      if (!vehicle.email || !vehicle.ownerName) {
        vehicle.email = email;
        vehicle.ownerName = ownerName;
        await this.vehicleRepository.save(vehicle);
        this.logger.log(`Información del propietario actualizada para vehículo ${plate}`);
      }
    }

    return vehicle;
  }

  /**
   * Crea el registro de parqueo
   */
  private async createParkingRecord(plate: string, parkingId: number): Promise<ParkingRecord> {
    const record = this.parkingRecordRepository.create({
      plate,
      parkingId,
      entryTime: new Date(),
      exitTime: undefined
    });

    return await this.parkingRecordRepository.save(record);
  }

  /**
   * Busca el registro activo de parqueo
   */
  private async findActiveParkingRecord(plate: string, parkingId: number): Promise<ParkingRecord> {
    const record = await this.parkingRecordRepository.findOne({
      where: { plate, parkingId, exitTime: IsNull() }
    });

    if (!record) {
      throw new BadRequestException(`El vehículo con placa ${plate} no está actualmente parqueado en ese parqueadero`);
    }

    return record;
  }

  /**
   * Envía el correo de registro
   */
  private async sendRegistrationEmail(data: EmailNotificationData): Promise<boolean> {
    try {
      return await this.notificationService.sendRegistrationNotification(data);
    } catch (error) {
      this.logger.error(`Error al enviar correo automático: ${error.message}`);
      return false;
    }
  }
}
