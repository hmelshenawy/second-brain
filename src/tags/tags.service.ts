import {
  Injectable,
  NotFoundException,
  ConflictException,
  BadRequestException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateTagDto } from './dto/create-tag.dto';
import { UpdateTagDto } from './dto/update-tag.dto';
import { Prisma } from '../../generated/prisma/client';

@Injectable()
export class TagsService {
  constructor(private prisma: PrismaService) {}

  async create(userId: string, dto: CreateTagDto) {
    try {
      return await this.prisma.tag.create({
        data: { ...dto, userId },
      });
    } catch (e) {
      if (e instanceof Prisma.PrismaClientKnownRequestError && e.code === 'P2002') {
        throw new ConflictException('Tag with this name already exists');
      }
      throw e;
    }
  }

  async findAll(userId: string) {
    const tags = await this.prisma.tag.findMany({
      where: { userId },
      include: { _count: { select: { notes: true } } },
      orderBy: { createdAt: 'desc' },
    });
    return tags.map((t) => ({
      id: t.id,
      name: t.name,
      color: t.color,
      noteCount: t._count.notes,
    }));
  }

  async findOne(userId: string, id: string) {
    const tag = await this.prisma.tag.findFirst({
      where: { id, userId },
    });
    if (!tag) throw new NotFoundException('Tag not found');
    return tag;
  }

  async update(userId: string, id: string, dto: UpdateTagDto) {
    const tag = await this.prisma.tag.findFirst({ where: { id, userId } });
    if (!tag) throw new NotFoundException('Tag not found');

    try {
      return await this.prisma.tag.update({
        where: { id },
        data: dto,
      });
    } catch (e) {
      if (e instanceof Prisma.PrismaClientKnownRequestError && e.code === 'P2002') {
        throw new ConflictException('Tag with this name already exists');
      }
      throw e;
    }
  }

  async remove(userId: string, id: string) {
    const tag = await this.prisma.tag.findFirst({
      where: { id, userId },
      include: { _count: { select: { notes: true } } },
    });
    if (!tag) throw new NotFoundException('Tag not found');

    await this.prisma.tag.delete({ where: { id } });

    return {
      message: 'Tag deleted',
      detachedFromNotes: tag._count.notes,
    };
  }

  async attachToNote(userId: string, noteId: string, tagId: string) {
    const note = await this.prisma.note.findFirst({
      where: { id: noteId, userId },
    });
    if (!note) throw new NotFoundException('Note not found');

    const tag = await this.prisma.tag.findFirst({
      where: { id: tagId, userId },
    });
    if (!tag) throw new NotFoundException('Tag not found');

    try {
      await this.prisma.noteTag.create({
        data: { noteId, tagId },
      });
    } catch (e) {
      if (e instanceof Prisma.PrismaClientKnownRequestError && e.code === 'P2002') {
        throw new ConflictException('Tag is already attached to this note');
      }
      throw e;
    }

    return { message: 'Tag attached', noteId, tagId };
  }

  async detachFromNote(userId: string, noteId: string, tagId: string) {
    const noteTag = await this.prisma.noteTag.findUnique({
      where: { noteId_tagId: { noteId, tagId } },
    });
    if (!noteTag) throw new NotFoundException('Tag is not attached to this note');

    await this.prisma.noteTag.delete({
      where: { noteId_tagId: { noteId, tagId } },
    });

    return { message: 'Tag detached' };
  }
}