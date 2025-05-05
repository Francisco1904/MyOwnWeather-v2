// Mock the weather API service
jest.mock('@/lib/services/weatherApi', () => {
  const mockCurrentWeatherData = {
    location: {
      name: 'San Francisco',
      region: 'California',
      country: 'USA',
      lat: 37.78,
      lon: -122.42,
    },
    current: {
      temp_c: 15,
      temp_f: 59,
      condition: {
        text: 'Partly cloudy',
        icon: '//cdn.weatherapi.com/weather/64x64/day/116.png',
        code: 1003,
      },
      wind_mph: 6.9,
      wind_kph: 11.2,
      humidity: 71,
      feelslike_c: 14.4,
      feelslike_f: 57.9,
      uv: 5,
      air_quality: { 'us-epa-index': 1 },
    },
  };

  const mockForecastData = {
    location: mockCurrentWeatherData.location,
    current: mockCurrentWeatherData.current,
    forecast: {
      forecastday: [
        {
          date: '2023-06-15',
          day: {
            maxtemp_c: 20.5,
            maxtemp_f: 68.9,
            mintemp_c: 14.2,
            mintemp_f: 57.6,
            condition: {
              text: 'Sunny',
              icon: '//cdn.weatherapi.com/weather/64x64/day/113.png',
              code: 1000,
            },
            daily_chance_of_rain: 0,
          },
          hour: Array(24)
            .fill(null)
            .map((_, i) => ({
              time: `2023-06-15 ${i.toString().padStart(2, '0')}:00`,
              temp_c: 15 + Math.random() * 5,
              temp_f: 59 + Math.random() * 5,
              condition: {
                text: 'Partly cloudy',
                icon: '//cdn.weatherapi.com/weather/64x64/day/116.png',
                code: 1003,
              },
              chance_of_rain: Math.floor(Math.random() * 100),
            })),
        },
      ],
    },
  };

  const mockLocationsData = [
    {
      id: 1234,
      name: 'San Francisco',
      region: 'California',
      country: 'USA',
      lat: 37.78,
      lon: -122.42,
    },
    {
      id: 5678,
      name: 'New York',
      region: 'New York',
      country: 'USA',
      lat: 40.71,
      lon: -74.01,
    },
  ];

  // Create the WeatherApiError class
  class WeatherApiError extends Error {
    constructor(message, statusCode = 500) {
      super(message);
      this.name = 'WeatherApiError';
      this.statusCode = statusCode;
    }
  }

  // Create the mock weather service object
  const weatherService = {
    getCurrentWeather: jest.fn().mockResolvedValue(mockCurrentWeatherData),
    getForecast: jest.fn().mockResolvedValue(mockForecastData),
    searchLocations: jest.fn().mockResolvedValue(mockLocationsData),
    refreshData: jest.fn().mockResolvedValue(mockCurrentWeatherData),
    isRateLimited: jest.fn().mockReturnValue(false),
  };

  return {
    WeatherApiError,
    weatherService,
  };
});
