import { Controller, Get, Delete, Param, Request, Query } from '@nestjs/common';
import { AttachmentsService } from './attachments.service';

@Controller('attachments')
export class AttachmentsController {
  constructor(private readonly attachmentsService: AttachmentsService) {}

  @Get(':id/url')
  getPresignedUrl(@Query('userId') userId: string, @Param('id') id: string) {
    return this.attachmentsService.getPresignedUrl(
      userId,
      id,
    );
  }

  @Delete(':id')
  remove(@Query('userId') userId: string, @Param('id') id: string) {
    return this.attachmentsService.remove(userId, id);
  }
}