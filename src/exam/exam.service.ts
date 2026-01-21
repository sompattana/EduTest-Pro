import {
  Injectable,
  NotFoundException,
  BadRequestException,
  ForbiddenException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, DataSource } from 'typeorm';
import { Exam } from './entities/exam.entity';
import { Question } from './entities/question.entity';
import { Answer } from './entities/answer.entity';
import {
  ExamAttempt,
  AttemptStatus,
} from './entities/exam-attempt.entity';
import { ExamAnswer } from './entities/exam-answer.entity';
import { WalletService } from '../wallet/wallet.service';
import { CreateExamDto } from './dto/create-exam.dto';
import { StartExamDto } from './dto/start-exam.dto';
import { SubmitExamDto } from './dto/submit-exam.dto';

@Injectable()
export class ExamService {
  constructor(
    @InjectRepository(Exam)
    private examRepository: Repository<Exam>,
    @InjectRepository(Question)
    private questionRepository: Repository<Question>,
    @InjectRepository(Answer)
    private answerRepository: Repository<Answer>,
    @InjectRepository(ExamAttempt)
    private examAttemptRepository: Repository<ExamAttempt>,
    @InjectRepository(ExamAnswer)
    private examAnswerRepository: Repository<ExamAnswer>,
    private walletService: WalletService,
    private dataSource: DataSource,
  ) {}

