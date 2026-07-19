'use client';

import React, { useState } from 'react';
import { useGetAdminOrdersQuery } from '@/src/redux/api/adminApi';
import { ShoppingBag, Search, Calendar, ChevronRight, Check } from 'lucide-react';
import { useCurrency } from '@/src/lib/currency';

export default function AdminOrdersPage() {
  const [q, setQ] = useState('');
  const { data, isLoading } = useGetAdminOrdersQuery({ q });
  const { formatPrice } = useCurrency();

  const orders = data?.data || [];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-neutral-200 dark:border-neutral-850 pb-5">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-neutral-900 dark:text-white">Transaction Logs</h1>
          <p className="mt-1.5 text-sm text-neutral-500">Track dynamic buyer payments and catalog deliveries.</p>
        </div>
      </div>

      {/* Search Filter Toolbar */}
      <div className="relative max-w-md">
        <Search className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-neutral-400" />
        <input
          value={q}
          onChange={(e) => setQ(e.target.value)}
          placeholder="Search by buyer name, email, or transaction ID..."
          className="h-10 w-full pl-10 pr-4 rounded-full border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 text-xs outline-none focus:border-indigo-500"
        />
      </div>

      {isLoading ? (
        <div className="p-10 text-center text-xs text-neutral-500">Fetching transaction streams...</div>
      ) : orders.length === 0 ? (
        <div className="p-10 text-center text-xs text-neutral-500">No orders found matching search criteria.</div>
      ) : (
        <div className="rounded-2xl border border-neutral-200 dark:border-neutral-850 bg-white dark:bg-neutral-900/60 p-6 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="border-b border-neutral-100 dark:border-neutral-800 text-neutral-400 font-bold uppercase tracking-wider">
                  <th className="pb-3 font-semibold">Buyer</th>
                  <th className="pb-3 font-semibold">Purchased Items</th>
                  <th className="pb-3 font-semibold">Payment ID</th>
                  <th className="pb-3 font-semibold">Total Cost</th>
                  <th className="pb-3 font-semibold">Date Placed</th>
                  <th className="pb-3 font-semibold">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-neutral-100 dark:divide-neutral-850 text-neutral-700 dark:text-neutral-300">
                {orders.map((order: any) => (
                  <tr key={order._id} className="hover:bg-neutral-50/50 dark:hover:bg-neutral-900/30">
                    <td className="py-4">
                      <div className="flex flex-col">
                        <span className="font-semibold text-neutral-900 dark:text-white">{order.buyer_name}</span>
                        <span className="text-[10px] text-neutral-450 mt-0.5">{order.buyer_email}</span>
                      </div>
                    </td>
                    <td className="py-4">
                      <div className="space-y-1">
                        {order.items.map((item: any, i: number) => (
                          <div key={i} className="flex items-center gap-1.5 font-medium text-neutral-800 dark:text-neutral-200">
                            <span className="text-[9px] uppercase font-bold px-1.5 py-0.5 bg-neutral-100 dark:bg-neutral-800 rounded">
                              {item.item_type}
                            </span>
                            <span>{item.name}</span>
                          </div>
                        ))}
                      </div>
                    </td>
                    <td className="py-4 font-mono text-[10px] text-neutral-450">{order.transaction_id}</td>
                    <td className="py-4 font-bold text-neutral-900 dark:text-white">{formatPrice(order.total_price)}</td>
                    <td className="py-4 text-neutral-500">
                      <span className="inline-flex items-center gap-1">
                        <Calendar className="h-3.5 w-3.5" />
                        {new Date(order.created_at).toLocaleDateString()}
                      </span>
                    </td>
                    <td className="py-4">
                      <span className="inline-flex items-center gap-1 rounded-full bg-emerald-50 dark:bg-emerald-950/30 px-2.5 py-1 text-[10px] font-bold text-emerald-600 dark:text-emerald-450 uppercase tracking-wider">
                        <Check className="h-3 w-3" /> {order.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
export { AdminOrdersPage };
