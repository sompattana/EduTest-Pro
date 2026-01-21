import {
  Controller,
  Get,
  Post,
  Body,
  UseGuards,
  Request,
  Query,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { WalletService } from './wallet.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@ApiTags('Wallet')
@Controller('wallet')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
export class WalletController {
  constructor(private readonly walletService: WalletService) {}

  @Get('balance')
  @ApiOperation({ summary: 'Balansni ko\'rish' })
  async getBalance(@Request() req) {
    const balance = await this.walletService.getBalance(req.user.id);
    return {
      balance,
      currency: 'UZS',
    };
  }

  @Get('transactions')
  @ApiOperation({ summary: 'Tranzaksiyalar tarixi' })
  async getTransactions(
    @Request() req,
    @Query('limit') limit?: number,
  ) {
    const transactions = await this.walletService.getTransactionHistory(
      req.user.id,
      limit ? parseInt(limit.toString()) : 50,
    );
    return transactions;
  }

  @Get('info')
  @ApiOperation({ summary: 'Wallet to\'liq ma\'lumotlari' })
  async getWalletInfo(@Request() req) {
    const wallet = await this.walletService.getWallet(req.user.id);
    return {
      id: wallet.id,
      balance: Number(wallet.balance),
      currency: 'UZS',
      createdAt: wallet.createdAt,
    };
  }
}
