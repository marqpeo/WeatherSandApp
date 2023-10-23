import { IAction } from ".";

export const enum CitiesActionTypes {
  GetSavedCities = 'cities/GET_SAVED_CITIES'
};

export type ActionTypes =
  IAction<CitiesActionTypes.GetSavedCities>
  ;

export const getSavedCities = ():ActionTypes => ({
  type: CitiesActionTypes.GetSavedCities
})