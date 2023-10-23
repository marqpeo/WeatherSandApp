import { ICity } from "./City";
import { LanguageType } from "./locales";

export interface IAppState {
  cities: ICitiesState;
  core: ICoreState;
}

export interface ICitiesState {
  currentCity?: ICity;
  citiesCache: ICity[];
}

export interface ICoreState {
  loading: boolean;
  drawerIsOpen: boolean;
  savedListIsOpen: boolean;
  loaderTitle?: string;
  errorMessage?: string;
  language: LanguageType;
}
