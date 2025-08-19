"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.VehiclesController = void 0;
const common_1 = require("@nestjs/common");
const jwt_auth_guard_1 = require("../common/guards/jwt-auth.guard");
const roles_guard_1 = require("../common/guards/roles.guard");
const roles_decorator_1 = require("../common/decorators/roles.decorator");
const vehicles_service_1 = require("./vehicles.service");
const vehicle_registration_dto_1 = require("./dto/vehicle-registration.dto");
let VehiclesController = class VehiclesController {
    vehiclesService;
    constructor(vehiclesService) {
        this.vehiclesService = vehiclesService;
    }
    async registerEntry(body) {
        const result = await this.vehiclesService.registerEntry(body.plate, body.parkingId, body.email, body.ownerName);
        return result;
    }
    async registerExit(body) {
        const result = await this.vehiclesService.registerExit(body.plate, body.parkingId);
        return result;
    }
    async listParkedVehicles(parkingId) {
        return this.vehiclesService.listVehiculosParqueados(parkingId);
    }
    async getVehicleInfo(plate) {
        return this.vehiclesService.getVehicleInfo(plate);
    }
    async validateVehicleInParking(plate, parkingId) {
        const isValid = await this.vehiclesService.isVehicleInParking(plate, parkingId);
        return {
            plate,
            parkingId,
            isInParking: isValid,
            message: isValid
                ? `El vehículo ${plate} está en el parqueadero ${parkingId}`
                : `El vehículo ${plate} no está en el parqueadero ${parkingId}`,
            timestamp: new Date().toISOString()
        };
    }
    async getVehicleInfoInParking(plate, parkingId) {
        return this.vehiclesService.getVehicleInfoInParking(plate, parkingId);
    }
    async sendRegistrationEmail(body) {
        return this.vehiclesService.sendVehicleRegistrationEmail(body.email, body.plate, body.message, body.parkingId);
    }
    async fullRegistration(body) {
        const result = await this.vehiclesService.registerEntry(body.plate, body.parkingId, body.email, body.ownerName);
        return result;
    }
};
exports.VehiclesController = VehiclesController;
__decorate([
    (0, common_1.Post)('register-entry'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, roles_guard_1.RolesGuard),
    (0, roles_decorator_1.Roles)('SOCIO'),
    __param(0, (0, common_1.Body)(new common_1.ValidationPipe())),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [vehicle_registration_dto_1.VehicleRegistrationDto]),
    __metadata("design:returntype", Promise)
], VehiclesController.prototype, "registerEntry", null);
__decorate([
    (0, common_1.Post)('register-exit'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, roles_guard_1.RolesGuard),
    (0, roles_decorator_1.Roles)('SOCIO'),
    (0, common_1.HttpCode)(200),
    __param(0, (0, common_1.Body)(new common_1.ValidationPipe())),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [vehicle_registration_dto_1.VehicleExitDto]),
    __metadata("design:returntype", Promise)
], VehiclesController.prototype, "registerExit", null);
__decorate([
    (0, common_1.Get)('parked/:parkingId'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, roles_guard_1.RolesGuard),
    (0, roles_decorator_1.Roles)('SOCIO', 'ADMIN'),
    __param(0, (0, common_1.Param)('parkingId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", Promise)
], VehiclesController.prototype, "listParkedVehicles", null);
__decorate([
    (0, common_1.Get)('info/:plate'),
    __param(0, (0, common_1.Param)('plate')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], VehiclesController.prototype, "getVehicleInfo", null);
__decorate([
    (0, common_1.Get)('validate/:plate/:parkingId'),
    __param(0, (0, common_1.Param)('plate')),
    __param(1, (0, common_1.Param)('parkingId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Number]),
    __metadata("design:returntype", Promise)
], VehiclesController.prototype, "validateVehicleInParking", null);
__decorate([
    (0, common_1.Get)('info/:plate/:parkingId'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, roles_guard_1.RolesGuard),
    (0, roles_decorator_1.Roles)('SOCIO', 'ADMIN'),
    __param(0, (0, common_1.Param)('plate')),
    __param(1, (0, common_1.Param)('parkingId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Number]),
    __metadata("design:returntype", Promise)
], VehiclesController.prototype, "getVehicleInfoInParking", null);
__decorate([
    (0, common_1.Post)('send-registration-email'),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], VehiclesController.prototype, "sendRegistrationEmail", null);
__decorate([
    (0, common_1.Post)('full-registration'),
    __param(0, (0, common_1.Body)(new common_1.ValidationPipe())),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [vehicle_registration_dto_1.VehicleRegistrationWithEmailDto]),
    __metadata("design:returntype", Promise)
], VehiclesController.prototype, "fullRegistration", null);
exports.VehiclesController = VehiclesController = __decorate([
    (0, common_1.Controller)('vehicles'),
    __metadata("design:paramtypes", [vehicles_service_1.VehiclesService])
], VehiclesController);
//# sourceMappingURL=vehicles.controller.js.map