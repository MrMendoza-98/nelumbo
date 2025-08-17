import { OnModuleInit } from '@nestjs/common';
import { Repository } from 'typeorm';
import { User } from './user.entity';
export declare class UsersService implements OnModuleInit {
    private readonly userRepository;
    constructor(userRepository: Repository<User>);
    onModuleInit(): Promise<void>;
    findByEmail(email: string): Promise<User | undefined>;
    createAdminIfNotExists(): Promise<void>;
    createUser(data: Partial<User>): Promise<User>;
    findAll(): Promise<User[]>;
}
