"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UsersRepository = void 0;
const typeorm_1 = require("typeorm");
const user_entity_1 = require("./user.entity");
class UsersRepository extends typeorm_1.Repository {
    constructor(dataSource) {
        super(user_entity_1.User, dataSource.createEntityManager());
    }
}
exports.UsersRepository = UsersRepository;
//# sourceMappingURL=users.repository.js.map