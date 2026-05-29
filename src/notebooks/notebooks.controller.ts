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
} from '@nestjs/common';
import { NotebooksService } from './notebooks.service';
import { CreateNotebookDto } from './dto/create-notebook.dto';
import { UpdateNotebookDto } from './dto/update-notebook.dto';

@Controller('notebooks')
export class NotebooksController {
  constructor(private readonly notebooksService: NotebooksService) {}

  @Post()
  create( @Body() dto: CreateNotebookDto) {
    return this.notebooksService.create(dto.userId, dto);
  }

  @Get()
  findAll(
    @Query('userId') userId: string,
    @Query('page') page = '1',
    @Query('limit') limit = '20',
  ) {
    return this.notebooksService.findAll(
      userId,
      page ? +page : undefined,
      limit ? +limit : undefined,
    );
  }

  @Get(':id')
  findOne(@Query('userId') userId: string, @Param('id') id: string) {
    return this.notebooksService.findOne(userId, id);
  }

  @Patch(':id')
  update(
    @Query('userId') userId: string,
    @Param('id') id: string,
    @Body() dto: UpdateNotebookDto,
  ) {
    return this.notebooksService.update(userId, id, dto);
  }

  @Delete(':id')
  remove(@Query('userId') userId: string, @Param('id') id: string) {
    return this.notebooksService.remove(userId, id);
  }
}