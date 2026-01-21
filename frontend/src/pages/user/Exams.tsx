import { useQuery } from '@tanstack/react-query';
import { Link } from 'react-router-dom';
import api from '../../services/api';

export default function Exams() {
  const { data: exams, isLoading } = useQuery({
    queryKey: ['exams'],
    queryFn: async () => {
      const res = await api.get('/exam/available');
      return res.data;
    },
  });

  if (isLoading) {
    return <div className="px-4 py-6">Yuklanmoqda...</div>;
  }

  return (
    <div className="px-4 py-6">
      <h1 className="text-3xl font-bold text-gray-900 mb-6">Mavjud testlar</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {exams?.map((exam: any) => (
          <div
            key={exam.id}
            className="bg-white rounded-lg shadow hover:shadow-lg transition-shadow p-6"
          >
            <h3 className="text-xl font-bold text-gray-900 mb-2">{exam.title}</h3>
            <p className="text-gray-600 mb-4">{exam.description || 'Tavsif yo\'q'}</p>
            
            <div className="space-y-2 mb-4">
              <div className="flex justify-between text-sm">
                <span className="text-gray-500">Fan:</span>
                <span className="font-medium">{exam.subject}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-500">Savollar:</span>
                <span className="font-medium">{exam.totalQuestions}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-500">Vaqt:</span>
                <span className="font-medium">{exam.duration} daqiqa</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-500">Minimal ball:</span>
                <span className="font-medium">{exam.passingScore}%</span>
              </div>
            </div>

            <div className="flex justify-between items-center pt-4 border-t">
              <span className="text-2xl font-bold text-blue-600">
                {exam.price?.toLocaleString('uz-UZ')} so'm
              </span>
              <Link
                to={`/exams/${exam.id}`}
                className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700"
              >
                Batafsil
              </Link>
            </div>
          </div>
        ))}

        {exams && exams.length === 0 && (
          <div className="col-span-full text-center py-12">
            <p className="text-gray-500">Hozircha testlar mavjud emas</p>
          </div>
        )}
      </div>
    </div>
  );
}
