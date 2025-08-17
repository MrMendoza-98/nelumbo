import { IsEmail, IsString, IsNotEmpty, IsOptional, MinLength, MaxLength } from 'class-validator';

export class SendMailDto {
  @IsEmail({}, { message: 'El campo "to" debe ser un email válido' })
  @IsNotEmpty({ message: 'El campo "to" es requerido' })
  to: string;

  @IsString({ message: 'El campo "subject" debe ser una cadena de texto' })
  @IsNotEmpty({ message: 'El campo "subject" es requerido' })
  @MinLength(1, { message: 'El campo "subject" debe tener al menos 1 carácter' })
  @MaxLength(200, { message: 'El campo "subject" no puede exceder 200 caracteres' })
  subject: string;

  @IsString({ message: 'El campo "body" debe ser una cadena de texto' })
  @IsNotEmpty({ message: 'El campo "body" es requerido' })
  @MinLength(1, { message: 'El campo "body" debe tener al menos 1 carácter' })
  @MaxLength(5000, { message: 'El campo "body" no puede exceder 5000 caracteres' })
  body: string;

  @IsOptional()
  @IsString({ message: 'El campo "cc" debe ser una cadena de texto' })
  cc?: string;

  @IsOptional()
  @IsString({ message: 'El campo "bcc" debe ser una cadena de texto' })
  bcc?: string;
}
