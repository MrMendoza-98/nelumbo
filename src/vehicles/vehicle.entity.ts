import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn } from 'typeorm';

@Entity('vehicles')
export class Vehicle {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ length: 10, unique: true })
  plate: string;

  @Column({ nullable: true, length: 100 })
  ownerName?: string;

  @Column({ nullable: true, length: 100 })
  email?: string;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
