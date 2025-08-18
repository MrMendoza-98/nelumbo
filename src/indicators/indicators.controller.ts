import {
  Controller,
  Get,
  UseGuards,
  HttpStatus,
  HttpCode,
  Param,
  Query,
} from '@nestjs/common';
import { IndicatorsService } from './indicators.service';
import { TopVehiclesResponse } from './interfaces/indicators.interface';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { RolesGuard } from '../common/guards/roles.guard';
import { Roles } from '../common/decorators/roles.decorator';

const Role = {
  ADMIN: 'ADMIN' as const,
  SOCIO: 'SOCIO' as const,
} as const;

@Controller('indicators')
@UseGuards(JwtAuthGuard, RolesGuard)
export class IndicatorsController {
  constructor(private readonly indicatorsService: IndicatorsService) {}

  /**
   * Obtiene los 10 vehículos que más veces se han registrado en los diferentes parqueaderos
   * @returns Top 10 vehículos más frecuentes
   */
  @Get('top-vehicles')
  @HttpCode(HttpStatus.OK)
  @Roles(Role.ADMIN, Role.SOCIO)
  async getTop10MostFrequentVehicles(): Promise<TopVehiclesResponse> {
    return this.indicatorsService.getTop10MostFrequentVehicles();
  }

  /**
   * Obtiene los 10 vehículos más registrados en un parqueadero específico
   * @param parkingId - ID del parqueadero
   * @returns Top 10 vehículos en el parqueadero
   */
  @Get('top-vehicles/parking/:parkingId')
  @HttpCode(HttpStatus.OK)
  @Roles(Role.ADMIN, Role.SOCIO)
  async getTop10VehiclesByParking(
    @Param('parkingId') parkingId: number,
  ): Promise<TopVehiclesResponse> {
    return this.indicatorsService.getTop10VehiclesByParking(parkingId);
  }

  /**
   * Obtiene los vehículos actualmente parqueados por primera vez en un parqueadero
   * @param parkingId - ID del parqueadero
   * @returns Array de placas y fecha de ingreso
   */
  @Get('first-time-parked/:parkingId')
  @HttpCode(HttpStatus.OK)
  @Roles(Role.ADMIN, Role.SOCIO)
  async getFirstTimeParkedVehicles(
    @Param('parkingId') parkingId: number,
  ): Promise<{ plate: string; entryTime: Date }[]> {
    return this.indicatorsService.getFirstTimeParkedVehicles(parkingId);
  }

  /**
   * Obtiene las ganancias de hoy, semana, mes y año de un parqueadero específico
   * @param parkingId - ID del parqueadero
   * @returns Ganancias agrupadas por periodo
   */
  @Get('earnings/:parkingId')
  @HttpCode(HttpStatus.OK)
  @Roles(Role.SOCIO)
  async getParkingEarnings(
    @Param('parkingId') parkingId: number,
  ): Promise<{ today: number; week: number; month: number; year: number }> {
    return this.indicatorsService.getParkingEarnings(parkingId);
  }

  /**
   * Buscar vehículos parqueados por coincidencia parcial en la placa
   * @param partialPlate - fragmento de placa
   * @returns Array de vehículos parqueados que coinciden
   */
  @Get('search-parked')
  @HttpCode(HttpStatus.OK)
  @Roles(Role.ADMIN, Role.SOCIO)
  async searchParkedVehiclesByPlate(
    @Query('plate') partialPlate: string,
  ): Promise<{ plate: string; entryTime: Date; parkingId: number }[]> {
    return this.indicatorsService.searchParkedVehiclesByPlate(partialPlate);
  }
}



