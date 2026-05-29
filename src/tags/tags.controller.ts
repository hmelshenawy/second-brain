import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Request,
} from '@nestjs/common';
import { TagsService } from './tags.service';
import { CreateTagDto } from './dto/create-tag.dto';
import { UpdateTagDto } from './dto/update-tag.dto';

@Controller('tags')
export class TagsController {
  constructor(private readonly tagsService: TagsService) {}

  @Post()
  create(@Request() req: any, @Body() dto: CreateTagDto) {
    return this.tagsService.create(req.user?.userId ?? 'temp', dto);
  }

  @Get()
  findAll(@Request() req: any) {
    return this.tagsService.findAll(req.user?.userId ?? 'temp');
  }

  @Patch(':id')
  update(@Request() req: any, @Param('id') id: string, @Body() dto: UpdateTagDto) {
    return this.tagsService.update(req.user?.userId ?? 'temp', id, dto);
  }

  @Delete(':id')
  remove(@Request() req: any, @Param('id') id: string) {
    return this.tagsService.remove(req.user?.userId ?? 'temp', id);
  }
}