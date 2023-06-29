import { methodGet } from "../api/methods";

export const getCityForecast = (latitude: number, longitude: number) =>
  methodGet(`api/get-weather-daily?lat=${latitude}&lon=${longitude}`);
