import { Controller, Post, Body, Get, Param, BadRequestException, HttpCode, ValidationPipe } from '@nestjs/common';
import { VehiclesService } from './vehicles.service';
import { VehicleRegistrationDto, VehicleExitDto, VehicleRegistrationWithEmailDto } from './dto/vehicle-registration.dto';

@Controller('vehicles')
export class VehiclesController {
  constructor(private readonly vehiclesService: VehiclesService) {}

  @Post('registre-ingreso')
  async registreIngreso(@Body(new ValidationPipe()) body: VehicleRegistrationDto) {
    const result = await this.vehiclesService.registreIngreso(
      body.plate, 
      body.parkingId, 
      body.email, 
      body.ownerName
    );
    
    return result;
  }

  @Post('registrar-salida')
  @HttpCode(200)
  async registrarSalida(@Body(new ValidationPipe()) body: VehicleExitDto) {
    const result = await this.vehiclesService.registrarSalida(body.plate, body.parkingId);
    return result;
  }

  @Get('parqueados/:parkingId')
  async listVehiculosParqueados(@Param('parkingId') parkingId: number) {
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
  async getVehicleInfoInParking(
    @Param('plate') plate: string,
    @Param('parkingId') parkingId: number,
  ) {
    return this.vehiclesService.getVehicleInfoInParking(plate, parkingId);
  }

  @Post('enviar-correo-registro')
  async enviarCorreoRegistro(
    @Body() body: {
      email: string;
      placa: string;
      mensaje: string;
      parqueaderoId: number;
    },
  ) {
    return this.vehiclesService.sendVehicleRegistrationEmail(
      body.email,
      body.placa,
      body.mensaje,
      body.parqueaderoId,
    );
  }

  /**
   * Registro de vehículo con envío automático de correo
   */
  @Post('registro-completo')
  async registroCompleto(
    @Body(new ValidationPipe()) body: VehicleRegistrationWithEmailDto,
  ) {
    const result = await this.vehiclesService.registreIngreso(
      body.plate, 
      body.parkingId, 
      body.email, 
      body.ownerName
    );
    
    return result;
  }
}
