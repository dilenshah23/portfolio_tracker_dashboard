'use client';

import { useState } from 'react';
import { Plus } from 'lucide-react';
import { Button } from '@/components/ui';
import { PortfolioSummary, HoldingsTable, PerformanceChart } from '@/components/dashboard';
import { AddHoldingForm } from '@/components/holdings';
import { usePortfolioWithPrices } from '@/hooks/usePortfolio';
import { useDeleteHolding } from '@/hooks/useHoldings';

export default function DashboardPage() {
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const { holdings, summary, isLoading, error } = usePortfolioWithPrices();
  const deleteHolding = useDeleteHolding();

  const handleDelete = async (id: string) => {
    if (confirm('Are you sure you want to delete this holding?')) {
      await deleteHolding.mutateAsync(id);
    }
  };

  if (error) {
    return (
      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <div className="rounded-lg bg-red-50 p-4 text-red-600">
          Failed to load portfolio data. Please try again.
        </div>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      {/* Header */}
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
          <p className="mt-1 text-sm text-gray-500">
            Track your portfolio performance in real-time
          </p>
        </div>
        <Button onClick={() => setIsAddModalOpen(true)}>
          <Plus className="mr-2 h-4 w-4" />
          Add Holding
        </Button>
      </div>

      {/* Portfolio Summary Cards */}
      <PortfolioSummary summary={summary} isLoading={isLoading} />

      {/* Charts and Holdings */}
      <div className="mt-8 grid gap-8 lg:grid-cols-1">
        {/* Performance Chart */}
        <PerformanceChart />

        {/* Holdings Table */}
        <HoldingsTable
          holdings={holdings}
          isLoading={isLoading}
          onDelete={handleDelete}
        />
      </div>

      {/* Add Holding Modal */}
      <AddHoldingForm isOpen={isAddModalOpen} onClose={() => setIsAddModalOpen(false)} />
    </div>
  );
}
