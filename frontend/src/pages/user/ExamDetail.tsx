import { useQuery, useMutation } from '@tanstack/react-query';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../../services/api';
import toast from 'react-hot-toast';

export default function ExamDetail() {
  const { id } = useParams();
  const navigate = useNavigate();

  const { data: exam, isLoading } = useQuery({
    queryKey: ['exam', id],
    queryFn: async () => {
      const res = await api.get(`/exam/available/${id}`);
      return res.data;
    },
  });

  const startMutation = useMutation({
    mutationFn: async () => {
      const res = await api.post('/exam/start', { examId: id });
      return res.data;
    },
    onSuccess: (data) => {
      toast.success('Test boshlandi!');
      navigate(`/exam/attempt/${data.id}`);
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || 'Xatolik yuz berdi');
    },
  });

  if (isLoading) {
    return <div className="px-4 py-6">Yuklanmoqda...</div>;
  }

  if (!exam) {
    return <div className="px-4 py-6">Test topilmadi</div>;
  }

  return (
    <div className="px-4 py-6 max-w-4xl mx-auto">
      <h1 className="text-3xl font-bold text-gray-900 mb-6">{exam.title}</h1>

      <div className="bg-white rounded-lg shadow p-6 mb-6">
        <p className="text-gray-700 mb-6">{exam.description}</p>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
          <div>
            <p className="text-sm text-gray-500">Fan</p>
            <p className="font-medium">{exam.subject}</p>
          </div>
          <div>
            <p className="text-sm text-gray-500">Savollar soni</p>
            <p className="font-medium">{exam.totalQuestions}</p>
          </div>
          <div>
            <p className="text-sm text-gray-500">Vaqt</p>
            <p className="font-medium">{exam.duration} daqiqa</p>
          </div>
          <div>
            <p className="text-sm text-gray-500">Minimal ball</p>
            <p className="font-medium">{exam.passingScore}%</p>
          </div>
        </div>

        <div className="border-t pt-6">
          <div className="flex justify-between items-center">
            <div>
              <p className="text-sm text-gray-500">Narx</p>
              <p className="text-3xl font-bold text-blue-600">
                {exam.price?.toLocaleString('uz-UZ')} so'm
              </p>
            </div>
            <button
              onClick={() => startMutation.mutate()}
              disabled={startMutation.isPending}
              className="bg-blue-600 text-white px-8 py-3 rounded-md hover:bg-blue-700 disabled:opacity-50 font-medium"
            >
              {startMutation.isPending ? 'Kutilmoqda...' : 'Testni boshlash'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
