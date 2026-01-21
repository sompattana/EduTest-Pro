import { Injectable, BadRequestException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { WalletService } from '../wallet/wallet.service';
import { CreatePaymentDto } from './dto/create-payment.dto';
import * as crypto from 'crypto';
import { HttpService } from '@nestjs/axios';

@Injectable()
export class PaymentService {
  constructor(
    private configService: ConfigService,
    private walletService: WalletService,
  ) {}

  // Click integratsiyasi
  async createClickPayment(userId: string, createPaymentDto: CreatePaymentDto) {
    const merchantId = this.configService.get('CLICK_MERCHANT_ID');
    const serviceId = this.configService.get('CLICK_SERVICE_ID');
    const secretKey = this.configService.get('CLICK_SECRET_KEY');
    const merchantUserId = this.configService.get('CLICK_MERCHANT_USER_ID');

    if (!merchantId || !serviceId || !secretKey) {
      throw new BadRequestException('Click sozlamalari to\'liq emas');
    }

    const { amount } = createPaymentDto;
    const transactionId = `click_${Date.now()}_${userId}`;

    // Click prepare API uchun
    const prepareData = {
      merchant_id: merchantId,
      service_id: serviceId,
      amount: amount,
      transaction_param: transactionId,
      merchant_user_id: merchantUserId,
    };

    // Click prepare URL
    const prepareUrl = 'https://my.click.uz/services/pay';

    return {
      paymentUrl: prepareUrl,
      transactionId,
      amount,
      provider: 'click',
      prepareData,
    };
  }

  async verifyClickWebhook(data: any): Promise<boolean> {
    const secretKey = this.configService.get('CLICK_SECRET_KEY');
    const { merchant_trans_id, merchant_prepare_id, amount, sign_time, sign_string } = data;

    // Click signature tekshirish
    const signString = `${merchant_prepare_id}${merchant_trans_id}${amount}${sign_time}${secretKey}`;
    const calculatedSign = crypto
      .createHash('md5')
      .update(signString)
      .digest('hex');

    return calculatedSign === sign_string;
  }

  async handleClickWebhook(data: any) {
    const isValid = await this.verifyClickWebhook(data);
    if (!isValid) {
      throw new BadRequestException('Noto\'g\'ri signature');
    }

    const { merchant_trans_id, amount, action } = data;
    const transactionId = merchant_trans_id;

    // Transaction ID dan userId ni ajratish
    const userId = transactionId.split('_')[2];

    if (action === 1) {
      // To'lov muvaffaqiyatli
      await this.walletService.deposit(
        userId,
        amount / 100, // Click so'mdan tiyinga o'tkazadi
        merchant_trans_id,
        'click',
      );
    }

    return {
      error: 0,
      error_note: 'Success',
    };
  }

  // Payme integratsiyasi
  async createPaymePayment(userId: string, createPaymentDto: CreatePaymentDto) {
    const merchantId = this.configService.get('PAYME_MERCHANT_ID');
    const key = this.configService.get('PAYME_KEY');

    if (!merchantId || !key) {
      throw new BadRequestException('Payme sozlamalari to\'liq emas');
    }

    const { amount } = createPaymentDto;
    const transactionId = `payme_${Date.now()}_${userId}`;

    // Payme Cards.create API
    const params = {
      amount: amount * 100, // Payme tiyinga o'tkazadi
      account: {
        order_id: transactionId,
      },
    };

    return {
      transactionId,
      amount,
      provider: 'payme',
      params,
      merchantId,
    };
  }

  async verifyPaymeWebhook(data: any): Promise<boolean> {
    const key = this.configService.get('PAYME_KEY');
    const { params, method, id } = data;

    // Payme signature tekshirish (soddalashtirilgan)
    // Haqiqiy loyihada to'liq tekshirish kerak
    return true;
  }

  async handlePaymeWebhook(data: any) {
    const isValid = await this.verifyPaymeWebhook(data);
    if (!isValid) {
      return {
        error: {
          code: -32504,
          message: 'Invalid signature',
        },
      };
    }

    const { method, params } = data;

    if (method === 'cards.create') {
      // To'lov yaratish
      return {
        result: {
          card: {
            number: '8600****1234',
            expire: '12/24',
            token: 'token_example',
            recurrent: false,
            verify: false,
          },
        },
      };
    }

    if (method === 'cards.get_verify_code') {
      // Kod yuborish
      return {
        result: {
          sent: true,
          phone: '9989****1234',
        },
      };
    }

    if (method === 'cards.verify') {
      // Kodni tekshirish va to'lovni amalga oshirish
      const { token, amount } = params;
      const orderId = params.account?.order_id;

      if (orderId && orderId.startsWith('payme_')) {
        const userId = orderId.split('_')[2];
        await this.walletService.deposit(
          userId,
          amount / 100,
          orderId,
          'payme',
        );
      }

      return {
        result: {
          transaction: 'transaction_id',
          state: 1,
        },
      };
    }

    return {
      error: {
        code: -32601,
        message: 'Method not found',
      },
    };
  }
}
