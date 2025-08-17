import { Controller, Post, Body, Get, Param, BadRequestException, HttpCode } from '@nestjs/common';
import { VehiclesService } from './vehicles.service';

@Controller('vehicles')
export class VehiclesController {
  constructor(private readonly vehiclesService: VehiclesService) {}

  @Post('registre-ingreso')
  async registreIngreso(@Body() body: { plate: string; parkingId: number }) {
    const result = await this.vehiclesService.registreIngreso(body.plate, body.parkingId);
    if (result === 'already_parked') {
      throw new BadRequestException({ message: 'El vehículo ya está parqueado en algún parqueadero.' });
    }
    return { message: 'Ingreso registrado exitosamente', plate: body.plate, parkingId: body.parkingId };
  }

  @Post('registrar-salida')
  @HttpCode(200)
  async registrarSalida(@Body() body: { plate: string; parkingId: number }) {
    const result = await this.vehiclesService.registrarSalida(body.plate, body.parkingId);
    if (result === 'not_parked') {
      throw new BadRequestException({ message: 'El vehículo no está actualmente parqueado en ese parqueadero.' });
    }
    return { message: 'Salida registrada exitosamente', plate: body.plate, parkingId: body.parkingId };
  }

  @Get('parqueados/:parkingId')
  async listVehiculosParqueados(@Param('parkingId') parkingId: number) {
    return this.vehiclesService.listVehiculosParqueados(parkingId);
  }
}
