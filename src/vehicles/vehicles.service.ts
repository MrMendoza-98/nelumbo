import { Injectable, BadRequestException, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, IsNull } from 'typeorm';
import { Vehicle } from './vehicle.entity';
import { ParkingRecord } from './parking-record.entity';
import { Parking } from '../parkings/parking.entity';
import { ParkingHistory } from './parking-history.entity';
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
    @InjectRepository(Parking)
    private readonly parkingRepository: Repository<Parking>,
    @InjectRepository(ParkingHistory)
    private readonly historyRepository: Repository<ParkingHistory>,
    private readonly notificationService: VehicleNotificationService,
  ) {}

  /**
   * Registra la entrada de un vehículo al parqueadero
   */
  async registerEntry(
    plate: string,
    parkingId: number,
    email?: string,
    ownerName?: string
  ): Promise<VehicleRegistrationResult> {
    this.logger.log(`Registrando ingreso del vehículo ${plate} al parqueadero ${parkingId}`);

    // Valida el formato de  la placa
    const plateRegex = /^[A-Za-z0-9]{6}$/;
    if (!plateRegex.test(plate) || plate.toLowerCase().includes('ñ')) {
      throw new BadRequestException('La placa debe ser alfanumérica, de 6 caracteres, sin caracteres especiales ni la letra ñ');
    }

    // Valida que el vehículo no esté parqueado
    await this.validateVehicleNotParked(plate);

    // Valida la capacidad máxima del parqueadero
    const parking = await this.parkingRepository.findOne({ where: { id: parkingId } });
    if (!parking) {
      throw new BadRequestException(`Parqueadero ${parkingId} no encontrado`);
    }
    const count = await this.parkingRecordRepository.count({ where: { parkingId, exitTime: IsNull() } });
    if (count >= parking.capacity) {
      throw new BadRequestException(`El parqueadero ha alcanzado su capacidad máxima (${parking.capacity})`);
    }

    const vehicle = await this.ensureVehicleExists(plate, email, ownerName);
    const parkingRecord = await this.createParkingRecord(plate, parkingId);

    
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
   * Valida que un vehículo esté en un parqueadero específico
   */
  async isVehicleInParking(plate: string, parkingId: number): Promise<boolean> {
    this.logger.log(`Validando que el vehículo ${plate} esté en el parqueadero ${parkingId}`);
    
    try {
      await this.validateVehicleInParking(plate, parkingId);
      return true;
    } catch (error) {
      return false;
    }
  }

  /**
   * Registra la salida de un vehículo del parqueadero
   */
  async registerExit(plate: string, parkingId: number): Promise<VehicleExitResult> {
    this.logger.log(`Registrando salida del vehículo ${plate} del parqueadero ${parkingId}`);

    const parkingRecord = await this.findActiveParkingRecord(plate, parkingId);
    parkingRecord.exitTime = new Date();

    
    const parking = await this.parkingRepository.findOne({ where: { id: parkingId } });
    if (!parking) {
      throw new BadRequestException(`Parqueadero ${parkingId} no encontrado`);
    }
    const entry = parkingRecord.entryTime.getTime();
    const exit = parkingRecord.exitTime.getTime();
    const hours = Math.ceil((exit - entry) / (1000 * 60 * 60));
    parkingRecord.totalPrice = Number(parking.price_per_hour) * hours;

    await this.parkingRecordRepository.save(parkingRecord);

    
    const vehicleEntity = await this.vehicleRepository.findOne({ where: { plate } });
    if (!vehicleEntity) {
      throw new BadRequestException(`Vehículo con placa ${plate} no encontrado para historial`);
    }
    const history = new ParkingHistory();
    history.vehicle = vehicleEntity;
    history.parking = parking;
    history.entry_time = parkingRecord.entryTime;
    history.exit_time = parkingRecord.exitTime;
    history.total_price = parkingRecord.totalPrice;
    await this.historyRepository.save(history);

    this.logger.log(`Salida registrada exitosamente para vehículo ${plate}`);

    return {
      success: true,
      message: 'Salida registrada exitosamente',
      plate,
      parkingId,
      exitTime: parkingRecord.exitTime,
      totalPrice: parkingRecord.totalPrice
    };
  }

  /**
   * Lista los vehículos parqueados en un parqueadero
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
   * Obtiene la información de un vehículo en un parqueadero específico
   */
  async getVehicleInfoInParking(plate: string, parkingId: number) {
    this.logger.log(`Obteniendo información del vehículo ${plate} en parqueadero ${parkingId}`);

    const vehicle = await this.vehicleRepository.findOne({ where: { plate } });
    if (!vehicle) {
      throw new BadRequestException(`Vehículo con placa ${plate} no encontrado`);
    }

    
    const parkingRecord = await this.parkingRecordRepository.findOne({
      where: { plate, parkingId, exitTime: IsNull() }
    });

    if (!parkingRecord) {
      throw new BadRequestException(`El vehículo con placa ${plate} no se encuentra en el parqueadero ${parkingId}`);
    }

    return {
      id: vehicle.id,
      plate: vehicle.plate,
      ownerName: vehicle.ownerName,
      email: vehicle.email,
      createdAt: vehicle.createdAt,
      updatedAt: vehicle.updatedAt,
      parkingInfo: {
        parkingId: parkingRecord.parkingId,
        entryTime: parkingRecord.entryTime,
        isCurrentlyParked: true
      }
    };
  }

  /**
   * Envía el correo de registro de vehículo
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


  /**
   * Valida que el vehículo no esté parqueado en ningún parqueadero
   */
  private async validateVehicleNotParked(plate: string): Promise<void> {
    const activeRecord = await this.parkingRecordRepository.findOne({
      where: { plate, exitTime: IsNull() }
    });

    if (activeRecord) {
      throw new BadRequestException(`El vehículo con placa ${plate} ya está parqueado en el parqueadero ${activeRecord.parkingId}`);
    }
  }

  /**
   * Valida que el vehículo esté en el parqueadero especificado
   */
  private async validateVehicleInParking(plate: string, parkingId: number): Promise<void> {
    const activeRecord = await this.parkingRecordRepository.findOne({
      where: { plate, parkingId, exitTime: IsNull() }
    });

    if (!activeRecord) {
      throw new BadRequestException(`El vehículo con placa ${plate} no se encuentra en el parqueadero ${parkingId}`);
    }
  }

  /**
   * Revisa que el vehículo existe en la base de datos
   */
  private async ensureVehicleExists(plate: string, email?: string, ownerName?: string): Promise<Vehicle> {
    let vehicle = await this.vehicleRepository.findOne({ where: { plate } });
    
    if (!vehicle) {
      
      vehicle = this.vehicleRepository.create({ 
        plate,
        email,
        ownerName
      });
      await this.vehicleRepository.save(vehicle);
      this.logger.log(`Nuevo vehículo creado con placa ${plate} y propietario ${ownerName || 'No especificado'}`);
    } else if (email && ownerName) {
      
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
