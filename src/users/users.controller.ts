import { Controller, Post, Body, Get, UseGuards } from '@nestjs/common';
import { UsersService } from './users.service';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { RolesGuard } from '../common/guards/roles.guard';
import { Roles } from '../common/decorators/roles.decorator';
import { User } from './user.entity';
import * as bcrypt from 'bcryptjs';

@Controller('users')
@UseGuards(JwtAuthGuard, RolesGuard)
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Post('register')
  @Roles('ADMIN')
  async register(@Body() body: { email: string; password: string; role: 'SOCIO' | 'ADMIN' }): Promise<User> {
    const hash = await bcrypt.hash(body.password, 10);
    const user = this.usersService.createUser({ ...body, password: hash });
    return user;
  }

  @Get('all')
  @Roles('ADMIN')
  async findAll(): Promise<User[]> {
    return this.usersService.findAll();
  }
}
