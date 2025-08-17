import { Parking } from './parking.entity';
import { Repository } from 'typeorm';
export declare class ParkingsService {
    private readonly parkingRepository;
    constructor(parkingRepository: Repository<Parking>);
    findAll(): Promise<Parking[]>;
    findOne(id: number): Promise<Parking>;
    create(parkingData: Partial<Parking>): Promise<Parking>;
    update(id: number, parkingData: Partial<Parking>): Promise<Parking>;
    remove(id: number): Promise<void>;
}
