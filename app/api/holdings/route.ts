import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/db';
import { z } from 'zod';

const createHoldingSchema = z.object({
  symbol: z.string().min(1).max(10).toUpperCase(),
  name: z.string().min(1).max(100),
  quantity: z.number().positive(),
  purchasePrice: z.number().positive(),
  purchaseDate: z.string().datetime().or(z.string().regex(/^\d{4}-\d{2}-\d{2}$/)),
});

// GET /api/holdings - List all holdings
export async function GET() {
  try {
    const holdings = await prisma.holding.findMany({
      orderBy: { createdAt: 'desc' },
    });

    return NextResponse.json(holdings);
  } catch (error) {
    console.error('Error fetching holdings:', error);
    return NextResponse.json(
      { message: 'Failed to fetch holdings' },
      { status: 500 }
    );
  }
}

// POST /api/holdings - Create a new holding
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const validated = createHoldingSchema.parse(body);

    const holding = await prisma.holding.create({
      data: {
        symbol: validated.symbol,
        name: validated.name,
        quantity: validated.quantity,
        purchasePrice: validated.purchasePrice,
        purchaseDate: new Date(validated.purchaseDate),
      },
    });

    return NextResponse.json(holding, { status: 201 });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { message: 'Validation error', errors: error.errors },
        { status: 400 }
      );
    }

    console.error('Error creating holding:', error);
    return NextResponse.json(
      { message: 'Failed to create holding' },
      { status: 500 }
    );
  }
}
