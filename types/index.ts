// Database models
export interface Holding {
  id: string;
  symbol: string;
  name: string;
  quantity: number;
  purchasePrice: number;
  purchaseDate: Date;
  createdAt: Date;
  updatedAt: Date;
}

export interface PriceHistory {
  id: string;
  symbol: string;
  price: number;
  date: Date;
  createdAt: Date;
}

export interface PortfolioSnapshot {
  id: string;
  totalValue: number;
  date: Date;
  createdAt: Date;
}

// API response types
export interface StockQuote {
  symbol: string;
  price: number;
  change: number;
  changePercent: number;
  previousClose: number;
  open: number;
  high: number;
  low: number;
  volume: number;
  latestTradingDay: string;
}

export interface HoldingWithPrice extends Holding {
  currentPrice: number;
  currentValue: number;
  totalGain: number;
  totalGainPercent: number;
  dayChange: number;
  dayChangePercent: number;
}

// Portfolio summary
export interface PortfolioSummary {
  totalValue: number;
  totalCost: number;
  totalGain: number;
  totalGainPercent: number;
  dayChange: number;
  dayChangePercent: number;
}

// Form types
export interface AddHoldingFormData {
  symbol: string;
  name: string;
  quantity: number;
  purchasePrice: number;
  purchaseDate: string;
}

// Chart data
export interface ChartDataPoint {
  date: string;
  value: number;
}

// API error
export interface ApiError {
  message: string;
  code?: string;
}
