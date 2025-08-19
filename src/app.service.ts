import { Injectable } from '@nestjs/common';

@Injectable()
export class AppService {
  getHello(): string {
    return 'Hola Bienvenido a la API REST Control de Vehículos en Parqueaderos!';
  }
}
