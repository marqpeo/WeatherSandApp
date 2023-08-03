export interface IWeatherForecastDay {
  date:         string;
  precipProbab: number;
  tempMax:      number;
  tempMin:      number;
  weatherType:  string;
  windSpeed:    number;
  sunrise?:      string;
  sunset?:       string;
}

// Converts JSON strings to/from the type
export class WeatherConvert {
  public static toWeatherForecastDays(resultArray: any[]): IWeatherForecastDay[] {
    return resultArray as IWeatherForecastDay[];
  }

  public static weatherForecastDaysToJson(value: IWeatherForecastDay[]): string {
      return JSON.stringify(value);
  }
}
