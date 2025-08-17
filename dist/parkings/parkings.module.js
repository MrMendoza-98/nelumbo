"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ParkingsModule = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const parkings_controller_1 = require("./parkings.controller");
const parkings_service_1 = require("./parkings.service");
const parking_entity_1 = require("./parking.entity");
const users_module_1 = require("../users/users.module");
let ParkingsModule = class ParkingsModule {
};
exports.ParkingsModule = ParkingsModule;
exports.ParkingsModule = ParkingsModule = __decorate([
    (0, common_1.Module)({
        controllers: [parkings_controller_1.ParkingsController],
        providers: [parkings_service_1.ParkingsService],
        imports: [typeorm_1.TypeOrmModule.forFeature([parking_entity_1.Parking]), users_module_1.UsersModule],
        exports: [parkings_service_1.ParkingsService],
    })
], ParkingsModule);
//# sourceMappingURL=parkings.module.js.map