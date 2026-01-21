import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ExamService } from './exam.service';
import { ExamController } from './exam.controller';
import { Exam } from './entities/exam.entity';
import { Question } from './entities/question.entity';
import { Answer } from './entities/answer.entity';
import { ExamAttempt } from './entities/exam-attempt.entity';
import { ExamAnswer } from './entities/exam-answer.entity';
import { WalletModule } from '../wallet/wallet.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      Exam,
      Question,
      Answer,
      ExamAttempt,
      ExamAnswer,
    ]),
    WalletModule,
  ],
  controllers: [ExamController],
  providers: [ExamService],
  exports: [ExamService],
})
export class ExamModule {}
