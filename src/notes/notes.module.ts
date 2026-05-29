import { Module } from '@nestjs/common';
import { NotesService } from './notes.service';
import { NotesController } from './notes.controller';
import { PrismaModule } from '../prisma/prisma.module';
import { TagsModule } from '../tags/tags.module';
import { AttachmentsModule } from '../attachments/attachments.module';

@Module({
  imports: [PrismaModule, TagsModule, AttachmentsModule],
  controllers: [NotesController],
  providers: [NotesService],
})
export class NotesModule {}