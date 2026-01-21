import { IsNumber, Min } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreatePaymentDto {
  @ApiProperty({ example: 50000, description: 'To\'lov summasi (so\'m)' })
  @IsNumber()
  @Min(1000, { message: 'Minimal summa 1000 so\'m' })
  amount: number;
}
