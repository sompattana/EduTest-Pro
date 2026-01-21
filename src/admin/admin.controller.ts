import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  UseGuards,
  Query,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { AdminService } from './admin.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { UserRole } from '../user/entities/user.entity';
import { CreateExamDto } from '../exam/dto/create-exam.dto';

@ApiTags('Admin')
@Controller('admin')
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles(UserRole.ADMIN)
@ApiBearerAuth()
export class AdminController {
  constructor(private readonly adminService: AdminService) {}

  // Foydalanuvchilar boshqaruvi
  @Get('users')
  @ApiOperation({ summary: 'Barcha foydalanuvchilar' })
  async getAllUsers() {
    return this.adminService.getAllUsers();
  }

  @Get('users/stats')
  @ApiOperation({ summary: 'Foydalanuvchilar statistikasi' })
  async getUserStats() {
    return this.adminService.getUserStats();
  }

  @Get('users/:id')
  @ApiOperation({ summary: 'Foydalanuvchi ma\'lumotlari' })
  async getUserById(@Param('id') id: string) {
    return this.adminService.getUserById(id);
  }

  // Testlar boshqaruvi
  @Post('exams')
  @ApiOperation({ summary: 'Yangi test yaratish' })
  async createExam(@Body() createExamDto: CreateExamDto) {
    return this.adminService.createExam(createExamDto);
  }

  @Get('exams')
  @ApiOperation({ summary: 'Barcha testlar' })
  async getAllExams() {
    return this.adminService.getAllExams();
  }

  @Get('exams/:id')
  @ApiOperation({ summary: 'Test ma\'lumotlari' })
  async getExamById(@Param('id') id: string) {
    return this.adminService.getExamById(id);
  }

  @Get('exams/:id/statistics')
  @ApiOperation({ summary: 'Test statistikasi' })
  async getExamStatistics(@Param('id') id: string) {
    return this.adminService.getExamStatistics(id);
  }

  // Moliya tahlili
  @Get('finance/stats')
  @ApiOperation({ summary: 'Moliya statistikasi' })
  async getFinancialStats(
    @Query('startDate') startDate?: string,
    @Query('endDate') endDate?: string,
  ) {
    const start = startDate ? new Date(startDate) : undefined;
    const end = endDate ? new Date(endDate) : undefined;
    return this.adminService.getFinancialStats(start, end);
  }

  @Get('finance/transactions')
  @ApiOperation({ summary: 'Barcha tranzaksiyalar' })
  async getAllTransactions(@Query('limit') limit?: number) {
    return this.adminService.getAllTransactions(
      limit ? parseInt(limit.toString()) : 100,
    );
  }

  @Get('finance/daily-revenue')
  @ApiOperation({ summary: 'Kunlik daromad' })
  async getDailyRevenue(
    @Query('startDate') startDate?: string,
    @Query('endDate') endDate?: string,
  ) {
    const start = startDate ? new Date(startDate) : undefined;
    const end = endDate ? new Date(endDate) : undefined;
    return this.adminService.getDailyRevenue(start, end);
  }

  // Testlar statistikasi
  @Get('exams/attempts')
  @ApiOperation({ summary: 'Barcha test topshirishlar' })
  async getAllExamAttempts(@Query('limit') limit?: number) {
    return this.adminService.getAllExamAttempts(
      limit ? parseInt(limit.toString()) : 100,
    );
  }
}
