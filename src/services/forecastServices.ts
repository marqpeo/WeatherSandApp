import { methodGet } from "../api/methods";
import { IForecastCity, IResponse } from "../models/services";

export const getCityForecastService = (latitude: number, longitude: number):Promise<IResponse<IForecastCity>> =>
  methodGet(`/get-weather-daily?lat=${latitude}&lon=${longitude}`);
