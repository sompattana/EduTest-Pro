import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  OneToMany,
  JoinColumn,
} from 'typeorm';
import { User } from '../../user/entities/user.entity';
import { Exam } from './exam.entity';
import { ExamAnswer } from './exam-answer.entity';

export enum AttemptStatus {
  IN_PROGRESS = 'in_progress',
  COMPLETED = 'completed',
  TIMED_OUT = 'timed_out',
}

@Entity('exam_attempts')
export class ExamAttempt {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  userId: string;

  @Column()
  examId: string;

  @Column({
    type: 'enum',
    enum: AttemptStatus,
    default: AttemptStatus.IN_PROGRESS,
  })
  status: AttemptStatus;

  @Column({ type: 'int', nullable: true })
  score: number; // Olingan ball

  @Column({ type: 'int', nullable: true })
  percentage: number; // Foiz

  @Column({ default: false })
  isPassed: boolean;

  @Column({ type: 'timestamp' })
  startedAt: Date;

  @Column({ type: 'timestamp', nullable: true })
  completedAt: Date;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  // Relations
  @ManyToOne(() => User, (user) => user.examAttempts)
  @JoinColumn({ name: 'userId' })
  user: User;

  @ManyToOne(() => Exam, (exam) => exam.attempts)
  @JoinColumn({ name: 'examId' })
  exam: Exam;

  @OneToMany(() => ExamAnswer, (examAnswer) => examAnswer.attempt, {
    cascade: true,
  })
  answers: ExamAnswer[];
}
