import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/db';
import { startOfDay, subDays, subMonths, subYears, format } from 'date-fns';

// GET /api/portfolio/history?range=1M
export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const range = searchParams.get('range') || '1M';

    let startDate: Date;
    const endDate = startOfDay(new Date());

    switch (range) {
      case '1W':
        startDate = subDays(endDate, 7);
        break;
      case '1M':
        startDate = subMonths(endDate, 1);
        break;
      case '3M':
        startDate = subMonths(endDate, 3);
        break;
      case '1Y':
        startDate = subYears(endDate, 1);
        break;
      case 'ALL':
        startDate = new Date('2020-01-01');
        break;
      default:
        startDate = subMonths(endDate, 1);
    }

    const snapshots = await prisma.portfolioSnapshot.findMany({
      where: {
        date: {
          gte: startDate,
          lte: endDate,
        },
      },
      orderBy: { date: 'asc' },
    });

    // If no snapshots, generate mock data for demo
    if (snapshots.length === 0) {
      const mockData = generateMockHistory(startDate, endDate);
      return NextResponse.json(mockData);
    }

    const chartData = snapshots.map(snapshot => ({
      date: format(snapshot.date, 'yyyy-MM-dd'),
      value: snapshot.totalValue,
    }));

    return NextResponse.json(chartData);
  } catch (error) {
    console.error('Error fetching portfolio history:', error);
    return NextResponse.json(
      { message: 'Failed to fetch portfolio history' },
      { status: 500 }
    );
  }
}

function generateMockHistory(startDate: Date, endDate: Date) {
  const data = [];
  let currentDate = new Date(startDate);
  let value = 10000 + Math.random() * 5000; // Start with random initial value

  while (currentDate <= endDate) {
    // Skip weekends
    if (currentDate.getDay() !== 0 && currentDate.getDay() !== 6) {
      // Random walk with slight upward bias
      const change = (Math.random() - 0.48) * value * 0.02;
      value = Math.max(value + change, 1000);

      data.push({
        date: format(currentDate, 'yyyy-MM-dd'),
        value: Math.round(value * 100) / 100,
      });
    }

    currentDate = new Date(currentDate.getTime() + 24 * 60 * 60 * 1000);
  }

  return data;
}
