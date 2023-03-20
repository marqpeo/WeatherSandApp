export interface WeatherForecastDay {
  date:         Date;
  precipProbab: number;
  tempMax:      number;
  tempMin:      number;
  weatherType:  string;
  windSpeed:    number;
  sunrise?:      Date;
  sunset?:       Date;
}

// Converts JSON strings to/from the type
export class WeatherConvert {
  public static toWeatherForecastDays(resultArray: any[]): WeatherForecastDay[] {
    return resultArray as WeatherForecastDay[];
  }

  public static weatherForecastDaysToJson(value: WeatherForecastDay[]): string {
      return JSON.stringify(value);
  }
}
