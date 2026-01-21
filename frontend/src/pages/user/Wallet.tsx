import { useState } from 'react';
import { useQuery, useMutation } from '@tanstack/react-query';
import api from '../../services/api';
import toast from 'react-hot-toast';

export default function Wallet() {
  const [amount, setAmount] = useState(10000);

  const { data: balance, refetch } = useQuery({
    queryKey: ['wallet-balance'],
    queryFn: async () => {
      const res = await api.get('/wallet/balance');
      return res.data;
    },
  });

  const { data: transactions } = useQuery({
    queryKey: ['transactions'],
    queryFn: async () => {
      const res = await api.get('/wallet/transactions');
      return res.data;
    },
  });

  const createPaymentMutation = useMutation({
    mutationFn: async (provider: 'click' | 'payme') => {
      const res = await api.post(`/payment/${provider}/create`, { amount });
      return res.data;
    },
    onSuccess: (data, provider) => {
      if (provider === 'click') {
        // Click uchun to'lov sahifasiga o'tish
        window.open(data.paymentUrl, '_blank');
      } else {
        // Payme uchun
        toast.info('Payme integratsiyasi tez orada qo\'shiladi');
      }
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || 'Xatolik yuz berdi');
    },
  });

  return (
    <div className="px-4 py-6 max-w-4xl mx-auto">
      <h1 className="text-3xl font-bold text-gray-900 mb-6">Balans</h1>

      <div className="bg-white rounded-lg shadow p-6 mb-6">
        <h2 className="text-lg font-medium text-gray-500 mb-2">Joriy balans</h2>
        <p className="text-4xl font-bold text-blue-600 mb-6">
          {balance?.balance?.toLocaleString('uz-UZ') || 0} so'm
        </p>

        <div className="border-t pt-6">
          <h3 className="text-lg font-medium mb-4">Balansni to'ldirish</h3>
          <div className="flex gap-4">
            <input
              type="number"
              min="1000"
              step="1000"
              value={amount}
              onChange={(e) => setAmount(Number(e.target.value))}
              className="flex-1 px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              placeholder="Summa"
            />
            <button
              onClick={() => createPaymentMutation.mutate('click')}
              disabled={createPaymentMutation.isPending}
              className="bg-green-600 text-white px-6 py-2 rounded-md hover:bg-green-700 disabled:opacity-50"
            >
              Click orqali
            </button>
            <button
              onClick={() => createPaymentMutation.mutate('payme')}
              disabled={createPaymentMutation.isPending}
              className="bg-purple-600 text-white px-6 py-2 rounded-md hover:bg-purple-700 disabled:opacity-50"
            >
              Payme orqali
            </button>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow p-6">
        <h2 className="text-xl font-bold text-gray-900 mb-4">Tranzaksiyalar tarixi</h2>
        {transactions && transactions.length > 0 ? (
          <div className="space-y-4">
            {transactions.map((transaction: any) => (
              <div
                key={transaction.id}
                className="flex justify-between items-center border-b pb-4 last:border-0"
              >
                <div>
                  <p className="font-medium">{transaction.description}</p>
                  <p className="text-sm text-gray-500">
                    {new Date(transaction.createdAt).toLocaleString('uz-UZ')}
                  </p>
                </div>
                <div className="text-right">
                  <p
                    className={`font-bold ${
                      transaction.type === 'deposit'
                        ? 'text-green-600'
                        : 'text-red-600'
                    }`}
                  >
                    {transaction.type === 'deposit' ? '+' : '-'}
                    {Number(transaction.amount).toLocaleString('uz-UZ')} so'm
                  </p>
                  <p className="text-sm text-gray-500">{transaction.status}</p>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-gray-500">Tranzaksiyalar mavjud emas</p>
        )}
      </div>
    </div>
  );
}
