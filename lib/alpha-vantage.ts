import { StockQuote } from '@/types';

const API_KEY = process.env.ALPHA_VANTAGE_API_KEY || 'demo';
const BASE_URL = 'https://www.alphavantage.co/query';

// Simple in-memory cache to reduce API calls (Alpha Vantage has 25/day limit on free tier)
const priceCache = new Map<string, { data: StockQuote; timestamp: number }>();
const CACHE_TTL = 5 * 60 * 1000; // 5 minutes

export async function getStockQuote(symbol: string): Promise<StockQuote | null> {
  const cached = priceCache.get(symbol);
  if (cached && Date.now() - cached.timestamp < CACHE_TTL) {
    return cached.data;
  }

  try {
    const url = `${BASE_URL}?function=GLOBAL_QUOTE&symbol=${symbol}&apikey=${API_KEY}`;
    const response = await fetch(url);
    const data = await response.json();

    // Check for API limit or error
    if (data.Note || data['Error Message']) {
      console.warn('Alpha Vantage API limit or error:', data.Note || data['Error Message']);
      return null;
    }

    const quote = data['Global Quote'];
    if (!quote || !quote['05. price']) {
      return null;
    }

    const stockQuote: StockQuote = {
      symbol: quote['01. symbol'],
      price: parseFloat(quote['05. price']),
      change: parseFloat(quote['09. change']),
      changePercent: parseFloat(quote['10. change percent'].replace('%', '')),
      previousClose: parseFloat(quote['08. previous close']),
      open: parseFloat(quote['02. open']),
      high: parseFloat(quote['03. high']),
      low: parseFloat(quote['04. low']),
      volume: parseInt(quote['06. volume']),
      latestTradingDay: quote['07. latest trading day'],
    };

    priceCache.set(symbol, { data: stockQuote, timestamp: Date.now() });
    return stockQuote;
  } catch (error) {
    console.error(`Error fetching quote for ${symbol}:`, error);
    return null;
  }
}

export async function getMultipleQuotes(symbols: string[]): Promise<Map<string, StockQuote>> {
  const quotes = new Map<string, StockQuote>();

  // Process sequentially to avoid hitting rate limits
  for (const symbol of symbols) {
    const quote = await getStockQuote(symbol);
    if (quote) {
      quotes.set(symbol, quote);
    }
    // Add small delay between requests to be nice to the API
    if (symbols.indexOf(symbol) < symbols.length - 1) {
      await new Promise(resolve => setTimeout(resolve, 200));
    }
  }

  return quotes;
}

export async function searchSymbol(query: string): Promise<Array<{ symbol: string; name: string }>> {
  try {
    const url = `${BASE_URL}?function=SYMBOL_SEARCH&keywords=${query}&apikey=${API_KEY}`;
    const response = await fetch(url);
    const data = await response.json();

    if (data.Note || !data.bestMatches) {
      return [];
    }

    return data.bestMatches.slice(0, 5).map((match: Record<string, string>) => ({
      symbol: match['1. symbol'],
      name: match['2. name'],
    }));
  } catch (error) {
    console.error('Error searching symbols:', error);
    return [];
  }
}

// For demo purposes when API limits are reached
export function getMockQuote(symbol: string): StockQuote {
  const mockPrices: Record<string, number> = {
    AAPL: 178.50,
    GOOGL: 141.25,
    MSFT: 378.90,
    AMZN: 178.75,
    TSLA: 248.50,
    NVDA: 495.22,
    META: 505.75,
    VTI: 268.35,
    VOO: 492.15,
  };

  const price = mockPrices[symbol] || 100 + Math.random() * 100;
  const change = (Math.random() - 0.5) * 10;

  return {
    symbol,
    price,
    change,
    changePercent: (change / price) * 100,
    previousClose: price - change,
    open: price - change + Math.random() * 2,
    high: price + Math.random() * 5,
    low: price - Math.random() * 5,
    volume: Math.floor(Math.random() * 10000000),
    latestTradingDay: new Date().toISOString().split('T')[0],
  };
}
