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

  /**
   * Obtiene todos los parqueaderos registrados.
   * @returns Array de objetos Parking
   */
  async findAll(): Promise<Parking[]> {
    return this.parkingRepository.find();
  }

  /**
   * Busca un parqueadero por el ID.
   * @param id Identificador del parqueadero
   * @returns Objeto Parking encontrado
   * @throws NotFoundException si no existe
   */
  async findOne(id: number): Promise<Parking> {
    const parking = await this.parkingRepository.findOne({ where: { id } });
    if (!parking) {
      throw new NotFoundException(`Parking with id ${id} not found`);
    }
    return parking;
  }

  /**
   * Crea un nuevo parqueadero.
   * @param parkingData Datos del parqueadero
   * @returns Objeto Parking creado
   */
  async create(parkingData: Partial<Parking>): Promise<Parking> {
    const parking = this.parkingRepository.create(parkingData);
    return this.parkingRepository.save(parking);
  }

  /**
   * Actualiza los campos de un parqueadero existente.
   * @param id Identificador del parqueadero
   * @param parkingData Datos a actualizar
   * @returns Objeto Parking actualizado
   */
  async update(id: number, parkingData: Partial<Parking>): Promise<Parking> {
    await this.parkingRepository.update(id, parkingData);
    return this.findOne(id);
  }

  /**
   * Elimina un parqueadero por su ID.
   * @param id Identificador del parqueadero
   */
  async remove(id: number): Promise<void> {
    await this.parkingRepository.delete(id);
  }
}