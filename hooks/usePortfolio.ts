'use client';

import { useQuery } from '@tanstack/react-query';
import { useMemo } from 'react';
import { useHoldings } from './useHoldings';
import { usePrices } from './usePrices';
import type { HoldingWithPrice, PortfolioSummary, ChartDataPoint } from '@/types';

export function usePortfolioWithPrices() {
  const { data: holdings, isLoading: holdingsLoading, error: holdingsError } = useHoldings();

  const symbols = useMemo(() => {
    if (!holdings) return [];
    return Array.from(new Set(holdings.map(h => h.symbol)));
  }, [holdings]);

  const { data: prices, isLoading: pricesLoading, error: pricesError } = usePrices(symbols);

  const holdingsWithPrices: HoldingWithPrice[] = useMemo(() => {
    if (!holdings || !prices) return [];

    return holdings.map(holding => {
      const quote = prices[holding.symbol];
      const currentPrice = quote?.price || holding.purchasePrice;
      const currentValue = currentPrice * holding.quantity;
      const costBasis = holding.purchasePrice * holding.quantity;
      const totalGain = currentValue - costBasis;
      const totalGainPercent = costBasis > 0 ? (totalGain / costBasis) * 100 : 0;
      const dayChange = (quote?.change || 0) * holding.quantity;
      const dayChangePercent = quote?.changePercent || 0;

      return {
        ...holding,
        purchaseDate: new Date(holding.purchaseDate),
        createdAt: new Date(holding.createdAt),
        updatedAt: new Date(holding.updatedAt),
        currentPrice,
        currentValue,
        totalGain,
        totalGainPercent,
        dayChange,
        dayChangePercent,
      };
    });
  }, [holdings, prices]);

  const summary: PortfolioSummary = useMemo(() => {
    const totalValue = holdingsWithPrices.reduce((sum, h) => sum + h.currentValue, 0);
    const totalCost = holdingsWithPrices.reduce((sum, h) => sum + h.purchasePrice * h.quantity, 0);
    const totalGain = totalValue - totalCost;
    const totalGainPercent = totalCost > 0 ? (totalGain / totalCost) * 100 : 0;
    const dayChange = holdingsWithPrices.reduce((sum, h) => sum + h.dayChange, 0);
    const dayChangePercent = totalValue > 0 ? (dayChange / (totalValue - dayChange)) * 100 : 0;

    return {
      totalValue,
      totalCost,
      totalGain,
      totalGainPercent,
      dayChange,
      dayChangePercent,
    };
  }, [holdingsWithPrices]);

  return {
    holdings: holdingsWithPrices,
    summary,
    isLoading: holdingsLoading || pricesLoading,
    error: holdingsError || pricesError,
  };
}

async function fetchPortfolioHistory(range: string): Promise<ChartDataPoint[]> {
  const response = await fetch(`/api/portfolio/history?range=${range}`);
  if (!response.ok) {
    throw new Error('Failed to fetch portfolio history');
  }
  return response.json();
}

export function usePortfolioHistory(range: string = '1M') {
  return useQuery({
    queryKey: ['portfolioHistory', range],
    queryFn: () => fetchPortfolioHistory(range),
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
}
