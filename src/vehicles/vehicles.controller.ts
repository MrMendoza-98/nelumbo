import { Controller, Post, Body, Get, Param, BadRequestException, HttpCode, ValidationPipe, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { RolesGuard } from '../common/guards/roles.guard';
import { Roles } from '../common/decorators/roles.decorator';
import { VehiclesService } from './vehicles.service';
import { VehicleRegistrationDto, VehicleExitDto, VehicleRegistrationWithEmailDto } from './dto/vehicle-registration.dto';

@Controller('vehicles')
export class VehiclesController {
  constructor(private readonly vehiclesService: VehiclesService) {}

  @Post('register-entry')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('SOCIO')
  async registerEntry(@Body(new ValidationPipe()) body: VehicleRegistrationDto) {
  const result = await this.vehiclesService.registerEntry(
      body.plate, 
      body.parkingId, 
      body.email, 
      body.ownerName
    );
    return result;
  }

  @Post('register-exit')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('SOCIO')
  @HttpCode(200)
  async registerExit(@Body(new ValidationPipe()) body: VehicleExitDto) {
  const result = await this.vehiclesService.registerExit(body.plate, body.parkingId);
    return result;
  }

  @Get('parked/:parkingId')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('SOCIO', 'ADMIN')
  async listParkedVehicles(@Param('parkingId') parkingId: number) {
    return this.vehiclesService.listVehiculosParqueados(parkingId);
  }

  @Get('info/:plate')
  async getVehicleInfo(@Param('plate') plate: string) {
    return this.vehiclesService.getVehicleInfo(plate);
  }

  @Get('validate/:plate/:parkingId')
  async validateVehicleInParking(
    @Param('plate') plate: string,
    @Param('parkingId') parkingId: number,
  ) {
    const isValid = await this.vehiclesService.isVehicleInParking(plate, parkingId);
    return {
      plate,
      parkingId,
      isInParking: isValid,
      message: isValid 
        ? `El vehículo ${plate} está en el parqueadero ${parkingId}`
        : `El vehículo ${plate} no está en el parqueadero ${parkingId}`,
      timestamp: new Date().toISOString()
    };
  }

  @Get('info/:plate/:parkingId')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('SOCIO', 'ADMIN')
  async getVehicleInfoInParking(
    @Param('plate') plate: string,
    @Param('parkingId') parkingId: number,
  ) {
    return this.vehiclesService.getVehicleInfoInParking(plate, parkingId);
  }

  @Post('send-registration-email')
  async sendRegistrationEmail(
    @Body() body: {
      email: string;
      plate: string;
      message: string;
      parkingId: number;
    },
  ) {
    return this.vehiclesService.sendVehicleRegistrationEmail(
      body.email,
      body.plate,
      body.message,
      body.parkingId,
    );
  }

  /**
   * Registro de vehículo con envío automático de correo
   */
  @Post('full-registration')
  async fullRegistration(
    @Body(new ValidationPipe()) body: VehicleRegistrationWithEmailDto,
  ) {
  const result = await this.vehiclesService.registerEntry(
      body.plate, 
      body.parkingId, 
      body.email, 
      body.ownerName
    );
    return result;
  }
}
