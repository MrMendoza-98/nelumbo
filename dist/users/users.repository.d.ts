import { Repository, DataSource } from 'typeorm';
import { User } from './user.entity';
export declare class UsersRepository extends Repository<User> {
    constructor(dataSource: DataSource);
}
