import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { ExamAttempt } from './exam-attempt.entity';
import { Question } from './question.entity';
import { Answer } from './answer.entity';

@Entity('exam_answers')
export class ExamAnswer {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  attemptId: string;

  @Column()
  questionId: string;

  @Column()
  answerId: string; // Tanlangan javob

  @Column({ default: false })
  isCorrect: boolean;

  @CreateDateColumn()
  createdAt: Date;

  // Relations
  @ManyToOne(() => ExamAttempt, (attempt) => attempt.answers)
  @JoinColumn({ name: 'attemptId' })
  attempt: ExamAttempt;

  @ManyToOne(() => Question)
  @JoinColumn({ name: 'questionId' })
  question: Question;

  @ManyToOne(() => Answer)
  @JoinColumn({ name: 'answerId' })
  answer: Answer;
}
