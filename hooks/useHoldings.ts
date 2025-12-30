'use client';

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import type { Holding, AddHoldingFormData } from '@/types';

async function fetchHoldings(): Promise<Holding[]> {
  const response = await fetch('/api/holdings');
  if (!response.ok) {
    throw new Error('Failed to fetch holdings');
  }
  return response.json();
}

async function createHolding(data: AddHoldingFormData): Promise<Holding> {
  const response = await fetch('/api/holdings', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });
  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message || 'Failed to create holding');
  }
  return response.json();
}

async function deleteHolding(id: string): Promise<void> {
  const response = await fetch(`/api/holdings/${id}`, {
    method: 'DELETE',
  });
  if (!response.ok) {
    throw new Error('Failed to delete holding');
  }
}

async function updateHolding({ id, ...data }: Partial<AddHoldingFormData> & { id: string }): Promise<Holding> {
  const response = await fetch(`/api/holdings/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });
  if (!response.ok) {
    throw new Error('Failed to update holding');
  }
  return response.json();
}

export function useHoldings() {
  return useQuery({
    queryKey: ['holdings'],
    queryFn: fetchHoldings,
  });
}

export function useCreateHolding() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: createHolding,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['holdings'] });
    },
  });
}

export function useDeleteHolding() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: deleteHolding,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['holdings'] });
    },
  });
}

export function useUpdateHolding() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: updateHolding,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['holdings'] });
    },
  });
}
