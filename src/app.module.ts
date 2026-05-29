import { Module } from '@nestjs/common';
import { PrismaModule } from './prisma/prisma.module';
import { UsersModule } from './users/users.module';
import { AuthModule } from './auth/auth.module';
import { NotebooksModule } from './notebooks/notebooks.module';
import { NotesModule } from './notes/notes.module';
import { TagsModule } from './tags/tags.module';
import { AttachmentsModule } from './attachments/attachments.module';
import { SearchModule } from './search/search.module';
import { AiModule } from './ai/ai.module';

@Module({
  imports: [
    PrismaModule,
    UsersModule,
    AuthModule,
    NotebooksModule,
    NotesModule,
    TagsModule,
    AttachmentsModule,
    SearchModule,
    AiModule,
  ],
})
export class AppModule {}