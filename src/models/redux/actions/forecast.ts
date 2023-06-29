import { IAction, IPayloadAction } from "."
import { ICity } from "../../City";

export const enum ForecastActionTypes {
  FetchForecastGeo = 'forecast/fetchForecastGeo',
  FetchCityWeather = 'forecast/fetchCityWeather'
};

export type ActionTypes =
  IPayloadAction<ForecastActionTypes.FetchCityWeather, ICity> |
  IAction<ForecastActionTypes.FetchForecastGeo>
  ;

export const fetchCityWeather = (payload: ICity):ActionTypes => ({
  type: ForecastActionTypes.FetchCityWeather,
  payload
});
