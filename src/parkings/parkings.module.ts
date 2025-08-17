import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ParkingsController } from './parkings.controller';
import { ParkingsService } from './parkings.service';
import { ParkingsRepository } from './parkings.repository';
import { Parking } from './parking.entity';
import { UsersModule } from '../users/users.module';

@Module({
    controllers: [ParkingsController],
    providers: [ParkingsService],
    imports: [TypeOrmModule.forFeature([Parking]), UsersModule],
    exports: [ParkingsService],
})
export class ParkingsModule {}
