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
const vehicles_service_1 = require("./vehicles.service");
let VehiclesController = class VehiclesController {
    vehiclesService;
    constructor(vehiclesService) {
        this.vehiclesService = vehiclesService;
    }
    async registreIngreso(body) {
        const result = await this.vehiclesService.registreIngreso(body.plate, body.parkingId);
        if (result === 'already_parked') {
            throw new common_1.BadRequestException({ message: 'El vehículo ya está parqueado en algún parqueadero.' });
        }
        return { message: 'Ingreso registrado exitosamente', plate: body.plate, parkingId: body.parkingId };
    }
    async registrarSalida(body) {
        const result = await this.vehiclesService.registrarSalida(body.plate, body.parkingId);
        if (result === 'not_parked') {
            throw new common_1.BadRequestException({ message: 'El vehículo no está actualmente parqueado en ese parqueadero.' });
        }
        return { message: 'Salida registrada exitosamente', plate: body.plate, parkingId: body.parkingId };
    }
    async listVehiculosParqueados(parkingId) {
        return this.vehiclesService.listVehiculosParqueados(parkingId);
    }
};
exports.VehiclesController = VehiclesController;
__decorate([
    (0, common_1.Post)('registre-ingreso'),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], VehiclesController.prototype, "registreIngreso", null);
__decorate([
    (0, common_1.Post)('registrar-salida'),
    (0, common_1.HttpCode)(200),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], VehiclesController.prototype, "registrarSalida", null);
__decorate([
    (0, common_1.Get)('parqueados/:parkingId'),
    __param(0, (0, common_1.Param)('parkingId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", Promise)
], VehiclesController.prototype, "listVehiculosParqueados", null);
exports.VehiclesController = VehiclesController = __decorate([
    (0, common_1.Controller)('vehicles'),
    __metadata("design:paramtypes", [vehicles_service_1.VehiclesService])
], VehiclesController);
//# sourceMappingURL=vehicles.controller.js.map