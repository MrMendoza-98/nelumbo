import { Injectable, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Vehicle } from './vehicle.entity';
import { ParkingRecord } from './parking-record.entity';

@Injectable()
export class VehiclesService {
  constructor(
    @InjectRepository(Vehicle)
    private readonly vehicleRepository: Repository<Vehicle>,
    @InjectRepository(ParkingRecord)
    private readonly parkingRecordRepository: Repository<ParkingRecord>,
  ) {}

  async registreIngreso(plate: string, parkingId: number): Promise<'ok' | 'already_parked'> {
    // Verificar si el vehículo está parqueado en algún parqueadero
    const activeRecord = await this.parkingRecordRepository.findOne({ where: { plate, exitTime: require('typeorm').IsNull() } });
    if (activeRecord) return 'already_parked';
    // Registrar ingreso
    let vehicle = await this.vehicleRepository.findOne({ where: { plate } });
    if (!vehicle) {
      vehicle = this.vehicleRepository.create({ plate });
      await this.vehicleRepository.save(vehicle);
    }
    const record = this.parkingRecordRepository.create({ plate, parkingId, entryTime: new Date(), exitTime: undefined });
    await this.parkingRecordRepository.save(record);
    return 'ok';
  }

  async registrarSalida(plate: string, parkingId: number): Promise<'ok' | 'not_parked'> {
    // Buscar registro activo
    const activeRecord = await this.parkingRecordRepository.findOne({ where: { plate, parkingId, exitTime: require('typeorm').IsNull() } });
    if (!activeRecord) return 'not_parked';
    activeRecord.exitTime = new Date();
    await this.parkingRecordRepository.save(activeRecord);
    return 'ok';
  }

  async listVehiculosParqueados(parkingId: number) {
    // Listar vehículos actualmente parqueados en el parking
    const { IsNull } = require('typeorm');
    const records = await this.parkingRecordRepository.find({ where: { parkingId, exitTime: IsNull() } });
    return records.map(r => ({ plate: r.plate, entryTime: r.entryTime }));
  }
}
