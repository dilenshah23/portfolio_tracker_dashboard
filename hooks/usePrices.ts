'use client';

import { useQuery } from '@tanstack/react-query';
import type { StockQuote } from '@/types';

async function fetchPrices(symbols: string[]): Promise<Record<string, StockQuote>> {
  if (symbols.length === 0) {
    return {};
  }

  const response = await fetch(`/api/prices?symbols=${symbols.join(',')}&mock=true`);
  if (!response.ok) {
    throw new Error('Failed to fetch prices');
  }
  return response.json();
}

export function usePrices(symbols: string[]) {
  return useQuery({
    queryKey: ['prices', symbols.sort().join(',')],
    queryFn: () => fetchPrices(symbols),
    enabled: symbols.length > 0,
    refetchInterval: 5 * 60 * 1000, // Refetch every 5 minutes
    staleTime: 60 * 1000, // Consider data stale after 1 minute
  });
}
