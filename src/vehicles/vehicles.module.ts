import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { VehiclesController } from './vehicles.controller';
import { VehiclesService } from './vehicles.service';
import { VehicleNotificationService } from './services/vehicle-notification.service';
import { Vehicle } from './vehicle.entity';
import { ParkingRecord } from './parking-record.entity';
import { MailModule } from '../mail/mail.module';
import { ParkingsModule } from '../parkings/parkings.module';

@Module({
  imports: [TypeOrmModule.forFeature([Vehicle, ParkingRecord]), MailModule, ParkingsModule],
  controllers: [VehiclesController],
  providers: [VehiclesService, VehicleNotificationService],
  exports: [VehiclesService],
})
export class VehiclesModule {}
