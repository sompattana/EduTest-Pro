import { useQuery } from '@tanstack/react-query';
import { Link } from 'react-router-dom';
import api from '../../services/api';
import { useAuthStore } from '../../store/authStore';

export default function Dashboard() {
  const { user } = useAuthStore();

  const { data: balance } = useQuery({
    queryKey: ['wallet-balance'],
    queryFn: async () => {
      const res = await api.get('/wallet/balance');
      return res.data;
    },
  });

  const { data: attempts } = useQuery({
    queryKey: ['my-attempts'],
    queryFn: async () => {
      const res = await api.get('/exam/my-attempts');
      return res.data;
    },
  });

  return (
    <div className="px-4 py-6">
      <h1 className="text-3xl font-bold text-gray-900 mb-6">
        Xush kelibsiz, {user?.firstName}!
      </h1>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-lg font-medium text-gray-500 mb-2">Balans</h3>
          <p className="text-3xl font-bold text-blue-600">
            {balance?.balance?.toLocaleString('uz-UZ') || 0} so'm
          </p>
          <Link
            to="/wallet"
            className="text-blue-600 hover:text-blue-700 text-sm mt-2 inline-block"
          >
            To'ldirish →
          </Link>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-lg font-medium text-gray-500 mb-2">Topshirilgan testlar</h3>
          <p className="text-3xl font-bold text-green-600">
            {attempts?.length || 0}
          </p>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-lg font-medium text-gray-500 mb-2">O'tkazilgan testlar</h3>
          <p className="text-3xl font-bold text-purple-600">
            {attempts?.filter((a: any) => a.isPassed).length || 0}
          </p>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow p-6">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold text-gray-900">Oxirgi testlar</h2>
          <Link
            to="/exams"
            className="text-blue-600 hover:text-blue-700 text-sm"
          >
            Barcha testlar →
          </Link>
        </div>
        {attempts && attempts.length > 0 ? (
          <div className="space-y-4">
            {attempts.slice(0, 5).map((attempt: any) => (
              <div
                key={attempt.id}
                className="border-b pb-4 last:border-0"
              >
                <div className="flex justify-between items-center">
                  <div>
                    <h3 className="font-medium">{attempt.exam?.title}</h3>
                    <p className="text-sm text-gray-500">
                      {new Date(attempt.createdAt).toLocaleDateString('uz-UZ')}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className={`font-bold ${attempt.isPassed ? 'text-green-600' : 'text-red-600'}`}>
                      {attempt.percentage}%
                    </p>
                    <Link
                      to={`/exam/result/${attempt.id}`}
                      className="text-blue-600 hover:text-blue-700 text-sm"
                    >
                      Natijani ko'rish
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-gray-500">Hali test topshirmadingiz</p>
        )}
      </div>
    </div>
  );
}
