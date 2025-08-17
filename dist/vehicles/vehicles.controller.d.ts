import { VehiclesService } from './vehicles.service';
import { VehicleRegistrationDto, VehicleExitDto, VehicleRegistrationWithEmailDto } from './dto/vehicle-registration.dto';
export declare class VehiclesController {
    private readonly vehiclesService;
    constructor(vehiclesService: VehiclesService);
    registreIngreso(body: VehicleRegistrationDto): Promise<import("./interfaces/vehicle.interface").VehicleRegistrationResult>;
    registrarSalida(body: VehicleExitDto): Promise<import("./interfaces/vehicle.interface").VehicleExitResult>;
    listVehiculosParqueados(parkingId: number): Promise<import("./interfaces/vehicle.interface").ParkedVehicle[]>;
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
    enviarCorreoRegistro(body: {
        email: string;
        placa: string;
        mensaje: string;
        parqueaderoId: number;
    }): Promise<{
        mensaje: string;
    }>;
    registroCompleto(body: VehicleRegistrationWithEmailDto): Promise<import("./interfaces/vehicle.interface").VehicleRegistrationResult>;
}
