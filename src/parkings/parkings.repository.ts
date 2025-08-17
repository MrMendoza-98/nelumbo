import { EntityRepository, Repository } from 'typeorm';
import { Parking } from './parking.entity';

@EntityRepository(Parking)
export class ParkingsRepository extends Repository<Parking> {}
