import { IWeatherForecastDay } from './WeatherForecastDay';

export interface ICity {
  id: number;
  es?:ICityDescLocalized,
  en?:ICityDescLocalized,
  ru?:ICityDescLocalized,
  elevation: number;
  forecast?: IWeatherForecastDay[];
  forecastCount?: number;
  selectedDay?: IWeatherForecastDay;
  latitude: number;
  longitude: number;
  isSaved: boolean
}

export interface ICityDescLocalized {
  country: string;
  countryCode: string;
  desc1: string;
  desc2: string;
  desc3: string;
  name: string;
  timezone: string;
}

export interface ICitySearchResponse{
  country: string;
  countryCode: string;
  desc1: string;
  desc2: string;
  desc3: string;
  elevation: 22
  id: 2514256
  isSaved: false
  latitude: 36.72016
  longitude: -4.42034
  name: string;
  timezone: string;
}

export class CityConvert {
  public static toCityArr(resultArray: any[]): ICitySearchResponse[] {
    return resultArray.map(city => ({
      country: city.country,
      countryCode: city.country_code,
      desc1: city.desc1,
      desc2: city.desc2,
      desc3: city.desc3,
      elevation: city.elevation,
      id: city.id,
      isSaved: false,
      latitude: city.latitude,
      longitude: city.longitude,
      name: city.name,
      timezone: city.timezone,
    }));
  }

  public static cityToJson(value: ICity[]): string {
    return JSON.stringify(value);
  }
}

export const getCityByGeo = (latitude: number, longitude: number, forecast: IWeatherForecastDay[], forecastCount: number) : ICity => {
  return {
  id: 0,
  latitude: latitude,
  longitude: longitude,
  elevation: 0,
  isSaved: true,
  forecast,
  forecastCount,
  selectedDay: forecast[0],
  // name: 'GeoPosition',
  // country: '',
  // countryCode: '',
  // timezone: '',
  // desc1: '',
  // desc2: '',
  // desc3: '',
}};