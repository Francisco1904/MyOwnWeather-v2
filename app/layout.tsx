import type { Metadata, Viewport } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import { ThemeProvider } from '@/components/theme-provider';
import AppWrapper from './AppWrapper';
import { Toaster } from '@/components/ui/toaster';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: {
    default: 'MyOwnWeather | Modern Weather App',
    template: '%s | MyOwnWeather',
  },
  description:
    'A modern weather application built with Next.js, TypeScript and Firebase. Features real-time forecasts, location search, and user preferences.',
  keywords: ['weather', 'forecast', 'nextjs', 'react', 'typescript', 'firebase'],
  authors: [{ name: 'Francisco Pontes' }],
  creator: 'Francisco Pontes',
  openGraph: {
    type: 'website',
    title: 'MyOwnWeather App',
    description: 'A modern weather application with real-time forecasts',
  },
  icons: {
    icon: '/favicon.png',
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
