import { IAction, IPayloadAction } from ".";
import { ICity } from "../../City";

export const enum CitiesActionTypes {
  GetSavedCities = 'cities/GET_SAVED_CITIES',
  GetLocalizedCities = 'cities/GET_LOCALIZED_CITIES',
  SetCurrentCity = 'cities/SET_CURRENT_CITY',
};

export type ActionTypes =
  IAction<CitiesActionTypes.GetSavedCities> | 
  IPayloadAction<CitiesActionTypes.SetCurrentCity, ICity|undefined> |
  IPayloadAction<CitiesActionTypes.GetLocalizedCities, ICity[]|undefined>
  ;

export const getSavedCities = ():ActionTypes => ({
  type: CitiesActionTypes.GetSavedCities
});

export const setCurrentCity = (payload?: ICity):ActionTypes => ({
  type: CitiesActionTypes.SetCurrentCity,
  payload
});

export const getLocalizedCities = (payload?: ICity[]):ActionTypes => ({
  type: CitiesActionTypes.GetLocalizedCities,
  payload
});
