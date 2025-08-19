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


@Controller('indicators')
@UseGuards(JwtAuthGuard, RolesGuard)
export class IndicatorsController {
  constructor(private readonly indicatorsService: IndicatorsService) {}

  @Get('top-vehicles')
  @HttpCode(HttpStatus.OK)
  @Roles('ADMIN', 'SOCIO')
  async getTop10MostFrequentVehicles(): Promise<TopVehiclesResponse> {
    return this.indicatorsService.getTop10MostFrequentVehicles();
  }

  @Get('top-vehicles/parking/:parkingId')
  @HttpCode(HttpStatus.OK)
  @Roles('ADMIN', 'SOCIO')
  async getTop10VehiclesByParking(
    @Param('parkingId') parkingId: number,
  ): Promise<TopVehiclesResponse> {
    return this.indicatorsService.getTop10VehiclesByParking(parkingId);
  }

  @Get('first-time-parked/:parkingId')
  @HttpCode(HttpStatus.OK)
  @Roles('ADMIN', 'SOCIO')
  async getFirstTimeParkedVehicles(
    @Param('parkingId') parkingId: number,
  ): Promise<{ plate: string; entryTime: Date }[]> {
    return this.indicatorsService.getFirstTimeParkedVehicles(parkingId);
  }

  @Get('earnings/:parkingId')
  @HttpCode(HttpStatus.OK)
  @Roles('SOCIO')
  async getParkingEarnings(
    @Param('parkingId') parkingId: number,
  ): Promise<{ today: number; week: number; month: number; year: number }> {
    return this.indicatorsService.getParkingEarnings(parkingId);
  }

  @Get('search-parked')
  @HttpCode(HttpStatus.OK)
  @Roles('ADMIN', 'SOCIO')
  async searchParkedVehiclesByPlate(
    @Query('plate') partialPlate: string,
  ): Promise<{ plate: string; entryTime: Date; parkingId: number }[]> {
    return this.indicatorsService.searchParkedVehiclesByPlate(partialPlate);
  }
}



