import { Entity, PrimaryGeneratedColumn, Column, ManyToOne } from 'typeorm';
import { Vehicle } from './vehicle.entity';
import { Parking } from '../parkings/parking.entity';

@Entity()
export class ParkingHistory {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => Vehicle)
  vehicle: Vehicle;

  @ManyToOne(() => Parking)
  parking: Parking;

  @Column()
  entry_time: Date;

  @Column()
  exit_time: Date;

  @Column({ type: 'decimal' })
  total_price: number;
}
