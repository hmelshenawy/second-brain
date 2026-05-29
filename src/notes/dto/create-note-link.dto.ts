import { IsOptional, IsString, IsUUID, MaxLength } from 'class-validator';

export class CreateNoteLinkDto {
  @IsUUID()
  targetNoteId!: string;

  @IsOptional()
  @IsString()
  @MaxLength(255)
  linkText?: string;
}