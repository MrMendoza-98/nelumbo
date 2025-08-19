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

  /**
   * Obtiene los 10 vehículos más frecuentes en los diferentes parqueaderos.
   * @returns Un objeto con el top de vehículos, totales y resumen.
   */
  async getTop10MostFrequentVehicles(): Promise<TopVehiclesResponse> {
    this.logger.log('Obteniendo los 10 vehículos más frecuentes');
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

  /**
   * Obtiene los 10 vehículos más frecuentes en un parqueadero en específico.
   * @param parkingId ID del parqueadero
   * @returns Un objeto con el top de vehículos, totales y resumen.
   */
  async getTop10VehiclesByParking(parkingId: number): Promise<TopVehiclesResponse> {
    this.logger.log(`Obteniendo los 10 vehículos más frecuentes en el parqueadero ${parkingId}`);
    // Consulta que agrupa por placa y cuenta los registros, filtrando  el parqueadero
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

  /**
   * Obtiene los vehículos que se han parqueado por primera vez en un parqueadero.
   * @param parkingId ID del parqueadero
   * @returns Array de placas y fecha de ingreso.
   */
  async getFirstTimeParkedVehicles(parkingId: number): Promise<{ plate: string; entryTime: Date }[]> {
    this.logger.log(`Obteniendo vehículos parqueados por primera vez en el parqueadero ${parkingId}`);
    
    const currentRecords = await this.parkingRecordRepository.find({ where: { parkingId, exitTime: require('typeorm').IsNull() } });
    const firstTimers: { plate: string; entryTime: Date }[] = [];
    for (const record of currentRecords) {
      
      const totalRecords = await this.parkingRecordRepository.count({ where: { plate: record.plate, parkingId } });
      if (totalRecords === 1) {
        firstTimers.push({ plate: record.plate, entryTime: record.entryTime });
      }
    }
    return firstTimers;
  }

  /**
   * Obtiene las ganancias del día, semana, mes y año de un parqueadero.
   * @param parkingId ID del parqueadero
   * @returns Retorna objeto con las ganancias agrupadas por periodo.
   */
  async getParkingEarnings(parkingId: number): Promise<{ today: number; week: number; month: number; year: number }> {
    const now = new Date();
    const startOfDay = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    const startOfWeek = new Date(now);
    startOfWeek.setDate(now.getDate() - now.getDay());
    startOfWeek.setHours(0, 0, 0, 0);
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
    const startOfYear = new Date(now.getFullYear(), 0, 1);

    
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

  /**
   * Busca los vehículos parqueados por coincidencias en la placa.
   * @param partialPlate Fragmento de placa
   * @returns Array de vehículos parqueados que coinciden.
   */
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
