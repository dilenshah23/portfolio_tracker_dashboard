'use client';

import { useState } from 'react';
import { Plus, RefreshCw } from 'lucide-react';
import { Button, Card, CardHeader, CardTitle, CardContent } from '@/components/ui';
import { HoldingsTable } from '@/components/dashboard';
import { AddHoldingForm } from '@/components/holdings';
import { usePortfolioWithPrices } from '@/hooks/usePortfolio';
import { useDeleteHolding } from '@/hooks/useHoldings';
import { useQueryClient } from '@tanstack/react-query';
import { formatCurrency, formatPercent, getGainLossClass } from '@/lib/utils';

export default function HoldingsPage() {
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const { holdings, summary, isLoading, error } = usePortfolioWithPrices();
  const deleteHolding = useDeleteHolding();
  const queryClient = useQueryClient();

  const handleDelete = async (id: string) => {
    if (confirm('Are you sure you want to delete this holding?')) {
      await deleteHolding.mutateAsync(id);
    }
  };

  const handleRefresh = () => {
    queryClient.invalidateQueries({ queryKey: ['holdings'] });
    queryClient.invalidateQueries({ queryKey: ['prices'] });
  };

  if (error) {
    return (
      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <div className="rounded-lg bg-red-50 p-4 text-red-600">
          Failed to load holdings. Please try again.
        </div>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      {/* Header */}
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Holdings</h1>
          <p className="mt-1 text-sm text-gray-500">
            Manage your investment holdings
          </p>
        </div>
        <div className="flex gap-3">
          <Button variant="secondary" onClick={handleRefresh}>
            <RefreshCw className="mr-2 h-4 w-4" />
            Refresh Prices
          </Button>
          <Button onClick={() => setIsAddModalOpen(true)}>
            <Plus className="mr-2 h-4 w-4" />
            Add Holding
          </Button>
        </div>
      </div>

      {/* Quick Stats */}
      <div className="mb-8 grid gap-4 md:grid-cols-3">
        <Card>
          <CardContent className="p-6">
            <p className="text-sm font-medium text-gray-500">Total Holdings</p>
            <p className="mt-2 text-3xl font-bold text-gray-900">{holdings.length}</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <p className="text-sm font-medium text-gray-500">Portfolio Value</p>
            <p className="mt-2 text-3xl font-bold text-gray-900">
              {formatCurrency(summary.totalValue)}
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <p className="text-sm font-medium text-gray-500">Total Gain/Loss</p>
            <p className={`mt-2 text-3xl font-bold ${getGainLossClass(summary.totalGain)}`}>
              {formatCurrency(summary.totalGain)}
              <span className="ml-2 text-lg">
                ({formatPercent(summary.totalGainPercent)})
              </span>
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Holdings Table */}
      <HoldingsTable
        holdings={holdings}
        isLoading={isLoading}
        onDelete={handleDelete}
      />

      {/* Add Holding Modal */}
      <AddHoldingForm isOpen={isAddModalOpen} onClose={() => setIsAddModalOpen(false)} />
    </div>
  );
}
