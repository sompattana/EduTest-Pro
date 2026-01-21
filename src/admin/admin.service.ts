import { Injectable, ForbiddenException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, Between } from 'typeorm';
import { UserService } from '../user/user.service';
import { ExamService } from '../exam/exam.service';
import { Transaction, TransactionType } from '../wallet/entities/transaction.entity';
import { ExamAttempt } from '../exam/entities/exam-attempt.entity';
import { CreateExamDto } from '../exam/dto/create-exam.dto';

@Injectable()
export class AdminService {
  constructor(
    @InjectRepository(Transaction)
    private transactionRepository: Repository<Transaction>,
    @InjectRepository(ExamAttempt)
    private examAttemptRepository: Repository<ExamAttempt>,
    private userService: UserService,
    private examService: ExamService,
  ) {}

  // Foydalanuvchilar boshqaruvi
  async getAllUsers() {
    return this.userService.findAll();
  }

  async getUserById(userId: string) {
    return this.userService.findOne(userId);
  }

  async getUserStats() {
    return this.userService.getUsersStats();
  }

  // Testlar boshqaruvi
  async createExam(createExamDto: CreateExamDto) {
    const exam = await this.examService.createExam(createExamDto);
    
    // Savollar va javoblarni yaratish
    const { questions } = createExamDto;
    for (const questionData of questions) {
      // Bu logika ExamService da bo'lishi kerak
      // Hozircha asosiy struktura
    }

    return exam;
  }

  async getAllExams() {
    return this.examService.getAllExams();
  }

  async getExamById(examId: string) {
    return this.examService.getExamById(examId);
  }

  // Moliya tahlili
  async getFinancialStats(startDate?: Date, endDate?: Date) {
    const query = this.transactionRepository
      .createQueryBuilder('transaction')
      .where('transaction.status = :status', {
        status: 'completed',
      });

    if (startDate && endDate) {
      query.andWhere('transaction.createdAt BETWEEN :start AND :end', {
        start: startDate,
        end: endDate,
      });
    }

    const transactions = await query.getMany();

    const totalDeposits = transactions
      .filter((t) => t.type === TransactionType.DEPOSIT)
      .reduce((sum, t) => sum + Number(t.amount), 0);

    const totalExamPayments = transactions
      .filter((t) => t.type === TransactionType.EXAM_PAYMENT)
      .reduce((sum, t) => sum + Number(t.amount), 0);

    const totalRevenue = totalExamPayments;
    const totalDeposited = totalDeposits;

    // Kunlik daromad
    const dailyRevenue = await this.getDailyRevenue(startDate, endDate);

    // Eng ko'p to'lov qilgan foydalanuvchilar
    const topUsers = await this.getTopUsersByDeposits(10);

    // Eng ko'p sotilgan testlar
    const topExams = await this.getTopExams(10);

    return {
      totalRevenue,
      totalDeposited,
      totalTransactions: transactions.length,
      dailyRevenue,
      topUsers,
      topExams,
      period: {
        startDate: startDate || null,
        endDate: endDate || null,
      },
    };
  }

  async getDailyRevenue(startDate?: Date, endDate?: Date) {
    const query = this.transactionRepository
      .createQueryBuilder('transaction')
      .select('DATE(transaction.createdAt)', 'date')
      .addSelect('SUM(transaction.amount)', 'total')
      .where('transaction.type = :type', {
        type: TransactionType.EXAM_PAYMENT,
      })
      .andWhere('transaction.status = :status', {
        status: 'completed',
      })
      .groupBy('DATE(transaction.createdAt)')
      .orderBy('date', 'DESC');

    if (startDate && endDate) {
      query.andWhere('transaction.createdAt BETWEEN :start AND :end', {
        start: startDate,
        end: endDate,
      });
    }

    return query.getRawMany();
  }

  async getTopUsersByDeposits(limit: number = 10) {
    const result = await this.transactionRepository
      .createQueryBuilder('transaction')
      .select('transaction.walletId', 'walletId')
      .addSelect('SUM(transaction.amount)', 'total')
      .where('transaction.type = :type', {
        type: TransactionType.DEPOSIT,
      })
      .andWhere('transaction.status = :status', {
        status: 'completed',
      })
      .groupBy('transaction.walletId')
      .orderBy('total', 'DESC')
      .limit(limit)
      .getRawMany();

    return result;
  }

  async getTopExams(limit: number = 10) {
    const result = await this.examAttemptRepository
      .createQueryBuilder('attempt')
      .select('attempt.examId', 'examId')
      .addSelect('COUNT(attempt.id)', 'totalAttempts')
      .addSelect('SUM(CASE WHEN attempt.isPassed THEN 1 ELSE 0 END)', 'passedCount')
      .groupBy('attempt.examId')
      .orderBy('totalAttempts', 'DESC')
      .limit(limit)
      .getRawMany();

    return result;
  }

  async getExamStatistics(examId: string) {
    const attempts = await this.examAttemptRepository.find({
      where: { examId },
      relations: ['user'],
    });

    const totalAttempts = attempts.length;
    const passedAttempts = attempts.filter((a) => a.isPassed).length;
    const averageScore = attempts.reduce((sum, a) => sum + (a.percentage || 0), 0) / totalAttempts || 0;
    const averagePercentage = attempts.reduce((sum, a) => sum + (a.percentage || 0), 0) / totalAttempts || 0;

    return {
      examId,
      totalAttempts,
      passedAttempts,
      failedAttempts: totalAttempts - passedAttempts,
      passRate: totalAttempts > 0 ? (passedAttempts / totalAttempts) * 100 : 0,
      averageScore,
      averagePercentage,
    };
  }

  async getAllTransactions(limit: number = 100) {
    return this.transactionRepository.find({
      relations: ['wallet', 'wallet.user'],
      order: { createdAt: 'DESC' },
      take: limit,
    });
  }

  async getAllExamAttempts(limit: number = 100) {
    return this.examAttemptRepository.find({
      relations: ['user', 'exam'],
      order: { createdAt: 'DESC' },
      take: limit,
    });
  }
}
