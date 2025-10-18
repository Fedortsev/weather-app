export interface WeatherData {
  id: number;
  name: string;
  sys: {
    country: string;
  };
  main: {
    temp: number;
    feels_like: number;
    temp_min: number;
    temp_max: number;
    pressure: number;
    humidity: number;
  };
  weather: Array<{
    id: number;
    main: string;
    description: string;
    icon: string;
  }>;
  wind: {
    speed: number;
    deg: number;
  };
  clouds: {
    all: number;
  };
  dt: number;
  timezone: number;
}

export interface HourlyForecast {
  dt: number;
  main: {
    temp: number;
    feels_like: number;
    temp_min: number;
    temp_max: number;
    pressure: number;
    humidity: number;
  };
  weather: Array<{
    id: number;
    main: string;
    description: string;
    icon: string;
  }>;
  wind: {
    speed: number;
    deg: number;
  };
  pop: number;
  dt_txt: string;
}

export interface ForecastData {
  list: HourlyForecast[];
  city: {
    id: number;
    name: string;
    country: string;
    timezone: number;
  };
}

export interface City {
  id: string;
  name: string;
  addedAt: number;
}
