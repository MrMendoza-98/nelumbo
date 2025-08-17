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

  async onModuleInit() {
    await this.createAdminIfNotExists();
  }

  async findByEmail(email: string): Promise<User | undefined> {
    const user = await this.userRepository.findOne({ where: { email } });
    return user ?? undefined;
  }

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

  async createUser(data: Partial<User>): Promise<User> {
    const user = this.userRepository.create(data);
    return this.userRepository.save(user);
  }

  async findAll(): Promise<User[]> {
    return this.userRepository.find();
  }

  // Métodos CRUD y lógica de negocio aquí
}
