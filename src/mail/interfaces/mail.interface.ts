export interface IMailService {
  sendMail(sendMailDto: any): Promise<any>;
  sendBulkMail(sendMailDtos: any[]): Promise<any[]>;
  getMailHistory(limit?: number, offset?: number): Promise<any[]>;
  getMailStats(): Promise<any>;
  sendParkingNotification(email: string, parkingInfo: any): Promise<any>;
  sendReminderEmail(email: string, reminderInfo: any): Promise<any>;
}

export interface IMailTemplate {
  subject: string;
  body: string;
  variables?: Record<string, any>;
}

export interface IMailQueueItem {
  id: string;
  to: string;
  subject: string;
  body: string;
  priority: 'low' | 'normal' | 'high' | 'urgent';
  scheduledAt?: Date;
  retryCount: number;
  maxRetries: number;
}

export interface IMailMetrics {
  totalSent: number;
  totalFailed: number;
  successRate: number;
  averageProcessingTime: number;
  lastSentAt: Date | null;
  queueSize: number;
  activeWorkers: number;
}

export interface IMailConfig {
  simulation: {
    successRate: number;
    minDelay: number;
    maxDelay: number;
    maxRetries: number;
  };
  templates: Record<string, any>;
  limits: {
    maxBodyLength: number;
    maxSubjectLength: number;
    maxBulkSize: number;
    maxProcessingTime: number;
  };
  logging: {
    level: string;
    verbose: boolean;
    metrics: boolean;
  };
}
