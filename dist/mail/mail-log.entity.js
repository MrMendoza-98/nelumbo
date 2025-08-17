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
exports.MailLog = exports.MailType = exports.MailStatus = void 0;
const typeorm_1 = require("typeorm");
var MailStatus;
(function (MailStatus) {
    MailStatus["PENDING"] = "pending";
    MailStatus["SENT"] = "sent";
    MailStatus["FAILED"] = "failed";
    MailStatus["DELIVERED"] = "delivered";
})(MailStatus || (exports.MailStatus = MailStatus = {}));
var MailType;
(function (MailType) {
    MailType["GENERAL"] = "general";
    MailType["PARKING_NOTIFICATION"] = "parking_notification";
    MailType["REMINDER"] = "reminder";
    MailType["SYSTEM"] = "system";
})(MailType || (exports.MailType = MailType = {}));
let MailLog = class MailLog {
    id;
    to;
    cc;
    bcc;
    subject;
    body;
    status;
    type;
    error_message;
    retry_count;
    sent_at;
    created_at;
    updated_at;
};
exports.MailLog = MailLog;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)(),
    __metadata("design:type", Number)
], MailLog.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", String)
], MailLog.prototype, "to", void 0);
__decorate([
    (0, typeorm_1.Column)({ nullable: true }),
    __metadata("design:type", String)
], MailLog.prototype, "cc", void 0);
__decorate([
    (0, typeorm_1.Column)({ nullable: true }),
    __metadata("design:type", String)
], MailLog.prototype, "bcc", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", String)
], MailLog.prototype, "subject", void 0);
__decorate([
    (0, typeorm_1.Column)('text'),
    __metadata("design:type", String)
], MailLog.prototype, "body", void 0);
__decorate([
    (0, typeorm_1.Column)({
        type: 'enum',
        enum: MailStatus,
        default: MailStatus.PENDING,
    }),
    __metadata("design:type", String)
], MailLog.prototype, "status", void 0);
__decorate([
    (0, typeorm_1.Column)({
        type: 'enum',
        enum: MailType,
        default: MailType.GENERAL,
    }),
    __metadata("design:type", String)
], MailLog.prototype, "type", void 0);
__decorate([
    (0, typeorm_1.Column)({ nullable: true }),
    __metadata("design:type", String)
], MailLog.prototype, "error_message", void 0);
__decorate([
    (0, typeorm_1.Column)({ nullable: true }),
    __metadata("design:type", Number)
], MailLog.prototype, "retry_count", void 0);
__decorate([
    (0, typeorm_1.Column)({ nullable: true }),
    __metadata("design:type", Date)
], MailLog.prototype, "sent_at", void 0);
__decorate([
    (0, typeorm_1.CreateDateColumn)(),
    __metadata("design:type", Date)
], MailLog.prototype, "created_at", void 0);
__decorate([
    (0, typeorm_1.UpdateDateColumn)(),
    __metadata("design:type", Date)
], MailLog.prototype, "updated_at", void 0);
exports.MailLog = MailLog = __decorate([
    (0, typeorm_1.Entity)('mail_logs')
], MailLog);
//# sourceMappingURL=mail-log.entity.js.map