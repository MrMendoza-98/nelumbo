import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { IndicatorsController } from './indicators.controller';
import { IndicatorsService } from './indicators.service';
import { Vehicle } from '../vehicles/vehicle.entity';
import { ParkingRecord } from '../vehicles/parking-record.entity';
import { Parking } from '../parkings/parking.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([Vehicle, ParkingRecord, Parking])
  ],
  controllers: [IndicatorsController],
  providers: [IndicatorsService],
  exports: [IndicatorsService],
})
export class IndicatorsModule {}



