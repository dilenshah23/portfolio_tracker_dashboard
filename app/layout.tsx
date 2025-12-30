import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import { Providers } from '@/lib/providers';
import './globals.css';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'Portfolio Tracker | Dashboard',
  description: 'Track your investment portfolio with real-time data',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <Providers>
          <div className="min-h-screen bg-gray-50">
            <header className="border-b bg-white">
              <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                <div className="flex h-16 items-center justify-between">
                  <div className="flex items-center gap-2">
                    <svg
                      className="h-8 w-8 text-primary-600"
                      fill="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z" />
                    </svg>
                    <span className="text-xl font-bold text-gray-900">
                      Portfolio Tracker
                    </span>
                  </div>
                  <nav className="flex items-center gap-6">
                    <a
                      href="/"
                      className="text-sm font-medium text-gray-700 hover:text-primary-600"
                    >
                      Dashboard
                    </a>
                    <a
                      href="/holdings"
                      className="text-sm font-medium text-gray-700 hover:text-primary-600"
                    >
                      Holdings
                    </a>
                  </nav>
                </div>
              </div>
            </header>
            <main>{children}</main>
          </div>
        </Providers>
      </body>
    </html>
  );
}
