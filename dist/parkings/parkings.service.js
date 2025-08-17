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
exports.ParkingsService = void 0;
const common_1 = require("@nestjs/common");
const parking_entity_1 = require("./parking.entity");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
let ParkingsService = class ParkingsService {
    parkingRepository;
    constructor(parkingRepository) {
        this.parkingRepository = parkingRepository;
    }
    async findAll() {
        return this.parkingRepository.find();
    }
    async findOne(id) {
        const parking = await this.parkingRepository.findOne({ where: { id } });
        if (!parking) {
            throw new common_1.NotFoundException(`Parking with id ${id} not found`);
        }
        return parking;
    }
    async create(parkingData) {
        const parking = this.parkingRepository.create(parkingData);
        return this.parkingRepository.save(parking);
    }
    async update(id, parkingData) {
        await this.parkingRepository.update(id, parkingData);
        return this.findOne(id);
    }
    async remove(id) {
        await this.parkingRepository.delete(id);
    }
};
exports.ParkingsService = ParkingsService;
exports.ParkingsService = ParkingsService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(parking_entity_1.Parking)),
    __metadata("design:paramtypes", [typeorm_2.Repository])
], ParkingsService);
//# sourceMappingURL=parkings.service.js.map