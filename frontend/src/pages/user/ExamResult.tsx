import { useQuery } from '@tanstack/react-query';
import { useParams, Link } from 'react-router-dom';
import api from '../../services/api';

export default function ExamResult() {
  const { attemptId } = useParams();

  const { data, isLoading } = useQuery({
    queryKey: ['exam-result', attemptId],
    queryFn: async () => {
      const res = await api.get(`/exam/result/${attemptId}`);
      return res.data;
    },
  });

  if (isLoading) {
    return <div className="px-4 py-6">Yuklanmoqda...</div>;
  }

  if (!data) {
    return <div className="px-4 py-6">Natija topilmadi</div>;
  }

  const { attempt, exam, answers, correctCount, totalQuestions } = data;

  return (
    <div className="px-4 py-6 max-w-4xl mx-auto">
      <div className="bg-white rounded-lg shadow p-6 mb-6">
        <h1 className="text-3xl font-bold text-gray-900 mb-6">{exam.title}</h1>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
          <div className="text-center p-4 bg-blue-50 rounded-lg">
            <p className="text-sm text-gray-500 mb-2">Olingan ball</p>
            <p className="text-3xl font-bold text-blue-600">{attempt.score}</p>
          </div>
          <div className="text-center p-4 bg-purple-50 rounded-lg">
            <p className="text-sm text-gray-500 mb-2">Foiz</p>
            <p className="text-3xl font-bold text-purple-600">{attempt.percentage}%</p>
          </div>
          <div className={`text-center p-4 rounded-lg ${attempt.isPassed ? 'bg-green-50' : 'bg-red-50'}`}>
            <p className="text-sm text-gray-500 mb-2">Natija</p>
            <p className={`text-3xl font-bold ${attempt.isPassed ? 'text-green-600' : 'text-red-600'}`}>
              {attempt.isPassed ? 'O\'tdi' : 'O\'tmadi'}
            </p>
          </div>
        </div>

        <div className="mb-6">
          <p className="text-gray-700">
            To'g'ri javoblar: <span className="font-bold">{correctCount}</span> / {totalQuestions}
          </p>
        </div>

        <div className="space-y-6">
          <h2 className="text-xl font-bold text-gray-900">Javoblar</h2>
          {exam.questions?.map((question: any, index: number) => {
            const userAnswer = answers.find((a: any) => a.questionId === question.id);
            const correctAnswer = question.answers.find((a: any) => a.isCorrect);

            return (
              <div
                key={question.id}
                className={`border-l-4 p-4 rounded ${
                  userAnswer?.isCorrect
                    ? 'border-green-500 bg-green-50'
                    : 'border-red-500 bg-red-50'
                }`}
              >
                <h3 className="font-medium mb-2">
                  {index + 1}. {question.text}
                </h3>
                <div className="space-y-2">
                  <p className="text-sm">
                    <span className="font-medium">Sizning javobingiz:</span>{' '}
                    <span className={userAnswer?.isCorrect ? 'text-green-600' : 'text-red-600'}>
                      {userAnswer?.answer?.text || 'Javob berilmagan'}
                    </span>
                  </p>
                  {!userAnswer?.isCorrect && (
                    <p className="text-sm">
                      <span className="font-medium">To'g'ri javob:</span>{' '}
                      <span className="text-green-600">{correctAnswer?.text}</span>
                    </p>
                  )}
                </div>
              </div>
            );
          })}
        </div>

        <div className="mt-6 flex justify-center">
          <Link
            to="/exams"
            className="bg-blue-600 text-white px-8 py-3 rounded-md hover:bg-blue-700 font-medium"
          >
            Boshqa testlar
          </Link>
        </div>
      </div>
    </div>
  );
}
