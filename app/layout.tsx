import type { Metadata, Viewport } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import { ThemeProvider } from '@/components/theme-provider';
import AppWrapper from './AppWrapper';
import { Toaster } from '@/components/ui/toaster';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'MyOwnWeather v2 | Modern Weather App',
  description: 'A modern weather application showing real-time forecasts with a beautiful UI',
  keywords: ['weather', 'forecast', 'nextjs', 'react', 'typescript'],
  authors: [{ name: 'Francisco Pontes' }],
  openGraph: {
    title: 'MyOwnWeather v2',
    description: 'A modern weather application with real-time forecasts',
    type: 'website',
  },
};

// Separate viewport export as recommended by Next.js
export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  viewportFit: 'cover',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={inter.className}>
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
          suppressHydrationWarning
        >
          <AppWrapper>{children}</AppWrapper>
          <Toaster />
        </ThemeProvider>
      </body>
    </html>
  );
}

import './globals.css';
