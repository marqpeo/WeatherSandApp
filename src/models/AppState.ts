import { ICity } from "./City";

export interface IAppState {
  cities: ICitiesState;
  core: ICoreState
}

export interface ICitiesState {
  currentCity?: ICity | null;
  citiesCache: ICity[];
}

export interface ICoreState {
  loading: boolean,
  drawerIsOpen: boolean,
  savedListIsOpen: boolean,
  loaderTitle?: string,
  errorMessage?: string
}