import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn } from 'typeorm';

export enum MailStatus {
  PENDING = 'pending',
  SENT = 'sent',
  FAILED = 'failed',
  DELIVERED = 'delivered',
}

export enum MailType {
  GENERAL = 'general',
  PARKING_NOTIFICATION = 'parking_notification',
  REMINDER = 'reminder',
  SYSTEM = 'system',
}

@Entity('mail_logs')
export class MailLog {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  to: string;

  @Column({ nullable: true })
  cc?: string;

  @Column({ nullable: true })
  bcc?: string;

  @Column()
  subject: string;

  @Column('text')
  body: string;

  @Column({
    type: 'enum',
    enum: MailStatus,
    default: MailStatus.PENDING,
  })
  status: MailStatus;

  @Column({
    type: 'enum',
    enum: MailType,
    default: MailType.GENERAL,
  })
  type: MailType;

  @Column({ nullable: true })
  error_message?: string;

  @Column({ nullable: true })
  retry_count: number;

  @Column({ nullable: true })
  sent_at?: Date;

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;
}
