'use client';

import React from 'react';
import {
  TrendingUp,
  ShoppingBag,
  Users,
  LineChart,
  Star,
  ArrowUpRight,
  ArrowDownRight,
  Clock,
  ExternalLink,
} from 'lucide-react';
import { useGetAdminOrderStatsQuery, useGetAdminOrdersQuery } from '@/src/redux/api/orderApi';
import { useCurrency } from '@/src/lib/currency';

export default function AdminDashboardPage() {
  const { data: statsData, isLoading: statsLoading } = useGetAdminOrderStatsQuery(undefined);
  const { data: ordersData, isLoading: ordersLoading } = useGetAdminOrdersQuery({ limit: 5 });
  const { formatPrice } = useCurrency();

  const stats = statsData?.data || {
    totalSales: 0,
    orderCount: 0,
    monthlySales: [],
  };

  const recentOrders = ordersData?.data || [];

  const cards = [
    {
      name: 'Gross revenue',
      value: formatPrice(stats.totalSales),
      change: '+14.2%',
      changeType: 'increase',
      icon: LineChart,
      color: 'text-indigo-650 dark:text-indigo-400 bg-indigo-50 dark:bg-indigo-950/40',
    },
    {
      name: 'Transactions logs',
      value: stats.orderCount,
      change: '+8.3%',
      changeType: 'increase',
      icon: ShoppingBag,
      color: 'text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/40',
    },
    {
      name: 'Active customers',
      value: '1,482',
      change: '+18.1%',
      changeType: 'increase',
      icon: Users,
      color: 'text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-950/40',
    },
    {
      name: 'Conversion index',
      value: '4.82%',
      change: '-1.4%',
      changeType: 'decrease',
      icon: TrendingUp,
      color: 'text-amber-600 dark:text-amber-400 bg-amber-50 dark:bg-amber-950/40',
    },
  ];

  return (
    <div className="space-y-8">
      {/* Page Header */}
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-neutral-900 dark:text-white">Admin Dashboard</h1>
        <p className="mt-1.5 text-sm text-neutral-500">
          General business summaries, sales performance insights and real-time transaction streams.
        </p>
      </div>

      {/* Stats Cards grid */}
      <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
        {cards.map((card) => {
          const Icon = card.icon;
          return (
            <div
              key={card.name}
              className="rounded-2xl border border-neutral-200 dark:border-neutral-850 bg-white dark:bg-neutral-900/60 p-5 flex items-center justify-between"
            >
              <div className="space-y-1">
                <span className="text-xs text-neutral-450 uppercase font-bold tracking-wider">{card.name}</span>
                <div className="flex items-baseline gap-2">
                  <span className="text-2xl font-extrabold text-neutral-900 dark:text-white tracking-tight">{card.value}</span>
                  <span
                    className={`inline-flex items-center gap-0.5 text-xs font-semibold ${
                      card.changeType === 'increase' ? 'text-emerald-500' : 'text-rose-500'
                    }`}
                  >
                    {card.changeType === 'increase' ? <ArrowUpRight className="h-3 w-3" /> : <ArrowDownRight className="h-3 w-3" />}
                    {card.change}
                  </span>
                </div>
              </div>

              <div className={`h-11 w-11 rounded-xl flex items-center justify-center ${card.color}`}>
                <Icon className="h-5 w-5" />
              </div>
            </div>
          );
        })}
      </div>

      {/* Chart and Activity Grid */}
      <div className="grid gap-6 lg:grid-cols-[1.6fr_1fr]">
        {/* Sales Chart */}
        <div className="rounded-2xl border border-neutral-200 dark:border-neutral-850 bg-white dark:bg-neutral-900/60 p-6 flex flex-col justify-between">
          <div className="mb-4">
            <h3 className="text-sm font-bold text-neutral-900 dark:text-white">Sales Chart Performance</h3>
            <p className="text-xs text-neutral-450 mt-0.5">Calculated monthly overview</p>
          </div>

          {/* Simple Inline SVG Line Chart */}
          <div className="h-64 w-full relative flex items-end">
            <svg className="w-full h-full" viewBox="0 0 600 240" preserveAspectRatio="none">
              <defs>
                <linearGradient id="chartGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#4f46e5" stopOpacity="0.25" />
                  <stop offset="100%" stopColor="#4f46e5" stopOpacity="0" />
                </linearGradient>
              </defs>
              {/* Grid Lines */}
              <line x1="0" y1="60" x2="600" y2="60" stroke="#888" strokeOpacity="0.08" strokeDasharray="4 4" />
              <line x1="0" y1="120" x2="600" y2="120" stroke="#888" strokeOpacity="0.08" strokeDasharray="4 4" />
              <line x1="0" y1="180" x2="600" y2="180" stroke="#888" strokeOpacity="0.08" strokeDasharray="4 4" />

              {/* Area path */}
              <path
                d="M 0 240 L 50 180 L 150 150 L 250 160 L 350 110 L 450 130 L 550 70 L 600 240 Z"
                fill="url(#chartGradient)"
              />
              {/* Line path */}
              <path
                d="M 50 180 L 150 150 L 250 160 L 350 110 L 450 130 L 550 70"
                fill="none"
                stroke="#4f46e5"
                strokeWidth="3.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              {/* Dots */}
              <circle cx="50" cy="180" r="5" fill="#4f46e5" stroke="#fff" strokeWidth="2" />
              <circle cx="150" cy="150" r="5" fill="#4f46e5" stroke="#fff" strokeWidth="2" />
              <circle cx="250" cy="160" r="5" fill="#4f46e5" stroke="#fff" strokeWidth="2" />
              <circle cx="350" cy="110" r="5" fill="#4f46e5" stroke="#fff" strokeWidth="2" />
              <circle cx="450" cy="130" r="5" fill="#4f46e5" stroke="#fff" strokeWidth="2" />
              <circle cx="550" cy="70" r="5" fill="#4f46e5" stroke="#fff" strokeWidth="2" />
            </svg>
          </div>

          <div className="flex justify-between items-center text-[10px] text-neutral-400 font-bold tracking-wider mt-4 px-2">
            <span>JAN</span>
            <span>FEB</span>
            <span>MAR</span>
            <span>APR</span>
            <span>MAY</span>
            <span>JUN</span>
          </div>
        </div>

        {/* Recent Activity Stream */}
        <div className="rounded-2xl border border-neutral-200 dark:border-neutral-850 bg-white dark:bg-neutral-900/60 p-6 flex flex-col justify-between">
          <div>
            <h3 className="text-sm font-bold text-neutral-900 dark:text-white">Recent Operations</h3>
            <p className="text-xs text-neutral-450 mt-0.5">Real-time system events</p>
          </div>

          <div className="mt-5 space-y-4 flex-1">
            {[
              { label: 'Template created', desc: 'Aurora dashboard starter catalog added', time: '10 min ago' },
              { label: 'Role permissions edited', desc: 'Admin role mapped with write.catalog settings', time: '2 hours ago' },
              { label: 'Transaction verified', desc: 'Stripe order ch_stripe_mock_991823a completed', time: '4 hours ago' },
              { label: 'Maintenance mode toggled', desc: 'Status switched to active check offline', time: '1 day ago' },
            ].map((act, i) => (
              <div key={i} className="flex gap-3 text-xs leading-normal">
                <div className="mt-1 h-2 w-2 shrink-0 rounded-full bg-indigo-500" />
                <div className="flex-1 flex flex-col">
                  <span className="font-semibold text-neutral-800 dark:text-neutral-200">{act.label}</span>
                  <span className="text-neutral-450 text-[11px] mt-0.5">{act.desc}</span>
                </div>
                <span className="text-[10px] text-neutral-400 font-medium shrink-0 flex items-center gap-1">
                  <Clock className="h-3 w-3" /> {act.time}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Transactions streams */}
      <div className="rounded-2xl border border-neutral-200 dark:border-neutral-850 bg-white dark:bg-neutral-900/60 p-6">
        <div className="mb-6 flex items-center justify-between">
          <div>
            <h3 className="text-sm font-bold text-neutral-900 dark:text-white">Latest Transactions</h3>
            <p className="text-xs text-neutral-450 mt-0.5">Purchases log</p>
          </div>
          <button className="text-xs font-semibold text-indigo-600 dark:text-indigo-400 hover:underline">
            View All Orders
          </button>
        </div>

        {ordersLoading ? (
          <div className="p-10 text-center text-xs text-neutral-500">Fetching live orders stream...</div>
        ) : recentOrders.length === 0 ? (
          <div className="p-10 text-center text-xs text-neutral-500">No transactions recorded yet.</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="border-b border-neutral-100 dark:border-neutral-800 text-neutral-400 font-bold uppercase tracking-wider">
                  <th className="pb-3 font-semibold">Buyer Name</th>
                  <th className="pb-3 font-semibold">Email address</th>
                  <th className="pb-3 font-semibold">Transaction ID</th>
                  <th className="pb-3 font-semibold">Total Price</th>
                  <th className="pb-3 font-semibold">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-neutral-100 dark:divide-neutral-850 text-neutral-700 dark:text-neutral-300">
                {recentOrders.slice(0, 5).map((order: any) => (
                  <tr key={order._id} className="hover:bg-neutral-50/50 dark:hover:bg-neutral-900/30">
                    <td className="py-3.5 font-semibold text-neutral-900 dark:text-white">{order.buyer_name}</td>
                    <td className="py-3.5">{order.buyer_email}</td>
                    <td className="py-3.5 font-mono text-[10px] text-neutral-450">{order.transaction_id}</td>
                    <td className="py-3.5 font-bold text-neutral-900 dark:text-white">{formatPrice(order.total_price)}</td>
                    <td className="py-3.5">
                      <span className="inline-flex items-center rounded-full bg-emerald-50 dark:bg-emerald-950/30 px-2 py-0.5 text-[10px] font-bold text-emerald-600 dark:text-emerald-450 uppercase tracking-wider">
                        {order.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
