import { IsBoolean, IsOptional, IsString, IsUUID, MaxLength } from 'class-validator';

export class CreateNoteDto {
  @IsString()
  @MaxLength(255)
  title!: string;

  @IsOptional()
  @IsString()
  contentMd?: string;

  @IsOptional()
  @IsBoolean()
  isPinned?: boolean;

  @IsOptional()
  @IsUUID()
  notebookId?: string;
}