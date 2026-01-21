import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  UseGuards,
  Request,
  Query,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { ExamService } from './exam.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { StartExamDto } from './dto/start-exam.dto';
import { SubmitExamDto } from './dto/submit-exam.dto';

@ApiTags('Exam')
@Controller('exam')
export class ExamController {
  constructor(private readonly examService: ExamService) {}

  @Get('available')
  @ApiOperation({ summary: 'Mavjud testlar ro\'yxati' })
  async getAvailableExams() {
    return this.examService.getAvailableExams();
  }

  @Get('available/:id')
  @ApiOperation({ summary: 'Test ma\'lumotlari' })
  async getExamInfo(@Param('id') id: string) {
    const exam = await this.examService.getExamById(id);
    return {
      id: exam.id,
      title: exam.title,
      description: exam.description,
      subject: exam.subject,
      price: exam.price,
      duration: exam.duration,
      totalQuestions: exam.totalQuestions,
      passingScore: exam.passingScore,
    };
  }

  @Post('start')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Testni boshlash' })
  async startExam(@Request() req, @Body() startExamDto: StartExamDto) {
    return this.examService.startExam(req.user.id, startExamDto);
  }

  @Get('attempt/:attemptId')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Testni davom ettirish' })
  async getExamForAttempt(
    @Request() req,
    @Param('attemptId') attemptId: string,
  ) {
    return this.examService.getExamForAttempt(req.user.id, attemptId);
  }

  @Post('submit/:attemptId')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Testni topshirish' })
  async submitExam(
    @Request() req,
    @Param('attemptId') attemptId: string,
    @Body() submitExamDto: SubmitExamDto,
  ) {
    return this.examService.submitExam(req.user.id, attemptId, submitExamDto);
  }

  @Get('result/:attemptId')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Test natijasi' })
  async getAttemptResult(
    @Request() req,
    @Param('attemptId') attemptId: string,
  ) {
    return this.examService.getAttemptResult(req.user.id, attemptId);
  }

  @Get('my-attempts')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Mening testlarim' })
  async getMyAttempts(@Request() req) {
    return this.examService.getUserAttempts(req.user.id);
  }

  @Get('leaderboard/:examId')
  @ApiOperation({ summary: 'Reyting jadvali' })
  async getLeaderboard(
    @Param('examId') examId: string,
    @Query('limit') limit?: number,
  ) {
    return this.examService.getLeaderboard(
      examId,
      limit ? parseInt(limit.toString()) : 10,
    );
  }
}
