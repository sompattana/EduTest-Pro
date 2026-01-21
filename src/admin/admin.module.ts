import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AdminService } from './admin.service';
import { AdminController } from './admin.controller';
import { UserModule } from '../user/user.module';
import { ExamModule } from '../exam/exam.module';
import { WalletModule } from '../wallet/wallet.module';
import { Transaction } from '../wallet/entities/transaction.entity';
import { ExamAttempt } from '../exam/entities/exam-attempt.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([Transaction, ExamAttempt]),
    UserModule,
    ExamModule,
    WalletModule,
  ],
  controllers: [AdminController],
  providers: [AdminService],
})
export class AdminModule {}
