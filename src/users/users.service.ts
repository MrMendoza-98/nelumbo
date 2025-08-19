import { Injectable, OnModuleInit } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './user.entity';
import * as bcrypt from 'bcryptjs';

@Injectable()
export class UsersService implements OnModuleInit {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {}

  /**
   * Inicializa el módulo y crea el usuario administrador si no existe.
   */
  async onModuleInit() {
    await this.createAdminIfNotExists();
  }

  /**
   * Busca un usuario por su correo electrónico.
   * @param email Correo electrónico del usuario
   * @returns El usuario encontrado o undefined
   */
  async findByEmail(email: string): Promise<User | undefined> {
    const user = await this.userRepository.findOne({ where: { email } });
    return user ?? undefined;
  }

  /**
   * Crea el usuario administrador por defecto si no existe.
   */
  async createAdminIfNotExists(): Promise<void> {
    const adminEmail = 'admin@mail.com';
    const adminPass = 'admin';
    const exists = await this.findByEmail(adminEmail);
    if (!exists) {
      const hash = await bcrypt.hash(adminPass, 10);
      const admin = this.userRepository.create({ email: adminEmail, password: hash, role: 'ADMIN' });
      await this.userRepository.save(admin);
    }
  }

  /**
   * Crea un nuevo usuario.
   * @param data Datos del usuario
   * @returns El usuario creado
   */
  async createUser(data: Partial<User>): Promise<User> {
    const user = this.userRepository.create(data);
    return this.userRepository.save(user);
  }

  /**
   * Obtiene todos los usuarios registrados.
   * @returns Array de usuarios
   */
  async findAll(): Promise<User[]> {
    return this.userRepository.find();
  }


}
