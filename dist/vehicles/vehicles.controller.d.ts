import { VehiclesService } from './vehicles.service';
import { VehicleRegistrationDto, VehicleExitDto, VehicleRegistrationWithEmailDto } from './dto/vehicle-registration.dto';
export declare class VehiclesController {
    private readonly vehiclesService;
    constructor(vehiclesService: VehiclesService);
    registerEntry(body: VehicleRegistrationDto): Promise<import("./interfaces/vehicle.interface").VehicleRegistrationResult>;
    registerExit(body: VehicleExitDto): Promise<import("./interfaces/vehicle.interface").VehicleExitResult>;
    listParkedVehicles(parkingId: number): Promise<import("./interfaces/vehicle.interface").ParkedVehicle[]>;
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
    validateVehicleInParking(plate: string, parkingId: number): Promise<{
        plate: string;
        parkingId: number;
        isInParking: boolean;
        message: string;
        timestamp: string;
    }>;
    getVehicleInfoInParking(plate: string, parkingId: number): Promise<{
        id: number;
        plate: string;
        ownerName: string | undefined;
        email: string | undefined;
        createdAt: Date;
        updatedAt: Date;
        parkingInfo: {
            parkingId: number;
            entryTime: Date;
            isCurrentlyParked: boolean;
        };
    }>;
    sendRegistrationEmail(body: {
        email: string;
        plate: string;
        message: string;
        parkingId: number;
    }): Promise<{
        mensaje: string;
    }>;
    fullRegistration(body: VehicleRegistrationWithEmailDto): Promise<import("./interfaces/vehicle.interface").VehicleRegistrationResult>;
}
