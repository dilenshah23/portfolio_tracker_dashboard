'use client';

import { Card, CardHeader, CardTitle, CardContent, Button } from '@/components/ui';
import { formatCurrency, formatPercent, formatNumber, formatDate, getGainLossClass } from '@/lib/utils';
import { Trash2, TrendingUp, TrendingDown } from 'lucide-react';
import type { HoldingWithPrice } from '@/types';

interface HoldingsTableProps {
  holdings: HoldingWithPrice[];
  isLoading?: boolean;
  onDelete?: (id: string) => void;
}

export function HoldingsTable({ holdings, isLoading, onDelete }: HoldingsTableProps) {
  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Holdings</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="animate-pulse space-y-4">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="flex items-center gap-4">
                <div className="h-10 w-10 rounded-full bg-gray-200" />
                <div className="flex-1 space-y-2">
                  <div className="h-4 w-24 rounded bg-gray-200" />
                  <div className="h-3 w-16 rounded bg-gray-200" />
                </div>
                <div className="h-4 w-20 rounded bg-gray-200" />
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    );
  }

  if (holdings.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Holdings</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col items-center justify-center py-12 text-center">
            <div className="rounded-full bg-gray-100 p-3">
              <PieChart className="h-6 w-6 text-gray-400" />
            </div>
            <h3 className="mt-4 text-sm font-medium text-gray-900">No holdings yet</h3>
            <p className="mt-1 text-sm text-gray-500">
              Add your first holding to start tracking your portfolio.
            </p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Holdings</CardTitle>
      </CardHeader>
      <CardContent className="p-0">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b bg-gray-50 text-left text-sm font-medium text-gray-500">
                <th className="px-6 py-3">Symbol</th>
                <th className="px-6 py-3">Shares</th>
                <th className="px-6 py-3">Price</th>
                <th className="px-6 py-3">Value</th>
                <th className="px-6 py-3">Cost Basis</th>
                <th className="px-6 py-3">Gain/Loss</th>
                <th className="px-6 py-3">Day Change</th>
                <th className="px-6 py-3">Purchase Date</th>
                <th className="px-6 py-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {holdings.map((holding) => (
                <tr key={holding.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4">
                    <div>
                      <p className="font-semibold text-gray-900">{holding.symbol}</p>
                      <p className="text-sm text-gray-500">{holding.name}</p>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-gray-900">
                    {formatNumber(holding.quantity)}
                  </td>
                  <td className="px-6 py-4 text-gray-900">
                    {formatCurrency(holding.currentPrice)}
                  </td>
                  <td className="px-6 py-4 font-medium text-gray-900">
                    {formatCurrency(holding.currentValue)}
                  </td>
                  <td className="px-6 py-4 text-gray-600">
                    {formatCurrency(holding.purchasePrice * holding.quantity)}
                  </td>
                  <td className="px-6 py-4">
                    <div className={`flex items-center gap-1 ${getGainLossClass(holding.totalGain)}`}>
                      {holding.totalGain >= 0 ? (
                        <TrendingUp className="h-4 w-4" />
                      ) : (
                        <TrendingDown className="h-4 w-4" />
                      )}
                      <span className="font-medium">{formatCurrency(holding.totalGain)}</span>
                      <span className="text-sm">({formatPercent(holding.totalGainPercent)})</span>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className={getGainLossClass(holding.dayChange)}>
                      <span>{formatCurrency(holding.dayChange)}</span>
                      <span className="ml-1 text-sm">({formatPercent(holding.dayChangePercent)})</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-gray-600">
                    {formatDate(holding.purchaseDate)}
                  </td>
                  <td className="px-6 py-4 text-right">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => onDelete?.(holding.id)}
                      className="text-gray-400 hover:text-red-600"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </CardContent>
    </Card>
  );
}

function PieChart({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      viewBox="0 0 24 24"
    >
      <path d="M21.21 15.89A10 10 0 1 1 8 2.83" />
      <path d="M22 12A10 10 0 0 0 12 2v10z" />
    </svg>
  );
}
