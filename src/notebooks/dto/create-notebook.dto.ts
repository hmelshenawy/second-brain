import { IsOptional, IsString, MaxLength, IsUUID } from 'class-validator';

export class CreateNotebookDto {
  @IsUUID() userId!: string;

  @IsString()
  @MaxLength(255)
  title!: string;

  @IsOptional()
  @IsString()
  @MaxLength(1000)
  description?: string;
}