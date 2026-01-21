import { useQuery } from '@tanstack/react-query';
import { Link } from 'react-router-dom';
import api from '../../services/api';

export default function AdminDashboard() {
  const { data: userStats } = useQuery({
    queryKey: ['admin-user-stats'],
    queryFn: async () => {
      const res = await api.get('/admin/users/stats');
      return res.data;
    },
  });

  const { data: financeStats } = useQuery({
    queryKey: ['admin-finance-stats'],
    queryFn: async () => {
      const res = await api.get('/admin/finance/stats');
      return res.data;
    },
  });

  return (
    <div className="px-4 py-6">
      <h1 className="text-3xl font-bold text-gray-900 mb-6">Admin Boshqaruv Paneli</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-lg font-medium text-gray-500 mb-2">Jami foydalanuvchilar</h3>
          <p className="text-3xl font-bold text-blue-600">
            {userStats?.totalUsers || 0}
          </p>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-lg font-medium text-gray-500 mb-2">Faol foydalanuvchilar</h3>
          <p className="text-3xl font-bold text-green-600">
            {userStats?.activeUsers || 0}
          </p>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-lg font-medium text-gray-500 mb-2">Umumiy daromad</h3>
          <p className="text-3xl font-bold text-purple-600">
            {financeStats?.totalRevenue?.toLocaleString('uz-UZ') || 0} so'm
          </p>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-lg font-medium text-gray-500 mb-2">To'ldirilgan summa</h3>
          <p className="text-3xl font-bold text-orange-600">
            {financeStats?.totalDeposited?.toLocaleString('uz-UZ') || 0} so'm
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Link
          to="/admin/exams"
          className="bg-white rounded-lg shadow p-6 hover:shadow-lg transition-shadow"
        >
          <h3 className="text-xl font-bold text-gray-900 mb-2">Testlar</h3>
          <p className="text-gray-600">Testlarni boshqarish</p>
        </Link>

        <Link
          to="/admin/users"
          className="bg-white rounded-lg shadow p-6 hover:shadow-lg transition-shadow"
        >
          <h3 className="text-xl font-bold text-gray-900 mb-2">Foydalanuvchilar</h3>
          <p className="text-gray-600">Foydalanuvchilarni boshqarish</p>
        </Link>

        <Link
          to="/admin/finance"
          className="bg-white rounded-lg shadow p-6 hover:shadow-lg transition-shadow"
        >
          <h3 className="text-xl font-bold text-gray-900 mb-2">Moliya</h3>
          <p className="text-gray-600">Moliya tahlili</p>
        </Link>
      </div>
    </div>
  );
}
