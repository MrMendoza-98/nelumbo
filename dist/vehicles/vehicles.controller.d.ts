import { VehiclesService } from './vehicles.service';
export declare class VehiclesController {
    private readonly vehiclesService;
    constructor(vehiclesService: VehiclesService);
    registreIngreso(body: {
        plate: string;
        parkingId: number;
    }): Promise<{
        message: string;
        plate: string;
        parkingId: number;
    }>;
    registrarSalida(body: {
        plate: string;
        parkingId: number;
    }): Promise<{
        message: string;
        plate: string;
        parkingId: number;
    }>;
    listVehiculosParqueados(parkingId: number): Promise<{
        plate: string;
        entryTime: Date;
    }[]>;
}
