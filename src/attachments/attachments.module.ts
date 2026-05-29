import { Module } from '@nestjs/common';
import { AttachmentsService } from './attachments.service';
import { AttachmentsController } from './attachments.controller';
import { R2Service } from './r2.service';
import { PrismaModule } from '../prisma/prisma.module';

@Module({
  imports: [PrismaModule],
  controllers: [AttachmentsController],
  providers: [AttachmentsService, R2Service],
  exports: [AttachmentsService],
})
export class AttachmentsModule {}