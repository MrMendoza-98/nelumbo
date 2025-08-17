import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity()
export class MailLog {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  to: string;

  @Column()
  subject: string;

  @Column('text')
  body: string;

  @Column()
  sent_at: Date;
}
