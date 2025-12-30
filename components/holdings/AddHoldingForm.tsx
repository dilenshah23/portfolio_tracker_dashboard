'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Button, Input, Modal } from '@/components/ui';
import { useCreateHolding } from '@/hooks/useHoldings';

const schema = z.object({
  symbol: z
    .string()
    .min(1, 'Symbol is required')
    .max(10, 'Symbol is too long')
    .transform((val) => val.toUpperCase()),
  name: z
    .string()
    .min(1, 'Company name is required')
    .max(100, 'Name is too long'),
  quantity: z
    .number({ invalid_type_error: 'Quantity must be a number' })
    .positive('Quantity must be positive'),
  purchasePrice: z
    .number({ invalid_type_error: 'Price must be a number' })
    .positive('Price must be positive'),
  purchaseDate: z.string().min(1, 'Purchase date is required'),
});

type FormData = z.infer<typeof schema>;

interface AddHoldingFormProps {
  isOpen: boolean;
  onClose: () => void;
}

export function AddHoldingForm({ isOpen, onClose }: AddHoldingFormProps) {
  const createHolding = useCreateHolding();

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: {
      symbol: '',
      name: '',
      quantity: undefined,
      purchasePrice: undefined,
      purchaseDate: new Date().toISOString().split('T')[0],
    },
  });

  const onSubmit = async (data: FormData) => {
    try {
      await createHolding.mutateAsync(data);
      reset();
      onClose();
    } catch (error) {
      console.error('Failed to create holding:', error);
    }
  };

  const handleClose = () => {
    reset();
    onClose();
  };

  return (
    <Modal isOpen={isOpen} onClose={handleClose} title="Add Holding" className="max-w-lg">
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <Input
            id="symbol"
            label="Stock Symbol"
            placeholder="e.g., AAPL"
            {...register('symbol')}
            error={errors.symbol?.message}
          />
          <Input
            id="name"
            label="Company Name"
            placeholder="e.g., Apple Inc."
            {...register('name')}
            error={errors.name?.message}
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <Input
            id="quantity"
            label="Number of Shares"
            type="number"
            step="any"
            placeholder="e.g., 10"
            {...register('quantity', { valueAsNumber: true })}
            error={errors.quantity?.message}
          />
          <Input
            id="purchasePrice"
            label="Purchase Price ($)"
            type="number"
            step="0.01"
            placeholder="e.g., 150.00"
            {...register('purchasePrice', { valueAsNumber: true })}
            error={errors.purchasePrice?.message}
          />
        </div>

        <Input
          id="purchaseDate"
          label="Purchase Date"
          type="date"
          {...register('purchaseDate')}
          error={errors.purchaseDate?.message}
        />

        {createHolding.error && (
          <p className="text-sm text-red-600">
            Failed to add holding. Please try again.
          </p>
        )}

        <div className="flex justify-end gap-3 pt-4">
          <Button type="button" variant="secondary" onClick={handleClose}>
            Cancel
          </Button>
          <Button type="submit" disabled={isSubmitting || createHolding.isPending}>
            {createHolding.isPending ? 'Adding...' : 'Add Holding'}
          </Button>
        </div>
      </form>
    </Modal>
  );
}
