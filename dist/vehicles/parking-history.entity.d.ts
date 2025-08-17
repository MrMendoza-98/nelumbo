import { Vehicle } from './vehicle.entity';
import { Parking } from '../parkings/parking.entity';
export declare class ParkingHistory {
    id: number;
    vehicle: Vehicle;
    parking: Parking;
    entry_time: Date;
    exit_time: Date;
    total_price: number;
}
