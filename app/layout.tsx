import type { Metadata, Viewport } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import { ThemeProvider } from '@/components/theme-provider';
import { Toaster } from '@/components/ui/toaster';
import AppWrapper from './AppWrapper';

// Optimize font loading - only load latin subset with preload
const inter = Inter({
  subsets: ['latin'],
  display: 'swap',
  preload: true,
  fallback: ['system-ui', 'sans-serif'],
  adjustFontFallback: true, // Minimize layout shift
  variable: '--font-inter',
});

// Metadata optimized for SEO but kept minimal
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

// Optimized viewport configuration
export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 2, // Allow some zooming for accessibility
  minimumScale: 1,
  userScalable: true, // Better for accessibility
  themeColor: [
    { media: '(prefers-color-scheme: light)', color: '#0284c7' },
    { media: '(prefers-color-scheme: dark)', color: '#1e293b' },
  ],
  viewportFit: 'cover',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  // Ultra-optimized inline script for theme detection to prevent flash
  const themeScript = `(function(){try{const t=localStorage.getItem("theme"),e=window.matchMedia("(prefers-color-scheme: dark)").matches;document.documentElement.classList.add(t==="dark"||(t==="system"||!t)&&e?"dark":"light"),document.documentElement.style.colorScheme=document.documentElement.classList.contains("dark")?"dark":"light",document.documentElement.dataset.theme=document.documentElement.classList.contains("dark")?"dark":"light"}catch(e){}})();`;

  return (
    <html lang="en" suppressHydrationWarning className={inter.variable}>
      <head>
        <meta charSet="utf-8" />
        <script dangerouslySetInnerHTML={{ __html: themeScript }} />

        {/* Critical CSS preload */}
        <link rel="preload" href="/favicon.png" as="image" type="image/png" />

        {/* Preconnect to origins */}
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />

        {/* Font optimization is handled by Next.js font/google module */}
      </head>
      <body className={inter.className}>
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <AppWrapper>{children}</AppWrapper>
          <Toaster />
        </ThemeProvider>
      </body>
    </html>
  );
}
