import axios from 'axios';

// Base API configuration
const weatherApi = axios.create({
  baseURL: process.env.NEXT_PUBLIC_WEATHER_API_URL,
  params: {
    key: process.env.NEXT_PUBLIC_WEATHER_API_KEY,
  },
});

// Types
export interface CurrentWeather {
  location: {
    name: string;
    region: string;
    country: string;
    lat: number;
    lon: number;
    localtime: string;
  };
  current: {
    temp_c: number;
    temp_f: number;
    condition: {
      text: string;
      icon: string;
      code: number;
    };
    humidity: number;
    cloud: number;
    feelslike_c: number;
    feelslike_f: number;
    wind_kph: number;
    wind_mph: number;
    wind_dir: string;
    precip_mm: number;
    precip_in: number;
    uv: number;
  };
}

export interface ForecastDay {
  date: string;
  day: {
    maxtemp_c: number;
    maxtemp_f: number;
    mintemp_c: number;
    mintemp_f: number;
    avgtemp_c: number;
    avgtemp_f: number;
    condition: {
      text: string;
      icon: string;
      code: number;
    };
    daily_chance_of_rain: number;
    daily_chance_of_snow: number;
    uv: number;
    maxwind_kph: number;
    maxwind_mph: number;
    avghumidity: number;
    totalprecip_mm: number;
    totalprecip_in: number;
  };
  astro: {
    sunrise: string;
    sunset: string;
  };
  hour: Array<{
    time: string;
    temp_c: number;
    temp_f: number;
    condition: {
      text: string;
      icon: string;
      code: number;
    };
    chance_of_rain: number;
    chance_of_snow: number;
  }>;
}

export interface ForecastWeather extends CurrentWeather {
  forecast: {
    forecastday: ForecastDay[];
  };
}

export interface ForecastData {
  forecast: {
    forecastday: Array<{
      hour: HourlyForecast[];
    }>;
  };
}

export interface HourlyForecast {
  time: string;
  temp_c: number;
  condition: {
    text: string;
    icon: string;
  };
  chance_of_rain: number;
}

// Services
export const weatherService = {
  /**
   * Get current weather for a location
   */
  getCurrentWeather: async (query: string): Promise<CurrentWeather> => {
    try {
      const response = await weatherApi.get('/current.json', {
        params: { q: query },
      });
      return response.data;
    } catch (error) {
      console.error('Error fetching current weather:', error);
      throw error;
    }
  },

  /**
   * Get weather forecast for a location
   * @param query Location (city name, lat/lon coordinates, postal code)
   * @param days Number of forecast days (1-10)
   */
  getForecast: async (query: string, days = 3): Promise<ForecastWeather> => {
    try {
      const response = await weatherApi.get('/forecast.json', {
        params: {
          q: query,
          days,
        },
      });
      return response.data;
    } catch (error) {
      console.error('Error fetching forecast:', error);
      throw error;
    }
  },

  /**
   * Search for locations
   * @param query Location search term
   */
  searchLocations: async (query: string) => {
    try {
      const response = await weatherApi.get('/search.json', {
        params: { q: query },
      });
      return response.data;
    } catch (error) {
      console.error('Error searching locations:', error);
      throw error;
    }
  },
};

export default weatherService;
