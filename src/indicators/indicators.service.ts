import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, Between, Like, IsNull } from 'typeorm';
import { Vehicle } from '../vehicles/vehicle.entity';
import { ParkingRecord } from '../vehicles/parking-record.entity';
import { TopVehiclesResponse } from './interfaces/indicators.interface';

@Injectable()
export class IndicatorsService {
  private readonly logger = new Logger(IndicatorsService.name);

  constructor(
    @InjectRepository(Vehicle)
    private readonly vehicleRepository: Repository<Vehicle>,
    @InjectRepository(ParkingRecord)
    private readonly parkingRecordRepository: Repository<ParkingRecord>,
  ) {}

  async getTop10MostFrequentVehicles(): Promise<TopVehiclesResponse> {
    this.logger.log('Obteniendo los 10 vehículos más frecuentes');
    // Consulta agrupada por placa, id de parqueadero y cuenta de registros
    const result = await this.parkingRecordRepository
      .createQueryBuilder('pr')
      .select('pr.plate', 'plate')
      .addSelect('pr.parkingId', 'parkingId')
      .addSelect('COUNT(*)', 'count')
      .groupBy('pr.plate')
      .addGroupBy('pr.parkingId')
      .orderBy('count', 'DESC')
      .limit(10)
      .getRawMany();
    return {
      vehicles: result.map(r => ({ plate: r.plate, parkingId: r.parkingId, count: Number(r.count) })),
      total: result.length,
      summary: {
        totalRegistrations: result.reduce((sum, r) => sum + Number(r.count), 0),
        averageRegistrations: result.length > 0 ? result.reduce((sum, r) => sum + Number(r.count), 0) / result.length : 0,
        mostFrequentVehicle: result.length > 0 ? result[0].plate : '',
        mostFrequentParkingId: result.length > 0 ? result[0].parkingId : null,
        mostFrequentCount: result.length > 0 ? Number(result[0].count) : 0,
      },
      timestamp: new Date(),
    };
  }

  async getTop10VehiclesByParking(parkingId: number): Promise<TopVehiclesResponse> {
    this.logger.log(`Obteniendo los 10 vehículos más frecuentes en el parqueadero ${parkingId}`);
    // Consulta agrupada por placa y cuenta de registros, filtrando por el parqueadero
    const result = await this.parkingRecordRepository
      .createQueryBuilder('pr')
      .select('pr.plate', 'plate')
      .addSelect('COUNT(*)', 'count')
      .where('pr.parkingId = :parkingId', { parkingId })
      .groupBy('pr.plate')
      .orderBy('count', 'DESC')
      .limit(10)
      .getRawMany();
    return {
      vehicles: result.map(r => ({ plate: r.plate, count: Number(r.count) })),
      total: result.length,
      summary: {
        totalRegistrations: result.reduce((sum, r) => sum + Number(r.count), 0),
        averageRegistrations: result.length > 0 ? result.reduce((sum, r) => sum + Number(r.count), 0) / result.length : 0,
        mostFrequentVehicle: result.length > 0 ? result[0].plate : '',
        mostFrequentParkingId: result.length > 0 ? (result[0].parkingId ?? null) : null,
        mostFrequentCount: result.length > 0 ? Number(result[0].count) : 0,
      },
      timestamp: new Date(),
    };
  }

  async getFirstTimeParkedVehicles(parkingId: number): Promise<{ plate: string; entryTime: Date }[]> {
    this.logger.log(`Obteniendo vehículos parqueados por primera vez en el parqueadero ${parkingId}`);
    // Vehículos actualmente parqueados en el parking
    const currentRecords = await this.parkingRecordRepository.find({ where: { parkingId, exitTime: require('typeorm').IsNull() } });
    const firstTimers: { plate: string; entryTime: Date }[] = [];
    for (const record of currentRecords) {
      // ¿Es la primera vez que este vehículo se parquea aquí?
      const totalRecords = await this.parkingRecordRepository.count({ where: { plate: record.plate, parkingId } });
      if (totalRecords === 1) {
        firstTimers.push({ plate: record.plate, entryTime: record.entryTime });
      }
    }
    return firstTimers;
  }

  async getParkingEarnings(parkingId: number): Promise<{ today: number; week: number; month: number; year: number }> {
    const now = new Date();
    const startOfDay = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    const startOfWeek = new Date(now);
    startOfWeek.setDate(now.getDate() - now.getDay());
    startOfWeek.setHours(0, 0, 0, 0);
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
    const startOfYear = new Date(now.getFullYear(), 0, 1);

    // Helper para sumar ganancias
    const sumEarnings = async (start: Date, end: Date) => {
      const records = await this.parkingRecordRepository.find({
        where: {
          parkingId,
          exitTime: Between(start, end),
        },
      });
      return records.reduce((sum, r) => sum + (r.totalPrice || 0), 0);
    };

    const today = await sumEarnings(startOfDay, now);
    const week = await sumEarnings(startOfWeek, now);
    const month = await sumEarnings(startOfMonth, now);
    const year = await sumEarnings(startOfYear, now);

    return { today, week, month, year };
  }

  async searchParkedVehiclesByPlate(partialPlate: string): Promise<{ plate: string; entryTime: Date; parkingId: number }[]> {
    this.logger.log(`Buscando vehículos parqueados con coincidencia en placa: ${partialPlate}`);
    const records = await this.parkingRecordRepository.find({
      where: {
        plate: Like(`%${partialPlate}%`),
        exitTime: IsNull(),
      },
    });
    return records.map(r => ({ plate: r.plate, entryTime: r.entryTime, parkingId: r.parkingId }));
  }
}
