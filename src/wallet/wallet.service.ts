import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DataSource, Repository } from 'typeorm';
import { Wallet } from './entities/wallet.entity';
import { Transaction, TransactionType, TransactionStatus } from './entities/transaction.entity';

@Injectable()
export class WalletService {
  constructor(
    @InjectRepository(Wallet)
    private walletRepository: Repository<Wallet>,
    @InjectRepository(Transaction)
    private transactionRepository: Repository<Transaction>,
    private dataSource: DataSource,
  ) {}

  async createWallet(userId: string): Promise<Wallet> {
    const wallet = this.walletRepository.create({
      userId,
      balance: 0,
    });
    return await this.walletRepository.save(wallet);
  }

  async getWallet(userId: string): Promise<Wallet> {
    const wallet = await this.walletRepository.findOne({
      where: { userId },
      relations: ['transactions'],
    });
    if (!wallet) {
      throw new NotFoundException('Wallet topilmadi');
    }
    return wallet;
  }

  async getBalance(userId: string): Promise<number> {
    const wallet = await this.getWallet(userId);
    return Number(wallet.balance);
  }

  async deposit(
    userId: string,
    amount: number,
    paymentId: string,
    paymentProvider: string,
  ): Promise<Transaction> {
    if (amount <= 0) {
      throw new BadRequestException('Summa 0 dan katta bo\'lishi kerak');
    }

    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      const wallet = await queryRunner.manager.findOne(Wallet, {
        where: { userId },
      });

      if (!wallet) {
        throw new NotFoundException('Wallet topilmadi');
      }

      // Tranzaksiya yaratish
      const transaction = queryRunner.manager.create(Transaction, {
        walletId: wallet.id,
        type: TransactionType.DEPOSIT,
        amount,
        status: TransactionStatus.COMPLETED,
        description: `Balans to'ldirildi`,
        paymentId,
        paymentProvider,
      });

      // Balansni yangilash
      wallet.balance = Number(wallet.balance) + amount;

      await queryRunner.manager.save(wallet);
      await queryRunner.manager.save(transaction);

      await queryRunner.commitTransaction();

      return transaction;
    } catch (error) {
      await queryRunner.rollbackTransaction();
      throw error;
    } finally {
      await queryRunner.release();
    }
  }

  async withdraw(
    userId: string,
    amount: number,
    description: string,
  ): Promise<Transaction> {
    if (amount <= 0) {
      throw new BadRequestException('Summa 0 dan katta bo\'lishi kerak');
    }

    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      const wallet = await queryRunner.manager.findOne(Wallet, {
        where: { userId },
      });

      if (!wallet) {
        throw new NotFoundException('Wallet topilmadi');
      }

      const currentBalance = Number(wallet.balance);
      if (currentBalance < amount) {
        throw new BadRequestException('Balansda yetarli mablag\' yo\'q');
      }

      // Tranzaksiya yaratish
      const transaction = queryRunner.manager.create(Transaction, {
        walletId: wallet.id,
        type: TransactionType.WITHDRAW,
        amount,
        status: TransactionStatus.COMPLETED,
        description,
      });

      // Balansni yangilash
      wallet.balance = currentBalance - amount;

      await queryRunner.manager.save(wallet);
      await queryRunner.manager.save(transaction);

      await queryRunner.commitTransaction();

      return transaction;
    } catch (error) {
      await queryRunner.rollbackTransaction();
      throw error;
    } finally {
      await queryRunner.release();
    }
  }

  async payForExam(
    userId: string,
    amount: number,
    examId: string,
  ): Promise<Transaction> {
    if (amount <= 0) {
      throw new BadRequestException('Summa 0 dan katta bo\'lishi kerak');
    }

    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      const wallet = await queryRunner.manager.findOne(Wallet, {
        where: { userId },
      });

      if (!wallet) {
        throw new NotFoundException('Wallet topilmadi');
      }

      const currentBalance = Number(wallet.balance);
      if (currentBalance < amount) {
        throw new BadRequestException('Balansda yetarli mablag\' yo\'q');
      }

      // Tranzaksiya yaratish
      const transaction = queryRunner.manager.create(Transaction, {
        walletId: wallet.id,
        type: TransactionType.EXAM_PAYMENT,
        amount,
        status: TransactionStatus.COMPLETED,
        description: `Test uchun to'lov: ${examId}`,
      });

      // Balansni yangilash
      wallet.balance = currentBalance - amount;

      await queryRunner.manager.save(wallet);
      await queryRunner.manager.save(transaction);

      await queryRunner.commitTransaction();

      return transaction;
    } catch (error) {
      await queryRunner.rollbackTransaction();
      throw error;
    } finally {
      await queryRunner.release();
    }
  }

  async getTransactions(userId: string): Promise<Transaction[]> {
    const wallet = await this.getWallet(userId);
    return await this.transactionRepository.find({
      where: { walletId: wallet.id },
      order: { createdAt: 'DESC' },
    });
  }

  async getTransactionHistory(
    userId: string,
    limit: number = 50,
  ): Promise<Transaction[]> {
    const wallet = await this.getWallet(userId);
    return await this.transactionRepository.find({
      where: { walletId: wallet.id },
      order: { createdAt: 'DESC' },
      take: limit,
    });
  }
}
