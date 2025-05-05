import { MetadataRoute } from 'next';

export default function sitemap(): MetadataRoute.Sitemap {
  // Base URL for the app (update this when you have your actual domain)
  const baseUrl = process.env.SITE_URL || 'https://myownweather.vercel.app';

  // Current date for lastModified
  const currentDate = new Date();

  // Main application routes
  const routes = ['', '/search', '/details', '/auth/login', '/auth/signup', '/settings'].map(
    route => ({
      url: `${baseUrl}${route}`,
      lastModified: currentDate,
      changeFrequency: 'monthly' as const,
      priority: route === '' ? 1 : 0.8,
    })
  );

  return routes;
}
