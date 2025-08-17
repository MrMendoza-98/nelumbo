import { Controller, Get, Post, Body, Param, Put, Delete, UseGuards } from '@nestjs/common';
import { ParkingsService } from './parkings.service';
import { Parking } from './parking.entity';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { RolesGuard } from '../common/guards/roles.guard';
import { Roles } from '../common/decorators/roles.decorator';

@Controller('parkings')
@UseGuards(JwtAuthGuard, RolesGuard)
export class ParkingsController {
  constructor(private readonly parkingsService: ParkingsService) {}

  @Get()
  @Roles('ADMIN')
  findAll(): Promise<Parking[]> {
    return this.parkingsService.findAll();
  }

  @Get(':id')
  @Roles('ADMIN')
  findOne(@Param('id') id: number): Promise<Parking> {
    return this.parkingsService.findOne(id);
  }

  @Post()
  @Roles('ADMIN')
  create(@Body() parkingData: { name: string; capacity: number; price_per_hour: number; ownerId: number }): Promise<Parking> {
    return this.parkingsService.create(parkingData);
  }

  @Put(':id')
  @Roles('ADMIN')
  update(
    @Param('id') id: number,
    @Body() parkingData: { name?: string; capacity?: number; price_per_hour?: number; ownerId?: number }
  ): Promise<Parking> {
    return this.parkingsService.update(id, parkingData);
  }

  @Delete(':id')
  @Roles('ADMIN')
  remove(@Param('id') id: number): Promise<void> {
    return this.parkingsService.remove(id);
  }
}
