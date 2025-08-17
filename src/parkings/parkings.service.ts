import { Injectable, NotFoundException } from '@nestjs/common';
import { Parking } from './parking.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

@Injectable()
export class ParkingsService {
  constructor(
    @InjectRepository(Parking)
    private readonly parkingRepository: Repository<Parking>,
  ) {}

  async findAll(): Promise<Parking[]> {
    return this.parkingRepository.find();
  }

  async findOne(id: number): Promise<Parking> {
    const parking = await this.parkingRepository.findOne({ where: { id } });
    if (!parking) {
      throw new NotFoundException(`Parking with id ${id} not found`);
    }
    return parking;
  }

  async create(parkingData: Partial<Parking>): Promise<Parking> {
    const parking = this.parkingRepository.create(parkingData);
    return this.parkingRepository.save(parking);
  }

  async update(id: number, parkingData: Partial<Parking>): Promise<Parking> {
    await this.parkingRepository.update(id, parkingData);
    return this.findOne(id);
  }

  async remove(id: number): Promise<void> {
    await this.parkingRepository.delete(id);
  }
}