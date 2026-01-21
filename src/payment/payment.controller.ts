import {
  Controller,
  Post,
  Body,
  UseGuards,
  Request,
  Headers,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { PaymentService } from './payment.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { CreatePaymentDto } from './dto/create-payment.dto';

@ApiTags('Payment')
@Controller('payment')
export class PaymentController {
  constructor(private readonly paymentService: PaymentService) {}

  @Post('click/create')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Click to\'lov yaratish' })
  async createClickPayment(
    @Request() req,
    @Body() createPaymentDto: CreatePaymentDto,
  ) {
    return this.paymentService.createClickPayment(
      req.user.id,
      createPaymentDto,
    );
  }

  @Post('click/webhook')
  @ApiOperation({ summary: 'Click webhook' })
  async handleClickWebhook(@Body() data: any) {
    return this.paymentService.handleClickWebhook(data);
  }

  @Post('payme/create')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Payme to\'lov yaratish' })
  async createPaymePayment(
    @Request() req,
    @Body() createPaymentDto: CreatePaymentDto,
  ) {
    return this.paymentService.createPaymePayment(
      req.user.id,
      createPaymentDto,
    );
  }

  @Post('payme/webhook')
  @ApiOperation({ summary: 'Payme webhook' })
  async handlePaymeWebhook(@Body() data: any) {
    return this.paymentService.handlePaymeWebhook(data);
  }
}
