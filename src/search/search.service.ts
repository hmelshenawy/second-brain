import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class SearchService {
  constructor(private prisma: PrismaService) {}

  async search(userId: string, query: string, limit = 20) {
    const results = await this.prisma.$queryRaw<
      Array<{
        id: string;
        title: string;
        snippet: string;
        relevance: number;
        notebook_id: string | null;
        notebook_title: string | null;
        updated_at: Date;
      }>
    >`
      SELECT
        n.id,
        n.title,
        ts_headline(
          'english',
          coalesce(n.content_md, ''),
          plainto_tsquery('english', ${query}),
          'MaxWords=35, MinWords=10, ShortWord=3, HighlightAll=FALSE'
        ) AS snippet,
        ts_rank(
          to_tsvector('english', coalesce(n.title, '') || ' ' || coalesce(n.content_md, '')),
          plainto_tsquery('english', ${query})
        ) AS relevance,
        n.notebook_id,
        nb.title AS notebook_title,
        n.updated_at
      FROM notes n
      LEFT JOIN notebooks nb ON nb.id = n.notebook_id
      WHERE n.user_id = ${userId}
        AND to_tsvector('english', coalesce(n.title, '') || ' ' || coalesce(n.content_md, ''))
            @@ plainto_tsquery('english', ${query})
      ORDER BY relevance DESC, n.updated_at DESC
      LIMIT ${limit}
    `;

    return {
      query,
      results: results.map((r) => ({
        id: r.id,
        title: r.title,
        snippet: r.snippet,
        relevance: Math.round(r.relevance * 100) / 100,
        notebookId: r.notebook_id,
        notebookTitle: r.notebook_title,
        updatedAt: r.updated_at,
      })),
      total: results.length,
    };
  }
}