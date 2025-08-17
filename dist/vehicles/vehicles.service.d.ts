import { Repository } from 'typeorm';
import { Vehicle } from './vehicle.entity';
import { ParkingRecord } from './parking-record.entity';
import { VehicleNotificationService } from './services/vehicle-notification.service';
import { VehicleRegistrationResult, VehicleExitResult, ParkedVehicle } from './interfaces/vehicle.interface';
export declare class VehiclesService {
    private readonly vehicleRepository;
    private readonly parkingRecordRepository;
    private readonly notificationService;
    private readonly logger;
    constructor(vehicleRepository: Repository<Vehicle>, parkingRecordRepository: Repository<ParkingRecord>, notificationService: VehicleNotificationService);
    registreIngreso(plate: string, parkingId: number, email?: string, ownerName?: string): Promise<VehicleRegistrationResult>;
    registrarSalida(plate: string, parkingId: number): Promise<VehicleExitResult>;
    listVehiculosParqueados(parkingId: number): Promise<ParkedVehicle[]>;
    getVehicleInfo(plate: string): Promise<{
        id: number;
        plate: string;
        ownerName: string | undefined;
        email: string | undefined;
        createdAt: Date;
        updatedAt: Date;
        isCurrentlyParked: boolean;
        currentParkingId: number | null;
        currentEntryTime: Date | null;
    }>;
    sendVehicleRegistrationEmail(email: string, placa: string, mensaje: string, parqueaderoId: number): Promise<{
        mensaje: string;
    }>;
    private validateVehicleNotParked;
    private ensureVehicleExists;
    private createParkingRecord;
    private findActiveParkingRecord;
    private sendRegistrationEmail;
}
