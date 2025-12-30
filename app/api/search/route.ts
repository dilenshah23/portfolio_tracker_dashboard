import { NextRequest, NextResponse } from 'next/server';
import { searchSymbol } from '@/lib/alpha-vantage';

// GET /api/search?q=apple
export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const query = searchParams.get('q');

    if (!query || query.length < 1) {
      return NextResponse.json([]);
    }

    const results = await searchSymbol(query);
    return NextResponse.json(results);
  } catch (error) {
    console.error('Error searching symbols:', error);
    return NextResponse.json(
      { message: 'Failed to search symbols' },
      { status: 500 }
    );
  }
}
