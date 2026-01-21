import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { TypeOrmModuleOptions, TypeOrmOptionsFactory } from '@nestjs/typeorm';
import { User } from '../user/entities/user.entity';
import { Wallet } from '../wallet/entities/wallet.entity';
import { Transaction } from '../wallet/entities/transaction.entity';
import { Exam } from '../exam/entities/exam.entity';
import { Question } from '../exam/entities/question.entity';
import { Answer } from '../exam/entities/answer.entity';
import { ExamAttempt } from '../exam/entities/exam-attempt.entity';
import { ExamAnswer } from '../exam/entities/exam-answer.entity';

@Injectable()
export class TypeOrmConfigService implements TypeOrmOptionsFactory {
  constructor(private configService: ConfigService) {}

  createTypeOrmOptions(): TypeOrmModuleOptions {
    return {
      type: 'postgres',
      host: this.configService.get('DB_HOST', 'localhost'),
      port: this.configService.get('DB_PORT', 5432),
      username: this.configService.get('DB_USERNAME', 'postgres'),
      password: this.configService.get('DB_PASSWORD', 'postgres'),
      database: this.configService.get('DB_DATABASE', 'edutest_pro'),
      entities: [
        User,
        Wallet,
        Transaction,
        Exam,
        Question,
        Answer,
        ExamAttempt,
        ExamAnswer,
      ],
      synchronize: this.configService.get('NODE_ENV') !== 'production',
      logging: this.configService.get('NODE_ENV') === 'development',
    };
  }
}
