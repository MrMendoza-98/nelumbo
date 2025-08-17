import { UsersService } from './users.service';
import { User } from './user.entity';
export declare class UsersController {
    private readonly usersService;
    constructor(usersService: UsersService);
    register(body: {
        email: string;
        password: string;
        role: 'SOCIO' | 'ADMIN';
    }): Promise<User>;
    findAll(): Promise<User[]>;
}
