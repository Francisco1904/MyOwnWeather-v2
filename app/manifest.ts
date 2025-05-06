import { MetadataRoute } from 'next';

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: 'MyOwnWeather | Modern Weather App',
    short_name: 'MyOwnWeather',
    description:
      'A modern weather application with real-time forecasts, location search, and user preferences.',
    start_url: '/',
    display: 'standalone',
    background_color: '#ffffff',
    theme_color: '#0284c7',
    id: '/',
    categories: ['weather', 'utilities'],
    orientation: 'portrait',
    icons: [
      {
        src: '/favicon.png',
        sizes: '512x512',
        type: 'image/png',
        purpose: 'any',
      },
    ],
    screenshots: [
      {
        src: '/screenshots_preview/mockup_light.png',
        sizes: '1280x720',
        type: 'image/png',
        form_factor: 'wide',
      },
      {
        src: '/screenshots_preview/mockup_dark.png',
        sizes: '6991x2992',
        type: 'image/png',
        form_factor: 'wide',
      },
    ],
    prefer_related_applications: false,
  };
}
