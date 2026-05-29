import {
  Injectable,
  NotFoundException,
  BadRequestException,
  ConflictException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateNoteDto } from './dto/create-note.dto';
import { UpdateNoteDto } from './dto/update-note.dto';
import { CreateNoteLinkDto } from './dto/create-note-link.dto';
import { Prisma } from '../../generated/prisma/client';

@Injectable()
export class NotesService {
  constructor(private prisma: PrismaService) {}

  async create(userId: string, dto: CreateNoteDto) {
    if (dto.notebookId) {
      const notebook = await this.prisma.notebook.findFirst({
        where: { id: dto.notebookId, userId },
      });
      if (!notebook) throw new NotFoundException('Notebook not found');
    }

    const note = await this.prisma.note.create({
      data: { ...dto, userId },
      include: { tags: { include: { tag: true } } },
    });

    return {
      ...note,
      tags: note.tags.map((nt) => ({
        id: nt.tag.id,
        name: nt.tag.name,
        color: nt.tag.color,
      })),
    };
  }

  async findAll(
    userId: string,
    filters: {
      notebookId?: string;
      tagId?: string;
      pinned?: boolean;
      page?: number;
      limit?: number;
    },
  ) {
    const page = filters.page ?? 1;
    const limit = filters.limit ?? 20;
    const skip = (page - 1) * limit;

    const where: Prisma.NoteWhereInput = { userId };

    if (filters.notebookId) where.notebookId = filters.notebookId;
    if (filters.pinned !== undefined) where.isPinned = filters.pinned;
    if (filters.tagId) {
      where.tags = { some: { tagId: filters.tagId } };
    }

    const [notes, total] = await Promise.all([
      this.prisma.note.findMany({
        where,
        skip,
        take: limit,
        orderBy: [{ isPinned: 'desc' }, { updatedAt: 'desc' }],
        include: {
          tags: { include: { tag: { select: { id: true, name: true, color: true } } } },
        },
      }),
      this.prisma.note.count({ where }),
    ]);

    return {
      data: notes.map((n) => ({
        id: n.id,
        title: n.title,
        isPinned: n.isPinned,
        notebookId: n.notebookId,
        tags: n.tags.map((nt) => nt.tag),
        updatedAt: n.updatedAt,
      })),
      total,
      page,
      limit,
    };
  }

  async findOne(userId: string, id: string) {
    const note = await this.prisma.note.findFirst({
      where: { id, userId },
      include: {
        tags: { include: { tag: { select: { id: true, name: true, color: true } } } },
        sourceLinks: {
          include: {
            targetNote: { select: { id: true, title: true } },
          },
        },
        targetLinks: {
          include: {
            sourceNote: { select: { id: true, title: true } },
          },
        },
        attachments: {
          select: {
            id: true,
            filename: true,
            mimeType: true,
            sizeBytes: true,
          },
        },
        aiSummary: true,
      },
    });
    if (!note) throw new NotFoundException('Note not found');

    return {
      id: note.id,
      title: note.title,
      contentMd: note.contentMd,
      isPinned: note.isPinned,
      notebookId: note.notebookId,
      tags: note.tags.map((nt) => nt.tag),
      links: note.sourceLinks.map((l) => ({
        id: l.id,
        targetNote: l.targetNote,
        linkText: l.linkText,
      })),
      backlinks: note.targetLinks.map((l) => ({
        id: l.id,
        sourceNote: l.sourceNote,
        linkText: l.linkText,
      })),
      attachments: note.attachments,
      aiSummary: note.aiSummary
        ? {
            summary: note.aiSummary.summary,
            modelUsed: note.aiSummary.modelUsed,
            generatedAt: note.aiSummary.generatedAt,
          }
        : null,
      createdAt: note.createdAt,
      updatedAt: note.updatedAt,
    };
  }

  async update(userId: string, id: string, dto: UpdateNoteDto) {
    const note = await this.prisma.note.findFirst({ where: { id, userId } });
    if (!note) throw new NotFoundException('Note not found');

    if (dto.notebookId) {
      const notebook = await this.prisma.notebook.findFirst({
        where: { id: dto.notebookId, userId },
      });
      if (!notebook) throw new NotFoundException('Notebook not found');
    }

    return this.prisma.note.update({
      where: { id },
      data: dto,
    });
  }

  async remove(userId: string, id: string) {
    const note = await this.prisma.note.findFirst({
      where: { id, userId },
      include: {
        sourceLinks: { select: { id: true } },
        targetLinks: { select: { id: true } },
        attachments: { select: { id: true, r2Key: true } },
        tags: { select: { tagId: true } },
      },
    });
    if (!note) throw new NotFoundException('Note not found');

    const deletedAttachments = note.attachments.length;
    const deletedLinks = note.sourceLinks.length + note.targetLinks.length;
    const r2Keys = note.attachments.map((a) => a.r2Key);

    await this.prisma.note.delete({ where: { id } });

    return {
      message: 'Note deleted',
      deletedAttachments,
      deletedLinks,
      r2Keys,
    };
  }

  async addLink(userId: string, noteId: string, dto: CreateNoteLinkDto) {
    if (noteId === dto.targetNoteId) {
      throw new BadRequestException('Cannot link a note to itself');
    }

    const sourceNote = await this.prisma.note.findFirst({
      where: { id: noteId, userId },
    });
    if (!sourceNote) throw new NotFoundException('Source note not found');

    const targetNote = await this.prisma.note.findFirst({
      where: { id: dto.targetNoteId, userId },
    });
    if (!targetNote) throw new NotFoundException('Target note not found');

    try {
      return await this.prisma.noteLink.create({
        data: {
          sourceNoteId: noteId,
          targetNoteId: dto.targetNoteId,
          linkText: dto.linkText,
        },
      });
    } catch (e) {
      if (e instanceof Prisma.PrismaClientKnownRequestError && e.code === 'P2002') {
        throw new ConflictException('Link already exists between these notes');
      }
      throw e;
    }
  }

  async removeLink(userId: string, noteId: string, linkId: string) {
    const link = await this.prisma.noteLink.findFirst({
      where: { id: linkId, sourceNoteId: noteId },
    });
    if (!link) throw new NotFoundException('Link not found');

    const note = await this.prisma.note.findFirst({
      where: { id: noteId, userId },
    });
    if (!note) throw new NotFoundException('Note not found');

    await this.prisma.noteLink.delete({ where: { id: linkId } });

    return { message: 'Link removed' };
  }

  async getBacklinks(userId: string, noteId: string) {
    const note = await this.prisma.note.findFirst({
      where: { id: noteId, userId },
    });
    if (!note) throw new NotFoundException('Note not found');

    const backlinks = await this.prisma.noteLink.findMany({
      where: { targetNoteId: noteId },
      include: {
        sourceNote: {
          select: { id: true, title: true, updatedAt: true },
        },
      },
    });

    return backlinks.map((l) => ({
      id: l.id,
      sourceNote: l.sourceNote,
      linkText: l.linkText,
    }));
  }
}