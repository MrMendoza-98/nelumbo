import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UsersService } from '../users/users.service';
import * as bcrypt from 'bcryptjs';

@Injectable()
export class AuthService {
  constructor(
    private readonly usersService: UsersService,
    private readonly jwtService: JwtService,
  ) {}

  /**
   * Valida las credenciales de un usuario.
   * @param email Correo electrónico del usuario
   * @param password Contraseña en texto plano
   * @returns El usuario si las credenciales son correctas, null si no.
   */
  async validateUser(email: string, password: string): Promise<any> {
    const user = await this.usersService.findByEmail(email);
    if (user && await bcrypt.compare(password, user.password)) {
      return user;
    }
    return null;
  }

  /**
   * Genera el token JWT para el usuario autenticado.
   * @param user Objeto usuario validado
   * @returns Objeto con el access_token y tiempo de expiración
   */
  async login(user: any) {
    const payload = { email: user.email, sub: user.id, role: user.role };
    return {
      access_token: this.jwtService.sign(payload),
      expires_in: 21600, // 6 horas en segundos
    };
  }
}
