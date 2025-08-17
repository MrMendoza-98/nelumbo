import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { MailService } from './mail.service';
import { MailLog, MailStatus, MailType } from './mail-log.entity';
import { SendMailDto } from './dto';

describe('MailService', () => {
  let service: MailService;
  let repository: Repository<MailLog>;

  const mockRepository = {
    create: jest.fn(),
    save: jest.fn(),
    find: jest.fn(),
    findOne: jest.fn(),
    count: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        MailService,
        {
          provide: getRepositoryToken(MailLog),
          useValue: mockRepository,
        },
      ],
    }).compile();

    service = module.get<MailService>(MailService);
    repository = module.get<Repository<MailLog>>(getRepositoryToken(MailLog));
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('sendMail', () => {
    const mockSendMailDto: SendMailDto = {
      to: 'test@example.com',
      subject: 'Test Subject',
      body: 'Test Body',
    };

    const mockMailLog: MailLog = {
      id: 1,
      to: 'test@example.com',
      subject: 'Test Subject',
      body: 'Test Body',
      status: MailStatus.SENT,
      type: MailType.GENERAL,
      sent_at: new Date(),
      retry_count: 0,
      created_at: new Date(),
      updated_at: new Date(),
    };

    it('should send mail successfully', async () => {
      mockRepository.create.mockReturnValue(mockMailLog);
      mockRepository.save.mockResolvedValue(mockMailLog);

      const result = await service.sendMail(mockSendMailDto);

      expect(result.success).toBe(true);
      expect(result.message).toBe('Correo enviado exitosamente');
      expect(result.mailId).toBe(mockMailLog.id);
      expect(mockRepository.create).toHaveBeenCalledWith({
        ...mockSendMailDto,
        status: MailStatus.SENT,
        type: MailType.GENERAL,
        sent_at: expect.any(Date),
        retry_count: 0,
      });
      expect(mockRepository.save).toHaveBeenCalledWith(mockMailLog);
    });

    it('should handle mail sending failure', async () => {
      const error = new Error('Simulated error');
      mockRepository.create.mockReturnValue(mockMailLog);
      mockRepository.save.mockResolvedValue(mockMailLog);

      // Mock Math.random to simulate failure
      jest.spyOn(Math, 'random').mockReturnValue(0.96); // 96% > 95% threshold

      const result = await service.sendMail(mockSendMailDto);

      expect(result.success).toBe(false);
      expect(result.message).toContain('Error al enviar correo');
      expect(mockRepository.create).toHaveBeenCalledWith({
        ...mockSendMailDto,
        status: MailStatus.FAILED,
        type: MailType.GENERAL,
        error_message: error.message,
        retry_count: 1,
      });
    });
  });

  describe('sendBulkMail', () => {
    const mockSendMailDtos: SendMailDto[] = [
      { to: 'test1@example.com', subject: 'Test 1', body: 'Body 1' },
      { to: 'test2@example.com', subject: 'Test 2', body: 'Body 2' },
    ];

    it('should send bulk mail successfully', async () => {
      const mockResults = [
        { success: true, message: 'Success 1' },
        { success: true, message: 'Success 2' },
      ];

      jest.spyOn(service, 'sendMail')
        .mockResolvedValueOnce(mockResults[0])
        .mockResolvedValueOnce(mockResults[1]);

      const result = await service.sendBulkMail(mockSendMailDtos);

      expect(result).toHaveLength(2);
      expect(result[0].success).toBe(true);
      expect(result[1].success).toBe(true);
    });
  });

  describe('getMailHistory', () => {
    it('should return mail history with default parameters', async () => {
      const mockMails = [
        { id: 1, to: 'test@example.com', subject: 'Test', body: 'Body' },
      ];

      mockRepository.find.mockResolvedValue(mockMails);

      const result = await service.getMailHistory();

      expect(mockRepository.find).toHaveBeenCalledWith({
        order: { created_at: 'DESC' },
        skip: 0,
        take: 50,
      });
      expect(result).toEqual(mockMails);
    });

    it('should return mail history with custom parameters', async () => {
      const mockMails = [
        { id: 1, to: 'test@example.com', subject: 'Test', body: 'Body' },
      ];

      mockRepository.find.mockResolvedValue(mockMails);

      const result = await service.getMailHistory(10, 20);

      expect(mockRepository.find).toHaveBeenCalledWith({
        order: { created_at: 'DESC' },
        skip: 20,
        take: 10,
      });
      expect(result).toEqual(mockMails);
    });
  });

  describe('getMailStats', () => {
    it('should return mail statistics', async () => {
      const mockCount = 100;
      const mockLastMail = {
        sent_at: new Date(),
      };

      mockRepository.count.mockResolvedValue(mockCount);
      mockRepository.findOne.mockResolvedValue(mockLastMail);

      const result = await service.getMailStats();

      expect(result.totalSent).toBe(mockCount);
      expect(result.totalFailed).toBe(0);
      expect(result.successRate).toBe(100);
      expect(result.lastSentAt).toEqual(mockLastMail.sent_at);
    });
  });

  describe('sendParkingNotification', () => {
    const mockParkingInfo = {
      vehiclePlate: 'ABC123',
      parkingName: 'Test Parking',
      entryTime: new Date(),
      location: 'Test Location',
    };

    it('should send parking notification successfully', async () => {
      const mockMailLog: MailLog = {
        id: 1,
        to: 'test@example.com',
        subject: 'Notificación de Parqueo - Nelumbo',
        body: expect.stringContaining('ABC123'),
        status: MailStatus.SENT,
        type: MailType.PARKING_NOTIFICATION,
        sent_at: new Date(),
        retry_count: 0,
        created_at: new Date(),
        updated_at: new Date(),
      };

      mockRepository.create.mockReturnValue(mockMailLog);
      mockRepository.save.mockResolvedValue(mockMailLog);

      const result = await service.sendParkingNotification('test@example.com', mockParkingInfo);

      expect(result.success).toBe(true);
      expect(result.message).toBe('Notificación de parqueo enviada exitosamente');
      expect(result.recipient).toBe('test@example.com');
      expect(mockRepository.create).toHaveBeenCalledWith({
        to: 'test@example.com',
        subject: 'Notificación de Parqueo - Nelumbo',
        body: expect.stringContaining('ABC123'),
        status: MailStatus.SENT,
        type: MailType.PARKING_NOTIFICATION,
        sent_at: expect.any(Date),
        retry_count: 0,
      });
    });
  });

  describe('sendReminderEmail', () => {
    const mockReminderInfo = {
      type: 'parking_expiry' as const,
      message: 'Test reminder message',
      dueDate: new Date(),
    };

    it('should send reminder email successfully', async () => {
      const mockResult = {
        success: true,
        message: 'Correo enviado exitosamente',
        mailId: 1,
        sentAt: new Date(),
        recipient: 'test@example.com',
      };

      jest.spyOn(service, 'sendMail').mockResolvedValue(mockResult);

      const result = await service.sendReminderEmail('test@example.com', mockReminderInfo);

      expect(result).toEqual(mockResult);
      expect(service.sendMail).toHaveBeenCalledWith({
        to: 'test@example.com',
        subject: 'Recordatorio - PARKING EXPIRY',
        body: expect.stringContaining('Test reminder message'),
      });
    });
  });
});
