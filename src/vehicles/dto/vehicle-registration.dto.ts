import { IsString, IsNumber, IsEmail, IsOptional, MinLength, MaxLength, IsNotEmpty } from 'class-validator';

export class VehicleRegistrationDto {
  @IsString({ message: 'La placa debe ser una cadena de texto' })
  @IsNotEmpty({ message: 'La placa es requerida' })
  @MinLength(3, { message: 'La placa debe tener al menos 3 caracteres' })
  @MaxLength(10, { message: 'La placa no puede exceder 10 caracteres' })
  plate: string;

  @IsNumber({}, { message: 'El ID del parqueadero debe ser un número' })
  parkingId: number;

  @IsOptional()
  @IsEmail({}, { message: 'El email debe tener un formato válido' })
  email?: string;

  @IsOptional()
  @IsString({ message: 'El nombre del propietario debe ser una cadena de texto' })
  @MaxLength(100, { message: 'El nombre del propietario no puede exceder 100 caracteres' })
  ownerName?: string;
}

export class VehicleRegistrationWithEmailDto {
  @IsString({ message: 'La placa debe ser una cadena de texto' })
  @IsNotEmpty({ message: 'La placa es requerida' })
  @MinLength(3, { message: 'La placa debe tener al menos 3 caracteres' })
  @MaxLength(10, { message: 'La placa no puede exceder 10 caracteres' })
  plate: string;

  @IsNumber({}, { message: 'El ID del parqueadero debe ser un número' })
  parkingId: number;

  @IsEmail({}, { message: 'El email debe tener un formato válido' })
  @IsNotEmpty({ message: 'El email es requerido para el envío automático de correo' })
  email: string;

  @IsString({ message: 'El nombre del propietario debe ser una cadena de texto' })
  @IsNotEmpty({ message: 'El nombre del propietario es requerido' })
  @MaxLength(100, { message: 'El nombre del propietario no puede exceder 100 caracteres' })
  ownerName: string;
}

export class VehicleExitDto {
  @IsString({ message: 'La placa debe ser una cadena de texto' })
  @IsNotEmpty({ message: 'La placa es requerida' })
  plate: string;

  @IsNumber({}, { message: 'El ID del parqueadero debe ser un número' })
  parkingId: number;
}
