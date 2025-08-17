export class MailResponseDto {
  success: boolean;
  message: string;
  mailId: number;
  sentAt: Date;
  recipient: string;
  error?: string;
}

export class BulkMailResponseDto {
  totalSent: number;
  successful: number;
  failed: number;
  results: MailResponseDto[];
}

export class MailHistoryResponseDto {
  mails: any[];
  total: number;
  limit: number;
  offset: number;
}

export class MailStatsResponseDto {
  totalSent: number;
  totalFailed: number;
  successRate: number;
  lastSentAt: Date | null;
}
