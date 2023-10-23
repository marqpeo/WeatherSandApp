export interface IResponse<T>{
  count: number;
  results: T[];
  status: string;
}

export interface IGeocodingCity {
  country: string;
  country_code: string;
  desc1: string;
  desc2: string;
  desc3: string;
  elevation: number;
  id: number;
  latitude: number;
  longitude: number;
  name: string;
  timezone: string;
}

export interface IForecastCity {
  date: string;
  precipProbab: number;
  tempMax: number;
  tempMin: number;
  weatherType: string;
  windSpeed: number;
}