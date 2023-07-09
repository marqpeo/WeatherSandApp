import { IAction } from ".";

export const enum CitiesActionTypes {
  GetSavedCities = 'cities/GetSavedCities'
};

export type ActionTypes =
  IAction<CitiesActionTypes.GetSavedCities>
  ;

export const getSavedCities = ():ActionTypes => ({
  type: CitiesActionTypes.GetSavedCities
})