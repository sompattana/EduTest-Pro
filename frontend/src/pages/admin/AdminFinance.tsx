import { useQuery } from '@tanstack/react-query';
import api from '../../services/api';

export default function AdminFinance() {
  const { data: stats, isLoading } = useQuery({
    queryKey: ['admin-finance-stats'],
    queryFn: async () => {
      const res = await api.get('/admin/finance/stats');
      return res.data;
    },
  });

  const { data: transactions } = useQuery({
    queryKey: ['admin-transactions'],
    queryFn: async () => {
      const res = await api.get('/admin/finance/transactions?limit=50');
      return res.data;
    },
  });

  if (isLoading) {
    return <div className="px-4 py-6">Yuklanmoqda...</div>;
  }

  return (
    <div className="px-4 py-6">
      <h1 className="text-3xl font-bold text-gray-900 mb-6">Moliya Tahlili</h1>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-lg font-medium text-gray-500 mb-2">Umumiy daromad</h3>
          <p className="text-3xl font-bold text-green-600">
            {stats?.totalRevenue?.toLocaleString('uz-UZ') || 0} so'm
          </p>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-lg font-medium text-gray-500 mb-2">To'ldirilgan summa</h3>
          <p className="text-3xl font-bold text-blue-600">
            {stats?.totalDeposited?.toLocaleString('uz-UZ') || 0} so'm
          </p>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-lg font-medium text-gray-500 mb-2">Tranzaksiyalar</h3>
          <p className="text-3xl font-bold text-purple-600">
            {stats?.totalTransactions || 0}
          </p>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-lg font-medium text-gray-500 mb-2">Foyda</h3>
          <p className="text-3xl font-bold text-orange-600">
            {((stats?.totalRevenue || 0) - (stats?.totalDeposited || 0)).toLocaleString('uz-UZ')} so'm
          </p>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow p-6">
        <h2 className="text-xl font-bold text-gray-900 mb-4">Oxirgi tranzaksiyalar</h2>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  Turi
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  Summa
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  Holat
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  Sana
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {transactions?.map((transaction: any) => (
                <tr key={transaction.id}>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">{transaction.type}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-gray-900">
                      {Number(transaction.amount).toLocaleString('uz-UZ')} so'm
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span
                      className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                        transaction.status === 'completed'
                          ? 'bg-green-100 text-green-800'
                          : 'bg-yellow-100 text-yellow-800'
                      }`}
                    >
                      {transaction.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {new Date(transaction.createdAt).toLocaleString('uz-UZ')}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
