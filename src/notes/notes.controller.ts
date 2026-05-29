import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
  Request,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { NotesService } from './notes.service';
import { TagsService } from '../tags/tags.service';
import { AttachmentsService } from '../attachments/attachments.service';
import { CreateNoteDto } from './dto/create-note.dto';
import { UpdateNoteDto } from './dto/update-note.dto';
import { CreateNoteLinkDto } from './dto/create-note-link.dto';

@Controller('notes')
export class NotesController {
  constructor(
    private readonly notesService: NotesService,
    private readonly tagsService: TagsService,
    private readonly attachmentsService: AttachmentsService,
  ) {}

  @Post()
  create(@Query('userId') userId: string, @Body() dto: CreateNoteDto) {
    return this.notesService.create(userId, dto);
  }

  @Get()
  findAll(
    @Query('userId') userId: string,
    @Query('notebookId') notebookId?: string,
    @Query('tagId') tagId?: string,
    @Query('pinned') pinned?: string,
    @Query('page') page?: string,
    @Query('limit') limit?: string,
  ) {
    return this.notesService.findAll(userId, {
      notebookId,
      tagId,
      pinned: pinned === 'true' ? true : pinned === 'false' ? false : undefined,
      page: page ? +page : undefined,
      limit: limit ? +limit : undefined,
    });
  }

  @Get(':id')
  findOne(@Query('userId') userId: string, @Param('id') id: string) {
    return this.notesService.findOne(userId, id);
  }

  @Patch(':id')
  update(
    @Query('userId') userId: string,
    @Param('id') id: string,
    @Body() dto: UpdateNoteDto,
  ) {
    return this.notesService.update(userId, id, dto);
  }

  @Delete(':id')
  remove(@Query('userId') userId: string, @Param('id') id: string) {
    return this.notesService.remove(userId, id);
  }

  // Note Links
  @Post(':id/links')
  addLink(
    @Query('userId') userId: string,
    @Param('id') id: string,
    @Body() dto: CreateNoteLinkDto,
  ) {
    return this.notesService.addLink(userId, id, dto);
  }

  @Delete(':id/links/:linkId')
  removeLink(
    @Query('userId') userId: string,
    @Param('id') id: string,
    @Param('linkId') linkId: string,
  ) {
    return this.notesService.removeLink(userId, id, linkId);
  }

  @Get(':id/backlinks')
  getBacklinks(@Query('userId') userId: string, @Param('id') id: string) {
    return this.notesService.getBacklinks(userId, id);
  }

  // Tag attach/detach
  @Post(':id/tags/:tagId')
  attachTag(
    @Query('userId') userId: string,
    @Param('id') noteId: string,
    @Param('tagId') tagId: string,
  ) {
    return this.tagsService.attachToNote(
      userId,
      noteId,
      tagId,
    );
  }

  @Delete(':id/tags/:tagId')
  detachTag(
    @Query('userId') userId: string,
    @Param('id') noteId: string,
    @Param('tagId') tagId: string,
  ) {
    return this.tagsService.detachFromNote(
      userId,
      noteId,
      tagId,
    );
  }

  // Attachments
  @Post(':id/attachments')
  @UseInterceptors(FileInterceptor('file'))
  uploadAttachment(
    @Query('userId') userId: string,
    @Param('id') noteId: string,
    @UploadedFile() file: Express.Multer.File,
  ) {
    return this.attachmentsService.create(
      userId,
      noteId,
      file,
    );
  }

  @Get(':id/attachments')
  listAttachments(@Query('userId') userId: string, @Param('id') noteId: string) {
    return this.attachmentsService.findAllByNote(
      userId,
      noteId,
    );
  }
}