import { User } from '../users/user.entity';
export declare class Parking {
    id: number;
    name: string;
    capacity: number;
    price_per_hour: number;
    owner: User;
}
