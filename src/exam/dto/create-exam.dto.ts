import {
  IsString,
  IsNumber,
  IsOptional,
  IsArray,
  ValidateNested,
  Min,
} from 'class-validator';
import { Type } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';

class CreateAnswerDto {
  @ApiProperty()
  @IsString()
  text: string;

  @ApiProperty()
  @IsNumber()
  order: number;

  @ApiProperty()
  isCorrect: boolean;
}

class CreateQuestionDto {
  @ApiProperty()
  @IsString()
  text: string;

  @ApiProperty({ default: 1 })
  @IsNumber()
  @Min(1)
  points: number;

  @ApiProperty()
  @IsNumber()
  order: number;

  @ApiProperty({ type: [CreateAnswerDto] })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => CreateAnswerDto)
  answers: CreateAnswerDto[];
}

export class CreateExamDto {
  @ApiProperty()
  @IsString()
  title: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  description?: string;

  @ApiProperty()
  @IsString()
  subject: string;

  @ApiProperty()
  @IsNumber()
  @Min(0)
  price: number;

  @ApiProperty()
  @IsNumber()
  @Min(1)
  duration: number; // daqiqa

  @ApiProperty({ default: 60 })
  @IsNumber()
  @Min(0)
  passingScore: number; // foiz

  @ApiProperty({ type: [CreateQuestionDto] })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => CreateQuestionDto)
  questions: CreateQuestionDto[];
}
