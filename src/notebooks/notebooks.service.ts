import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateNotebookDto } from './dto/create-notebook.dto';
import { UpdateNotebookDto } from './dto/update-notebook.dto';

@Injectable()
export class NotebooksService {
  constructor(private prisma: PrismaService) {}

  async create(userId: string, dto: CreateNotebookDto) {
    const notebook = await this.prisma.notebook.create({
      data: { title: dto.title,
      description: dto.description,
      userId },
    });
    return { ...notebook, noteCount: 0 };
  }

  async findAll(userId: string, page = 1, limit = 20) {
    const skip = (page - 1) * limit;
    const [notebooks, total] = await Promise.all([
      this.prisma.notebook.findMany({
        where: { userId },
        skip,
        take: limit,
        orderBy: { updatedAt: 'desc' },
        include: { _count: { select: { notes: true } } },
      }),
      this.prisma.notebook.count({ where: { userId } }),
    ]);

    return {
      data: notebooks.map((nb) => ({
        id: nb.id,
        title: nb.title,
        description: nb.description,
        noteCount: nb._count.notes,
        createdAt: nb.createdAt,
        updatedAt: nb.updatedAt,
      })),
      total,
      page,
      limit,
    };
  }

  async findOne(userId: string, id: string) {
    const notebook = await this.prisma.notebook.findFirst({
      where: { id, userId },
      include: {
        notes: {
          select: { id: true, title: true, isPinned: true, updatedAt: true },
          orderBy: [{ isPinned: 'desc' }, { updatedAt: 'desc' }],
        },
      },
    });
    if (!notebook) throw new NotFoundException('Notebook not found');
    return notebook;
  }

  async update(userId: string, id: string, dto: UpdateNotebookDto) {
    const notebook = await this.prisma.notebook.findFirst({
      where: { id, userId },
    });
    if (!notebook) throw new NotFoundException('Notebook not found');

    return this.prisma.notebook.update({
      where: { id },
      data: dto,
    });
  }

  async remove(userId: string, id: string) {
    const notebook = await this.prisma.notebook.findFirst({
      where: { id, userId },
      include: { notes: { select: { id: true } } },
    });
    if (!notebook) throw new NotFoundException('Notebook not found');

    const noteIds = notebook.notes.map((n) => n.id);

    const attachmentCount = noteIds.length
      ? await this.prisma.attachment.count({
          where: { noteId: { in: noteIds } },
        })
      : 0;

    await this.prisma.notebook.delete({ where: { id } });

    return {
      message: 'Notebook deleted',
      deletedNotes: noteIds.length,
      deletedAttachments: attachmentCount,
    };
  }
}