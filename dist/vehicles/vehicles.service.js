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
var VehiclesService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.VehiclesService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const vehicle_entity_1 = require("./vehicle.entity");
const parking_record_entity_1 = require("./parking-record.entity");
const parking_entity_1 = require("../parkings/parking.entity");
const parking_history_entity_1 = require("./parking-history.entity");
const vehicle_notification_service_1 = require("./services/vehicle-notification.service");
let VehiclesService = VehiclesService_1 = class VehiclesService {
    vehicleRepository;
    parkingRecordRepository;
    parkingRepository;
    historyRepository;
    notificationService;
    logger = new common_1.Logger(VehiclesService_1.name);
    constructor(vehicleRepository, parkingRecordRepository, parkingRepository, historyRepository, notificationService) {
        this.vehicleRepository = vehicleRepository;
        this.parkingRecordRepository = parkingRecordRepository;
        this.parkingRepository = parkingRepository;
        this.historyRepository = historyRepository;
        this.notificationService = notificationService;
    }
    async registerEntry(plate, parkingId, email, ownerName) {
        this.logger.log(`Registrando ingreso del vehículo ${plate} al parqueadero ${parkingId}`);
        const plateRegex = /^[A-Za-z0-9]{6}$/;
        if (!plateRegex.test(plate) || plate.toLowerCase().includes('ñ')) {
            throw new common_1.BadRequestException('La placa debe ser alfanumérica, de 6 caracteres, sin caracteres especiales ni la letra ñ');
        }
        await this.validateVehicleNotParked(plate);
        const parking = await this.parkingRepository.findOne({ where: { id: parkingId } });
        if (!parking) {
            throw new common_1.BadRequestException(`Parqueadero ${parkingId} no encontrado`);
        }
        const count = await this.parkingRecordRepository.count({ where: { parkingId, exitTime: (0, typeorm_2.IsNull)() } });
        if (count >= parking.capacity) {
            throw new common_1.BadRequestException(`El parqueadero ha alcanzado su capacidad máxima (${parking.capacity})`);
        }
        const vehicle = await this.ensureVehicleExists(plate, email, ownerName);
        const parkingRecord = await this.createParkingRecord(plate, parkingId);
        let emailSent = false;
        let emailMessage = '';
        if (email && ownerName) {
            emailSent = await this.sendRegistrationEmail({
                email,
                plate,
                parkingId,
                ownerName
            });
            emailMessage = emailSent
                ? 'Correo de confirmación enviado exitosamente'
                : 'Error al enviar correo de confirmación';
        }
        this.logger.log(`Ingreso registrado exitosamente para vehículo ${plate}`);
        return {
            success: true,
            message: 'Ingreso registrado exitosamente',
            plate,
            parkingId,
            emailSent,
            emailMessage,
            timestamp: new Date()
        };
    }
    async isVehicleInParking(plate, parkingId) {
        this.logger.log(`Validando que el vehículo ${plate} esté en el parqueadero ${parkingId}`);
        try {
            await this.validateVehicleInParking(plate, parkingId);
            return true;
        }
        catch (error) {
            return false;
        }
    }
    async registerExit(plate, parkingId) {
        this.logger.log(`Registrando salida del vehículo ${plate} del parqueadero ${parkingId}`);
        const parkingRecord = await this.findActiveParkingRecord(plate, parkingId);
        parkingRecord.exitTime = new Date();
        const parking = await this.parkingRepository.findOne({ where: { id: parkingId } });
        if (!parking) {
            throw new common_1.BadRequestException(`Parqueadero ${parkingId} no encontrado`);
        }
        const entry = parkingRecord.entryTime.getTime();
        const exit = parkingRecord.exitTime.getTime();
        const hours = Math.ceil((exit - entry) / (1000 * 60 * 60));
        parkingRecord.totalPrice = Number(parking.price_per_hour) * hours;
        await this.parkingRecordRepository.save(parkingRecord);
        const vehicleEntity = await this.vehicleRepository.findOne({ where: { plate } });
        if (!vehicleEntity) {
            throw new common_1.BadRequestException(`Vehículo con placa ${plate} no encontrado para historial`);
        }
        const history = new parking_history_entity_1.ParkingHistory();
        history.vehicle = vehicleEntity;
        history.parking = parking;
        history.entry_time = parkingRecord.entryTime;
        history.exit_time = parkingRecord.exitTime;
        history.total_price = parkingRecord.totalPrice;
        await this.historyRepository.save(history);
        this.logger.log(`Salida registrada exitosamente para vehículo ${plate}`);
        return {
            success: true,
            message: 'Salida registrada exitosamente',
            plate,
            parkingId,
            exitTime: parkingRecord.exitTime,
            totalPrice: parkingRecord.totalPrice
        };
    }
    async listVehiculosParqueados(parkingId) {
        this.logger.log(`Listando vehículos parqueados en parqueadero ${parkingId}`);
        const records = await this.parkingRecordRepository.find({
            where: { parkingId, exitTime: (0, typeorm_2.IsNull)() },
            order: { entryTime: 'DESC' }
        });
        return records.map(record => ({
            plate: record.plate,
            entryTime: record.entryTime,
            parkingId: record.parkingId
        }));
    }
    async getVehicleInfo(plate) {
        this.logger.log(`Obteniendo información del vehículo ${plate}`);
        const vehicle = await this.vehicleRepository.findOne({ where: { plate } });
        if (!vehicle) {
            throw new common_1.BadRequestException(`Vehículo con placa ${plate} no encontrado`);
        }
        const activeRecord = await this.parkingRecordRepository.findOne({
            where: { plate, exitTime: (0, typeorm_2.IsNull)() }
        });
        return {
            id: vehicle.id,
            plate: vehicle.plate,
            ownerName: vehicle.ownerName,
            email: vehicle.email,
            createdAt: vehicle.createdAt,
            updatedAt: vehicle.updatedAt,
            isCurrentlyParked: !!activeRecord,
            currentParkingId: activeRecord?.parkingId || null,
            currentEntryTime: activeRecord?.entryTime || null
        };
    }
    async getVehicleInfoInParking(plate, parkingId) {
        this.logger.log(`Obteniendo información del vehículo ${plate} en parqueadero ${parkingId}`);
        const vehicle = await this.vehicleRepository.findOne({ where: { plate } });
        if (!vehicle) {
            throw new common_1.BadRequestException(`Vehículo con placa ${plate} no encontrado`);
        }
        const parkingRecord = await this.parkingRecordRepository.findOne({
            where: { plate, parkingId, exitTime: (0, typeorm_2.IsNull)() }
        });
        if (!parkingRecord) {
            throw new common_1.BadRequestException(`El vehículo con placa ${plate} no se encuentra en el parqueadero ${parkingId}`);
        }
        return {
            id: vehicle.id,
            plate: vehicle.plate,
            ownerName: vehicle.ownerName,
            email: vehicle.email,
            createdAt: vehicle.createdAt,
            updatedAt: vehicle.updatedAt,
            parkingInfo: {
                parkingId: parkingRecord.parkingId,
                entryTime: parkingRecord.entryTime,
                isCurrentlyParked: true
            }
        };
    }
    async sendVehicleRegistrationEmail(email, placa, mensaje, parqueaderoId) {
        this.logger.log(`Enviando correo de registro para vehículo ${placa}`);
        try {
            const emailSent = await this.notificationService.sendRegistrationNotification({
                email,
                plate: placa,
                parkingId: parqueaderoId
            });
            if (emailSent) {
                return { mensaje: 'Correo Enviado' };
            }
            else {
                throw new Error('No se pudo enviar el correo');
            }
        }
        catch (error) {
            this.logger.error(`Error al enviar correo: ${error.message}`);
            throw new common_1.BadRequestException('Error al enviar el correo de registro');
        }
    }
    async validateVehicleNotParked(plate) {
        const activeRecord = await this.parkingRecordRepository.findOne({
            where: { plate, exitTime: (0, typeorm_2.IsNull)() }
        });
        if (activeRecord) {
            throw new common_1.BadRequestException(`El vehículo con placa ${plate} ya está parqueado en el parqueadero ${activeRecord.parkingId}`);
        }
    }
    async validateVehicleInParking(plate, parkingId) {
        const activeRecord = await this.parkingRecordRepository.findOne({
            where: { plate, parkingId, exitTime: (0, typeorm_2.IsNull)() }
        });
        if (!activeRecord) {
            throw new common_1.BadRequestException(`El vehículo con placa ${plate} no se encuentra en el parqueadero ${parkingId}`);
        }
    }
    async ensureVehicleExists(plate, email, ownerName) {
        let vehicle = await this.vehicleRepository.findOne({ where: { plate } });
        if (!vehicle) {
            vehicle = this.vehicleRepository.create({
                plate,
                email,
                ownerName
            });
            await this.vehicleRepository.save(vehicle);
            this.logger.log(`Nuevo vehículo creado con placa ${plate} y propietario ${ownerName || 'No especificado'}`);
        }
        else if (email && ownerName) {
            if (!vehicle.email || !vehicle.ownerName) {
                vehicle.email = email;
                vehicle.ownerName = ownerName;
                await this.vehicleRepository.save(vehicle);
                this.logger.log(`Información del propietario actualizada para vehículo ${plate}`);
            }
        }
        return vehicle;
    }
    async createParkingRecord(plate, parkingId) {
        const record = this.parkingRecordRepository.create({
            plate,
            parkingId,
            entryTime: new Date(),
            exitTime: undefined
        });
        return await this.parkingRecordRepository.save(record);
    }
    async findActiveParkingRecord(plate, parkingId) {
        const record = await this.parkingRecordRepository.findOne({
            where: { plate, parkingId, exitTime: (0, typeorm_2.IsNull)() }
        });
        if (!record) {
            throw new common_1.BadRequestException(`El vehículo con placa ${plate} no está actualmente parqueado en ese parqueadero`);
        }
        return record;
    }
    async sendRegistrationEmail(data) {
        try {
            return await this.notificationService.sendRegistrationNotification(data);
        }
        catch (error) {
            this.logger.error(`Error al enviar correo automático: ${error.message}`);
            return false;
        }
    }
};
exports.VehiclesService = VehiclesService;
exports.VehiclesService = VehiclesService = VehiclesService_1 = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(vehicle_entity_1.Vehicle)),
    __param(1, (0, typeorm_1.InjectRepository)(parking_record_entity_1.ParkingRecord)),
    __param(2, (0, typeorm_1.InjectRepository)(parking_entity_1.Parking)),
    __param(3, (0, typeorm_1.InjectRepository)(parking_history_entity_1.ParkingHistory)),
    __metadata("design:paramtypes", [typeorm_2.Repository,
        typeorm_2.Repository,
        typeorm_2.Repository,
        typeorm_2.Repository,
        vehicle_notification_service_1.VehicleNotificationService])
], VehiclesService);
//# sourceMappingURL=vehicles.service.js.map