  // Admin uchun
  async createExam(createExamDto: CreateExamDto): Promise<Exam> {
    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      // Exam yaratish
      const examData = {
        title: createExamDto.title,
        description: createExamDto.description,
        subject: createExamDto.subject,
        price: createExamDto.price,
        duration: createExamDto.duration,
        passingScore: createExamDto.passingScore,
        totalQuestions: createExamDto.questions.length,
      };

      const exam = queryRunner.manager.create(Exam, examData);
      const savedExam = await queryRunner.manager.save(exam);

      // Savollar va javoblarni yaratish
      for (let i = 0; i < createExamDto.questions.length; i++) {
        const questionData = createExamDto.questions[i];
        const question = queryRunner.manager.create(Question, {
          examId: savedExam.id,
          text: questionData.text,
          points: questionData.points,
          order: questionData.order || i + 1,
        });
        const savedQuestion = await queryRunner.manager.save(question);

        // Javoblarni yaratish
        for (let j = 0; j < questionData.answers.length; j++) {
          const answerData = questionData.answers[j];
          const answer = queryRunner.manager.create(Answer, {
            questionId: savedQuestion.id,
            text: answerData.text,
            isCorrect: answerData.isCorrect,
            order: answerData.order || j + 1,
          });
          await queryRunner.manager.save(answer);
        }
      }

      await queryRunner.commitTransaction();

      // To'liq examni qaytarish
      return await this.getExamById(savedExam.id);
    } catch (error) {
      await queryRunner.rollbackTransaction();
      throw error;
    } finally {
      await queryRunner.release();
    }
  }

  async getAllExams(): Promise<Exam[]> {
    return await this.examRepository.find({
      where: { isActive: true },
      relations: ['questions', 'questions.answers'],
      order: { createdAt: 'DESC' },
    });
  }

  async getExamById(id: string): Promise<Exam> {
    const exam = await this.examRepository.findOne({
      where: { id },
      relations: ['questions', 'questions.answers'],
    });
    if (!exam) {
      throw new NotFoundException('Test topilmadi');
    }
    return exam;
  }

  // Foydalanuvchi uchun
  async getAvailableExams(): Promise<Exam[]> {
    return await this.examRepository.find({
      where: { isActive: true },
      select: ['id', 'title', 'description', 'subject', 'price', 'duration', 'totalQuestions', 'passingScore', 'createdAt'],
      order: { createdAt: 'DESC' },
    });
  }

  async startExam(userId: string, startExamDto: StartExamDto): Promise<ExamAttempt> {
    const { examId } = startExamDto;

    const exam = await this.getExamById(examId);
    if (!exam.isActive) {
      throw new BadRequestException('Bu test hozir mavjud emas');
    }

    // Balansni tekshirish va to'lovni amalga oshirish
    const balance = await this.walletService.getBalance(userId);
    if (balance < Number(exam.price)) {
      throw new BadRequestException('Balansda yetarli mablag\' yo\'q');
    }

    // To'lovni amalga oshirish
    await this.walletService.payForExam(userId, Number(exam.price), examId);

    // Test boshlash
    const attempt = this.examAttemptRepository.create({
      userId,
      examId,
      status: AttemptStatus.IN_PROGRESS,
      startedAt: new Date(),
    });

    return await this.examAttemptRepository.save(attempt);
  }

  async getExamForAttempt(
    userId: string,
    attemptId: string,
  ): Promise<{ attempt: ExamAttempt; exam: Exam; timeRemaining: number }> {
    const attempt = await this.examAttemptRepository.findOne({
      where: { id: attemptId, userId },
      relations: ['exam', 'exam.questions', 'exam.questions.answers'],
    });

    if (!attempt) {
      throw new NotFoundException('Test topilmadi');
    }

    if (attempt.status !== AttemptStatus.IN_PROGRESS) {
      throw new BadRequestException('Bu test allaqachon yakunlangan');
    }

    const exam = attempt.exam;
    const durationMs = exam.duration * 60 * 1000; // daqiqadan millisekundga
    const elapsed = Date.now() - attempt.startedAt.getTime();
    const timeRemaining = Math.max(0, durationMs - elapsed);

    // Vaqt tugagan bo'lsa
    if (timeRemaining === 0) {
      attempt.status = AttemptStatus.TIMED_OUT;
      await this.examAttemptRepository.save(attempt);
      throw new BadRequestException('Vaqt tugadi');
    }

    // To'g'ri javoblarni yashirish
    const examWithHiddenAnswers = {
      ...exam,
      questions: exam.questions.map((q) => ({
        ...q,
        answers: q.answers.map((a) => ({
          id: a.id,
          text: a.text,
          order: a.order,
          // isCorrect yashirilgan
        })),
      })),
    };

    return {
      attempt,
      exam: examWithHiddenAnswers as Exam,
      timeRemaining: Math.floor(timeRemaining / 1000), // sekundlarda
    };
  }

  async submitExam(
    userId: string,
    attemptId: string,
    submitExamDto: SubmitExamDto,
  ): Promise<ExamAttempt> {
    const attempt = await this.examAttemptRepository.findOne({
      where: { id: attemptId, userId },
      relations: ['exam', 'exam.questions', 'exam.questions.answers'],
    });

    if (!attempt) {
      throw new NotFoundException('Test topilmadi');
    }

    if (attempt.status !== AttemptStatus.IN_PROGRESS) {
      throw new BadRequestException('Bu test allaqachon yakunlangan');
    }

    // Vaqtni tekshirish
    const exam = attempt.exam;
    const durationMs = exam.duration * 60 * 1000;
    const elapsed = Date.now() - attempt.startedAt.getTime();
    if (elapsed > durationMs) {
      attempt.status = AttemptStatus.TIMED_OUT;
      await this.examAttemptRepository.save(attempt);
      throw new BadRequestException('Vaqt tugadi');
    }

    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      let totalScore = 0;
      let correctAnswers = 0;

      // Har bir javobni tekshirish va saqlash
      for (const answer of submitExamDto.answers) {
        const question = exam.questions.find((q) => q.id === answer.questionId);
        if (!question) continue;

        const selectedAnswer = question.answers.find(
          (a) => a.id === answer.answerId,
        );
        const isCorrect = selectedAnswer?.isCorrect || false;

        if (isCorrect) {
          totalScore += question.points;
          correctAnswers++;
        }

        // Javobni saqlash
        const examAnswer = queryRunner.manager.create(ExamAnswer, {
          attemptId: attempt.id,
          questionId: answer.questionId,
          answerId: answer.answerId,
          isCorrect,
        });
        await queryRunner.manager.save(examAnswer);
      }

      // Natijani hisoblash
      const totalPoints = exam.questions.reduce(
        (sum, q) => sum + q.points,
        0,
      );
      const percentage = totalPoints > 0 ? Math.round((totalScore / totalPoints) * 100) : 0;
      const isPassed = percentage >= exam.passingScore;

      // Attemptni yangilash
      attempt.score = totalScore;
      attempt.percentage = percentage;
      attempt.isPassed = isPassed;
      attempt.status = AttemptStatus.COMPLETED;
      attempt.completedAt = new Date();

      await queryRunner.manager.save(attempt);
      await queryRunner.commitTransaction();

      return attempt;
    } catch (error) {
      await queryRunner.rollbackTransaction();
      throw error;
    } finally {
      await queryRunner.release();
    }
  }

  async getAttemptResult(
    userId: string,
    attemptId: string,
  ): Promise<{
    attempt: ExamAttempt;
    exam: Exam;
    answers: ExamAnswer[];
    correctCount: number;
    totalQuestions: number;
  }> {
    const attempt = await this.examAttemptRepository.findOne({
      where: { id: attemptId, userId },
      relations: ['exam', 'exam.questions', 'exam.questions.answers'],
    });

    if (!attempt) {
      throw new NotFoundException('Test topilmadi');
    }

    const answers = await this.examAnswerRepository.find({
      where: { attemptId: attempt.id },
      relations: ['question', 'answer'],
    });

    const correctCount = answers.filter((a) => a.isCorrect).length;

    return {
      attempt,
      exam: attempt.exam,
      answers,
      correctCount,
      totalQuestions: attempt.exam.questions.length,
    };
  }

  async getUserAttempts(userId: string): Promise<ExamAttempt[]> {
    return await this.examAttemptRepository.find({
      where: { userId },
      relations: ['exam'],
      order: { createdAt: 'DESC' },
    });
  }

  async getLeaderboard(examId: string, limit: number = 10) {
    const attempts = await this.examAttemptRepository.find({
      where: { examId, status: AttemptStatus.COMPLETED },
      relations: ['user'],
      order: { percentage: 'DESC', score: 'DESC' },
      take: limit,
    });

    return attempts.map((attempt, index) => ({
      rank: index + 1,
      user: {
        firstName: attempt.user.firstName,
        lastName: attempt.user.lastName,
      },
      score: attempt.score,
      percentage: attempt.percentage,
      isPassed: attempt.isPassed,
      completedAt: attempt.completedAt,
    }));
  }
}
