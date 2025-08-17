import { Repository } from 'typeorm';
import { Vehicle } from './vehicle.entity';
import { ParkingRecord } from './parking-record.entity';
export declare class VehiclesService {
    private readonly vehicleRepository;
    private readonly parkingRecordRepository;
    constructor(vehicleRepository: Repository<Vehicle>, parkingRecordRepository: Repository<ParkingRecord>);
    registreIngreso(plate: string, parkingId: number): Promise<'ok' | 'already_parked'>;
    registrarSalida(plate: string, parkingId: number): Promise<'ok' | 'not_parked'>;
    listVehiculosParqueados(parkingId: number): Promise<{
        plate: string;
        entryTime: Date;
    }[]>;
}
