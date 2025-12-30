'use client';

import { Card, CardContent } from '@/components/ui';
import { formatCurrency, formatPercent, getGainLossClass } from '@/lib/utils';
import { TrendingUp, TrendingDown, DollarSign, PieChart } from 'lucide-react';
import type { PortfolioSummary as PortfolioSummaryType } from '@/types';

interface PortfolioSummaryProps {
  summary: PortfolioSummaryType;
  isLoading?: boolean;
}

export function PortfolioSummary({ summary, isLoading }: PortfolioSummaryProps) {
  if (isLoading) {
    return (
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {[...Array(4)].map((_, i) => (
          <Card key={i} className="animate-pulse">
            <CardContent className="p-6">
              <div className="h-4 w-20 rounded bg-gray-200" />
              <div className="mt-2 h-8 w-32 rounded bg-gray-200" />
              <div className="mt-1 h-4 w-16 rounded bg-gray-200" />
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  const stats = [
    {
      title: 'Total Value',
      value: formatCurrency(summary.totalValue),
      icon: DollarSign,
      iconColor: 'text-blue-600',
      iconBg: 'bg-blue-100',
    },
    {
      title: 'Total Cost',
      value: formatCurrency(summary.totalCost),
      icon: PieChart,
      iconColor: 'text-purple-600',
      iconBg: 'bg-purple-100',
    },
    {
      title: 'Total Gain/Loss',
      value: formatCurrency(summary.totalGain),
      change: formatPercent(summary.totalGainPercent),
      icon: summary.totalGain >= 0 ? TrendingUp : TrendingDown,
      iconColor: summary.totalGain >= 0 ? 'text-green-600' : 'text-red-600',
      iconBg: summary.totalGain >= 0 ? 'bg-green-100' : 'bg-red-100',
      valueClass: getGainLossClass(summary.totalGain),
    },
    {
      title: "Today's Change",
      value: formatCurrency(summary.dayChange),
      change: formatPercent(summary.dayChangePercent),
      icon: summary.dayChange >= 0 ? TrendingUp : TrendingDown,
      iconColor: summary.dayChange >= 0 ? 'text-green-600' : 'text-red-600',
      iconBg: summary.dayChange >= 0 ? 'bg-green-100' : 'bg-red-100',
      valueClass: getGainLossClass(summary.dayChange),
    },
  ];

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      {stats.map((stat) => (
        <Card key={stat.title}>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <p className="text-sm font-medium text-gray-500">{stat.title}</p>
              <div className={`rounded-full p-2 ${stat.iconBg}`}>
                <stat.icon className={`h-4 w-4 ${stat.iconColor}`} />
              </div>
            </div>
            <p className={`mt-2 text-2xl font-bold ${stat.valueClass || 'text-gray-900'}`}>
              {stat.value}
            </p>
            {stat.change && (
              <p className={`mt-1 text-sm ${stat.valueClass || 'text-gray-500'}`}>
                {stat.change}
              </p>
            )}
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
