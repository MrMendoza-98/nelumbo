import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { MailController } from './mail.controller';
import { MailService } from './mail.service';
import { MailLog } from './mail-log.entity';

@Module({
  imports: [TypeOrmModule.forFeature([MailLog])],
  controllers: [MailController],
  providers: [MailService],
  exports: [MailService],
})
export class MailModule {}
