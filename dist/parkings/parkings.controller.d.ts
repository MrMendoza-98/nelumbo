import { ParkingsService } from './parkings.service';
import { Parking } from './parking.entity';
export declare class ParkingsController {
    private readonly parkingsService;
    constructor(parkingsService: ParkingsService);
    findAll(): Promise<Parking[]>;
    findOne(id: number): Promise<Parking>;
    create(parkingData: {
        name: string;
        capacity: number;
        price_per_hour: number;
        ownerId: number;
    }): Promise<Parking>;
    update(id: number, parkingData: {
        name?: string;
        capacity?: number;
        price_per_hour?: number;
        ownerId?: number;
    }): Promise<Parking>;
    remove(id: number): Promise<void>;
}
