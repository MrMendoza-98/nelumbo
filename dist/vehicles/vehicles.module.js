"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.VehiclesModule = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const vehicles_controller_1 = require("./vehicles.controller");
const vehicles_service_1 = require("./vehicles.service");
const vehicle_notification_service_1 = require("./services/vehicle-notification.service");
const vehicle_entity_1 = require("./vehicle.entity");
const parking_record_entity_1 = require("./parking-record.entity");
const mail_module_1 = require("../mail/mail.module");
const parkings_module_1 = require("../parkings/parkings.module");
const parking_entity_1 = require("../parkings/parking.entity");
const parking_history_entity_1 = require("./parking-history.entity");
let VehiclesModule = class VehiclesModule {
};
exports.VehiclesModule = VehiclesModule;
exports.VehiclesModule = VehiclesModule = __decorate([
    (0, common_1.Module)({
        imports: [typeorm_1.TypeOrmModule.forFeature([vehicle_entity_1.Vehicle, parking_record_entity_1.ParkingRecord, parking_entity_1.Parking, parking_history_entity_1.ParkingHistory]), mail_module_1.MailModule, parkings_module_1.ParkingsModule],
        controllers: [vehicles_controller_1.VehiclesController],
        providers: [vehicles_service_1.VehiclesService, vehicle_notification_service_1.VehicleNotificationService],
        exports: [vehicles_service_1.VehiclesService],
    })
], VehiclesModule);
//# sourceMappingURL=vehicles.module.js.map