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
Object.defineProperty(exports, "__esModule", { value: true });
exports.ParkingHistory = void 0;
const typeorm_1 = require("typeorm");
const vehicle_entity_1 = require("./vehicle.entity");
const parking_entity_1 = require("../parkings/parking.entity");
let ParkingHistory = class ParkingHistory {
    id;
    vehicle;
    parking;
    entry_time;
    exit_time;
    total_price;
};
exports.ParkingHistory = ParkingHistory;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)(),
    __metadata("design:type", Number)
], ParkingHistory.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => vehicle_entity_1.Vehicle),
    __metadata("design:type", vehicle_entity_1.Vehicle)
], ParkingHistory.prototype, "vehicle", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => parking_entity_1.Parking),
    __metadata("design:type", parking_entity_1.Parking)
], ParkingHistory.prototype, "parking", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", Date)
], ParkingHistory.prototype, "entry_time", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", Date)
], ParkingHistory.prototype, "exit_time", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'decimal' }),
    __metadata("design:type", Number)
], ParkingHistory.prototype, "total_price", void 0);
exports.ParkingHistory = ParkingHistory = __decorate([
    (0, typeorm_1.Entity)()
], ParkingHistory);
//# sourceMappingURL=parking-history.entity.js.map