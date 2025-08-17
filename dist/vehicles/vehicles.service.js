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
exports.VehiclesService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const vehicle_entity_1 = require("./vehicle.entity");
const parking_record_entity_1 = require("./parking-record.entity");
let VehiclesService = class VehiclesService {
    vehicleRepository;
    parkingRecordRepository;
    constructor(vehicleRepository, parkingRecordRepository) {
        this.vehicleRepository = vehicleRepository;
        this.parkingRecordRepository = parkingRecordRepository;
    }
    async registreIngreso(plate, parkingId) {
        const activeRecord = await this.parkingRecordRepository.findOne({ where: { plate, exitTime: require('typeorm').IsNull() } });
        if (activeRecord)
            return 'already_parked';
        let vehicle = await this.vehicleRepository.findOne({ where: { plate } });
        if (!vehicle) {
            vehicle = this.vehicleRepository.create({ plate });
            await this.vehicleRepository.save(vehicle);
        }
        const record = this.parkingRecordRepository.create({ plate, parkingId, entryTime: new Date(), exitTime: undefined });
        await this.parkingRecordRepository.save(record);
        return 'ok';
    }
    async registrarSalida(plate, parkingId) {
        const activeRecord = await this.parkingRecordRepository.findOne({ where: { plate, parkingId, exitTime: require('typeorm').IsNull() } });
        if (!activeRecord)
            return 'not_parked';
        activeRecord.exitTime = new Date();
        await this.parkingRecordRepository.save(activeRecord);
        return 'ok';
    }
    async listVehiculosParqueados(parkingId) {
        const { IsNull } = require('typeorm');
        const records = await this.parkingRecordRepository.find({ where: { parkingId, exitTime: IsNull() } });
        return records.map(r => ({ plate: r.plate, entryTime: r.entryTime }));
    }
};
exports.VehiclesService = VehiclesService;
exports.VehiclesService = VehiclesService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(vehicle_entity_1.Vehicle)),
    __param(1, (0, typeorm_1.InjectRepository)(parking_record_entity_1.ParkingRecord)),
    __metadata("design:paramtypes", [typeorm_2.Repository,
        typeorm_2.Repository])
], VehiclesService);
//# sourceMappingURL=vehicles.service.js.map