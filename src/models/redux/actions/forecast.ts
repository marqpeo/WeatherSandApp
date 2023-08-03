import { IAction, IPayloadAction } from "."
import { ICity } from "../../City";

export const enum ForecastActionTypes {
  FetchForecastGeo = 'forecast/FETCH_FORECAST_GEO',
  FetchCityWeather = 'forecast/FETCH_CITY_WEATHER'
};

export type ActionTypes =
  IPayloadAction<ForecastActionTypes.FetchCityWeather, ICity> |
  IAction<ForecastActionTypes.FetchForecastGeo>
  ;

export const fetchCityWeather = (payload: ICity):ActionTypes => ({
  type: ForecastActionTypes.FetchCityWeather,
  payload
});
