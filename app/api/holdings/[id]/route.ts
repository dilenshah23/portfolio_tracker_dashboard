import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/db';
import { z } from 'zod';

const updateHoldingSchema = z.object({
  symbol: z.string().min(1).max(10).toUpperCase().optional(),
  name: z.string().min(1).max(100).optional(),
  quantity: z.number().positive().optional(),
  purchasePrice: z.number().positive().optional(),
  purchaseDate: z.string().datetime().or(z.string().regex(/^\d{4}-\d{2}-\d{2}$/)).optional(),
});

// GET /api/holdings/[id] - Get a single holding
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const holding = await prisma.holding.findUnique({
      where: { id },
    });

    if (!holding) {
      return NextResponse.json(
        { message: 'Holding not found' },
        { status: 404 }
      );
    }

    return NextResponse.json(holding);
  } catch (error) {
    console.error('Error fetching holding:', error);
    return NextResponse.json(
      { message: 'Failed to fetch holding' },
      { status: 500 }
    );
  }
}

// PUT /api/holdings/[id] - Update a holding
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await request.json();
    const validated = updateHoldingSchema.parse(body);

    const holding = await prisma.holding.update({
      where: { id },
      data: {
        ...validated,
        purchaseDate: validated.purchaseDate ? new Date(validated.purchaseDate) : undefined,
      },
    });

    return NextResponse.json(holding);
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { message: 'Validation error', errors: error.errors },
        { status: 400 }
      );
    }

    console.error('Error updating holding:', error);
    return NextResponse.json(
      { message: 'Failed to update holding' },
      { status: 500 }
    );
  }
}

// DELETE /api/holdings/[id] - Delete a holding
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    await prisma.holding.delete({
      where: { id },
    });

    return NextResponse.json({ message: 'Holding deleted' });
  } catch (error) {
    console.error('Error deleting holding:', error);
    return NextResponse.json(
      { message: 'Failed to delete holding' },
      { status: 500 }
    );
  }
}
