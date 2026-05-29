import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { R2Service } from './r2.service';
import { v4 as uuidv4 } from 'uuid';

@Injectable()
export class AttachmentsService {
  constructor(
    private prisma: PrismaService,
    private r2: R2Service,
  ) {}

  async create(userId: string, noteId: string, file: Express.Multer.File) {
    const note = await this.prisma.note.findFirst({
      where: { id: noteId, userId },
    });
    if (!note) throw new NotFoundException('Note not found');

    const r2Key = `attachments/${noteId}/${uuidv4()}-${file.originalname}`;

    await this.r2.upload(r2Key, file.buffer, file.mimetype);

    return this.prisma.attachment.create({
      data: {
        noteId,
        filename: file.originalname,
        mimeType: file.mimetype,
        sizeBytes: file.size,
        r2Key,
      },
    });
  }

  async findAllByNote(userId: string, noteId: string) {
    const note = await this.prisma.note.findFirst({
      where: { id: noteId, userId },
    });
    if (!note) throw new NotFoundException('Note not found');

    return this.prisma.attachment.findMany({
      where: { noteId },
      select: {
        id: true,
        filename: true,
        mimeType: true,
        sizeBytes: true,
        createdAt: true,
      },
      orderBy: { createdAt: 'desc' },
    });
  }

  async getPresignedUrl(userId: string, attachmentId: string) {
    const attachment = await this.prisma.attachment.findUnique({
      where: { id: attachmentId },
      include: { note: true },
    });
    if (!attachment || attachment.note.userId !== userId) {
      throw new NotFoundException('Attachment not found');
    }

    const url = await this.r2.getPresignedUrl(attachment.r2Key);
    const expiresAt = new Date(Date.now() + 3600 * 1000).toISOString();

    return { url, expiresAt };
  }

  async remove(userId: string, attachmentId: string) {
    const attachment = await this.prisma.attachment.findUnique({
      where: { id: attachmentId },
      include: { note: true },
    });
    if (!attachment || attachment.note.userId !== userId) {
      throw new NotFoundException('Attachment not found');
    }

    await this.r2.delete(attachment.r2Key);
    await this.prisma.attachment.delete({ where: { id: attachmentId } });

    return {
      message: 'Attachment deleted from R2 and database',
      r2Key: attachment.r2Key,
    };
  }
}