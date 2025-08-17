import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity()
export class ParkingRecord {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  plate: string;

  @Column()
  parkingId: number;

  @Column()
  entryTime: Date;

  @Column({ nullable: true })
  exitTime: Date;

  @Column({ type: 'decimal', nullable: true })
  totalPrice: number;
}
