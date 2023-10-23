import { ICity } from '../models/City';

export const saveToStorage = (value: any, key: string) =>
  localStorage.setItem(key, JSON.stringify(value));

export const getFromStorage = (key: string) => localStorage.getItem(key);

export const parseOldSavedCities = (oldCitiesArr: any[]) =>
  oldCitiesArr.map<ICity>(city => ({
    elevation: city.elevation,
    id: city.id,
    isSaved: city.isSaved,
    latitude: city.latitude,
    longitude: city.longitude,
    forecast: city.forecast,
    forecastCount: city.forecastCount,
    selectedDay: city.selectedDay,
    en: {
      country: city.country,
      countryCode: city.countryCode,
      desc1: city.desc1,
      desc2: city.desc2,
      desc3: city.desc3,
      name: city.name,
      timezone: city.timezone,
    },
  }));

export const parseSavedCities = (citiesArr: any[]) => 
  citiesArr.map<ICity>(city => ({
    id: city.id,
    elevation: city.elevation,
    forecast: city.forecast,
    forecastCount: city.forecastCount,
    isSaved: city.isSaved,
    latitude: city.latitude,
    longitude: city.longitude,
    en: city.en ?? undefined,
    es: city.es ?? undefined,
    ru: city.ru ?? undefined
  }));