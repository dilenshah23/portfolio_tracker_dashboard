import { NextRequest, NextResponse } from 'next/server';
import { getStockQuote, getMockQuote } from '@/lib/alpha-vantage';

// GET /api/prices?symbols=AAPL,GOOGL,MSFT
export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const symbolsParam = searchParams.get('symbols');
    const useMock = searchParams.get('mock') === 'true';

    if (!symbolsParam) {
      return NextResponse.json(
        { message: 'symbols parameter is required' },
        { status: 400 }
      );
    }

    const symbols = symbolsParam.split(',').map(s => s.trim().toUpperCase());
    const prices: Record<string, ReturnType<typeof getMockQuote> | null> = {};

    for (const symbol of symbols) {
      if (useMock) {
        prices[symbol] = getMockQuote(symbol);
      } else {
        const quote = await getStockQuote(symbol);
        prices[symbol] = quote || getMockQuote(symbol); // Fallback to mock if API fails
      }
    }

    return NextResponse.json(prices);
  } catch (error) {
    console.error('Error fetching prices:', error);
    return NextResponse.json(
      { message: 'Failed to fetch prices' },
      { status: 500 }
    );
  }
}
