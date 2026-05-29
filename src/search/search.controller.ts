import { Controller, Get, Query, Request } from '@nestjs/common';
import { SearchService } from './search.service';

@Controller('search')
export class SearchController {
  constructor(private readonly searchService: SearchService) {}

  @Get()
  search(
    @Request() req: any,
    @Query('q') q: string,
    @Query('limit') limit?: string,
  ) {
    return this.searchService.search(
      req.user?.userId ?? 'temp',
      q,
      limit ? +limit : undefined,
    );
  }
}