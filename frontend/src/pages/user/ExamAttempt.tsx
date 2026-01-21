import { useQuery, useMutation } from '@tanstack/react-query';
import { useParams, useNavigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import api from '../../services/api';
import toast from 'react-hot-toast';

export default function ExamAttempt() {
  const { attemptId } = useParams();
  const navigate = useNavigate();
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [timeRemaining, setTimeRemaining] = useState(0);

  const { data, isLoading } = useQuery({
    queryKey: ['exam-attempt', attemptId],
    queryFn: async () => {
      const res = await api.get(`/exam/attempt/${attemptId}`);
      return res.data;
    },
    refetchInterval: 5000, // Har 5 soniyada yangilash
  });

  useEffect(() => {
    if (data?.timeRemaining) {
      setTimeRemaining(data.timeRemaining);
      const timer = setInterval(() => {
        setTimeRemaining((prev) => {
          if (prev <= 1) {
            clearInterval(timer);
            handleSubmit();
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
      return () => clearInterval(timer);
    }
  }, [data?.timeRemaining]);

  const submitMutation = useMutation({
    mutationFn: async () => {
      const answerArray = Object.entries(answers).map(([questionId, answerId]) => ({
        questionId,
        answerId,
      }));
      const res = await api.post(`/exam/submit/${attemptId}`, { answers: answerArray });
      return res.data;
    },
    onSuccess: () => {
      toast.success('Test muvaffaqiyatli topshirildi!');
      navigate(`/exam/result/${attemptId}`);
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || 'Xatolik yuz berdi');
    },
  });

  const handleSubmit = () => {
    submitMutation.mutate();
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  if (isLoading) {
    return <div className="px-4 py-6">Yuklanmoqda...</div>;
  }

  if (!data) {
    return <div className="px-4 py-6">Test topilmadi</div>;
  }

  const { exam, attempt } = data;

  return (
    <div className="px-4 py-6 max-w-4xl mx-auto">
      <div className="bg-white rounded-lg shadow p-6 mb-6">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold text-gray-900">{exam.title}</h1>
          <div className="text-right">
            <p className="text-sm text-gray-500">Qolgan vaqt</p>
            <p className={`text-2xl font-bold ${timeRemaining < 60 ? 'text-red-600' : 'text-blue-600'}`}>
              {formatTime(timeRemaining)}
            </p>
          </div>
        </div>

        <div className="space-y-6">
          {exam.questions?.map((question: any, index: number) => (
            <div key={question.id} className="border-b pb-6 last:border-0">
              <h3 className="font-medium text-lg mb-4">
                {index + 1}. {question.text}
              </h3>
              <div className="space-y-2">
                {question.answers?.map((answer: any) => (
                  <label
                    key={answer.id}
                    className={`flex items-center p-3 border rounded-md cursor-pointer hover:bg-gray-50 ${
                      answers[question.id] === answer.id
                        ? 'border-blue-500 bg-blue-50'
                        : 'border-gray-300'
                    }`}
                  >
                    <input
                      type="radio"
                      name={question.id}
                      value={answer.id}
                      checked={answers[question.id] === answer.id}
                      onChange={(e) =>
                        setAnswers({ ...answers, [question.id]: e.target.value })
                      }
                      className="mr-3"
                    />
                    <span>{answer.text}</span>
                  </label>
                ))}
              </div>
            </div>
          ))}
        </div>

        <div className="mt-6 flex justify-end">
          <button
            onClick={handleSubmit}
            disabled={submitMutation.isPending}
            className="bg-blue-600 text-white px-8 py-3 rounded-md hover:bg-blue-700 disabled:opacity-50 font-medium"
          >
            {submitMutation.isPending ? 'Topshirilmoqda...' : 'Topshirish'}
          </button>
        </div>
      </div>
    </div>
  );
}
