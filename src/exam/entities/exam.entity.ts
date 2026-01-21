import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  OneToMany,
} from 'typeorm';
import { Question } from './question.entity';
import { ExamAttempt } from './exam-attempt.entity';

@Entity('exams')
export class Exam {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  title: string;

  @Column({ nullable: true })
  description: string;

  @Column()
  subject: string; // Matematika, Ingliz tili, va hokazo

  @Column({
    type: 'decimal',
    precision: 10,
    scale: 2,
  })
  price: number; // Test narxi (so'm)

  @Column({ type: 'int' })
  duration: number; // Vaqt chegarasi (daqiqa)

  @Column({ type: 'int' })
  totalQuestions: number;

  @Column({ type: 'int' })
  passingScore: number; // Minimal ball (foiz)

  @Column({ default: true })
  isActive: boolean;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  // Relations
  @OneToMany(() => Question, (question) => question.exam, {
    cascade: true,
  })
  questions: Question[];

  @OneToMany(() => ExamAttempt, (attempt) => attempt.exam)
  attempts: ExamAttempt[];
}
