import { NextResponse } from 'next/server';
import weatherService from '@/lib/services/weatherApi';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const lat = searchParams.get('lat');
  const lon = searchParams.get('lon');

  if (!lat || !lon) {
    return NextResponse.json(
      { error: 'Missing required parameters: lat and lon' },
      { status: 400 }
    );
  }

  try {
    const query = `${lat},${lon}`;

    // Fetch both current weather and forecast data
    const [currentWeather, forecast] = await Promise.all([
      weatherService.getCurrentWeather(query),
      weatherService.getForecast(query, 3), // 3-day forecast
    ]);

    // Combine into a single response
    return NextResponse.json({
      ...currentWeather,
      forecast: forecast.forecast,
    });
  } catch (error) {
    console.error('Error fetching weather data:', error);
    return NextResponse.json({ error: 'Failed to fetch weather data' }, { status: 500 });
  }
}
