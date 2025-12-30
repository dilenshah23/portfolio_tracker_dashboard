import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

const sampleHoldings = [
  {
    symbol: 'AAPL',
    name: 'Apple Inc.',
    quantity: 25,
    purchasePrice: 150.00,
    purchaseDate: new Date('2023-06-15'),
  },
  {
    symbol: 'GOOGL',
    name: 'Alphabet Inc.',
    quantity: 10,
    purchasePrice: 125.50,
    purchaseDate: new Date('2023-08-20'),
  },
  {
    symbol: 'MSFT',
    name: 'Microsoft Corporation',
    quantity: 15,
    purchasePrice: 340.00,
    purchaseDate: new Date('2023-04-10'),
  },
  {
    symbol: 'AMZN',
    name: 'Amazon.com Inc.',
    quantity: 20,
    purchasePrice: 145.00,
    purchaseDate: new Date('2023-09-01'),
  },
  {
    symbol: 'NVDA',
    name: 'NVIDIA Corporation',
    quantity: 8,
    purchasePrice: 420.00,
    purchaseDate: new Date('2023-07-25'),
  },
  {
    symbol: 'TSLA',
    name: 'Tesla Inc.',
    quantity: 12,
    purchasePrice: 220.00,
    purchaseDate: new Date('2023-10-05'),
  },
  {
    symbol: 'VTI',
    name: 'Vanguard Total Stock Market ETF',
    quantity: 30,
    purchasePrice: 235.00,
    purchaseDate: new Date('2023-03-15'),
  },
];

async function main() {
  console.log('Seeding database...');

  // Clear existing data
  await prisma.holding.deleteMany();
  await prisma.portfolioSnapshot.deleteMany();
  await prisma.priceHistory.deleteMany();

  // Insert sample holdings
  for (const holding of sampleHoldings) {
    await prisma.holding.create({ data: holding });
    console.log(`Created holding: ${holding.symbol}`);
  }

  // Generate portfolio snapshots for the last 90 days
  const today = new Date();
  let portfolioValue = 20000 + Math.random() * 5000;

  for (let i = 90; i >= 0; i--) {
    const date = new Date(today);
    date.setDate(date.getDate() - i);
    date.setHours(0, 0, 0, 0);

    // Skip weekends
    if (date.getDay() === 0 || date.getDay() === 6) continue;

    // Random walk with slight upward bias
    const change = (Math.random() - 0.48) * portfolioValue * 0.015;
    portfolioValue = Math.max(portfolioValue + change, 15000);

    await prisma.portfolioSnapshot.create({
      data: {
        totalValue: Math.round(portfolioValue * 100) / 100,
        date,
      },
    });
  }

  console.log('Created portfolio snapshots for the last 90 days');
  console.log('Seeding complete!');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
