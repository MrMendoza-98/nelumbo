import { EntityRepository, Repository } from 'typeorm';
import { Vehicle } from './vehicle.entity';

@EntityRepository(Vehicle)
export class VehiclesRepository extends Repository<Vehicle> {}
