import { IsString, IsUUID } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class StartExamDto {
  @ApiProperty()
  @IsUUID()
  examId: string;
}
