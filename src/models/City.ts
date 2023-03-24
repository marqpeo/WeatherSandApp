import { WeatherForecastDay } from './WeatherForecastDay';

export interface City {
  id: number;
  name: string;
  latitude: number;
  longitude: number;
  elevation: number;
  countryCode: string;
  timezone: string;
  country: string;
  desc1: string;
  desc2: string;
  desc3: string;
  forecast?: WeatherForecastDay[];
  forecastCount?: number;
  selectedDay?: WeatherForecastDay;
  isSaved: boolean
}

// Converts JSON strings to/from your types
export class CityConvert {
  public static toCityArr(resultArray: any[]): City[] {
    return resultArray.map(city => ({
      id: city.id,
      name: city.name,
      latitude: city.latitude,
      longitude: city.longitude,
      elevation: city.elevation,
      countryCode: city.country_code,
      timezone: city.timezone,
      country: city.country,
      desc1: city.desc1,
      desc2: city.desc2,
      desc3: city.desc3,
      isSaved: false
    }));
  }

  public static cityToJson(value: City[]): string {
    return JSON.stringify(value);
  }
}

export const getCityByGeo = (latitude: number, longitude: number, forecast: WeatherForecastDay[], forecastCount: number) : City => {
  return {
  id: 0,
  name: 'GeoPosition',
  country: '',
  latitude: latitude,
  longitude: longitude,
  elevation: 0,
  countryCode: '',
  timezone: '',
  desc1: '',
  desc2: '',
  desc3: '',
  isSaved: true,
  forecast,
  forecastCount,
  selectedDay: forecast[0],
}};