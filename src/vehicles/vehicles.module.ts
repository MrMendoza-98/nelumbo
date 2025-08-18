import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { VehiclesController } from './vehicles.controller';
import { VehiclesService } from './vehicles.service';
import { VehicleNotificationService } from './services/vehicle-notification.service';
import { Vehicle } from './vehicle.entity';
import { ParkingRecord } from './parking-record.entity';
import { MailModule } from '../mail/mail.module';
import { ParkingsModule } from '../parkings/parkings.module';
import { Parking } from '../parkings/parking.entity';
import { ParkingHistory } from './parking-history.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Vehicle, ParkingRecord, Parking, ParkingHistory]), MailModule, ParkingsModule],
  controllers: [VehiclesController],
  providers: [VehiclesService, VehicleNotificationService],
  exports: [VehiclesService],
})
export class VehiclesModule {}
