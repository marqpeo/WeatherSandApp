import { Epic, combineEpics, ofType } from 'redux-observable';
import { EMPTY, concat, filter, forkJoin, from, map, of, switchMap } from 'rxjs';
import { IAppState } from '../../models/AppState';
import { onSetCurrentCity, onSaveCities, StorageKeysCities, onUpdateCity, onAddCities } from '../citiesState';
import { callWithLoader$ } from '../helpers.redux';
import { ICity } from '../../models/City';
import { WeatherConvert } from '../../models/WeatherForecastDay';
import { getCityForecastService } from '../../services/forecastServices';
import { ForecastActionTypes } from '../../models/redux/actions/forecast';
import { AnyAction } from '@reduxjs/toolkit';
import { CitiesActionTypes, getLocalizedCities, setCurrentCity } from '../../models/redux/actions/cities';
import { getFromStorage, parseSavedCities, saveToStorage } from '../../helpers/localstorage.helpers';
import { onHideLoader } from '../core';
import { LanguageType } from '../../models/locales';
import { getCityByNameService } from '../../services/geoServices';

export type MyEpic = Epic<AnyAction, AnyAction, IAppState>;

const chooseCityEpic: MyEpic = (action$, state$) =>
  action$.pipe(
    ofType(ForecastActionTypes.FetchCityWeather),
    switchMap(action => {
      const { payload: city } = action;
      const { cities } = state$.value;
      const cachedCity = cities.citiesCache.find(item => item.id === city.id);

      if (cachedCity !== undefined) {
        if (cachedCity?.forecast) {
          return of(onSetCurrentCity(cachedCity));
        } else {
          const getCityForecast$ = from(
            getCityForecastService(cachedCity.latitude, cachedCity.longitude)
          ).pipe(
            map(res => {
              if (res.status === 'ok') {
                const newCity: ICity = {
                  ...cachedCity,
                  forecast: WeatherConvert.toWeatherForecastDays(res.results),
                  forecastCount: res.count as number,
                };
                
                return newCity;
              }
            })
          );
          return callWithLoader$(
            getCityForecast$.pipe(
              switchMap(res => res
                ? concat(
                    of(onUpdateCity(res)),
                    of(setCurrentCity(res))
                  )
                : EMPTY
              )
            )
          );
        }
      } else {
        const getCityForecast$ = from(
          getCityForecastService(city.latitude, city.longitude)
        ).pipe(
          map(res => {
            const currentLanguage = state$.value.core.language as LanguageType;
            if (res.status === 'ok') {
              const newCity: ICity = {
                elevation: city.elevation,
                id: city.id,
                isSaved: city.isSaved,
                latitude: city.latitude,
                longitude: city.longitude,
                selectedDay: city.selectedDay,
                [currentLanguage] : {
                  country: city.country,
                  countryCode: city.countryCode,
                  desc1: city.desc1,
                  desc2: city.desc2,
                  desc3: city.desc3,
                  name: city.name,
                  timezone: city.timezone,
                },
                forecast: WeatherConvert.toWeatherForecastDays(res.results),
                forecastCount: res.count as number,
              };
              return newCity;
            }
          })
        );
        return callWithLoader$(
          getCityForecast$.pipe(
            switchMap(res => res
              ? concat(
                  of(onAddCities(res)),
                  of(setCurrentCity(res)),
                )
              : EMPTY
            )
          )
        );
      }
    })
  );

const getSavedCitiesEpic: MyEpic = (action$, state$) =>
  action$.pipe(
    ofType(CitiesActionTypes.GetSavedCities),
    map(() => {
      const currentLanguage = state$.value.core.language as LanguageType;
      const citiesStorage = getFromStorage(StorageKeysCities.SavedCities);
      if (citiesStorage) {        
        let parsedStorage = JSON.parse(citiesStorage);
        let savedCities = parseSavedCities(parsedStorage);
          
        savedCities = savedCities.map<ICity>(item => {
          if (item.forecast) {
            const forecastExpired = Date.now() > new Date(item.forecast[1].date).getTime();
            return forecastExpired
              ? { ...item, forecast: undefined, forecastCount: undefined }
              : item;
          } else return item;
          
        });
        const unTranslatedCities = savedCities.some(item => !Boolean(item[currentLanguage]))
        if(unTranslatedCities){
          return of(getLocalizedCities(savedCities))
        }
        return of(onSaveCities(savedCities))
      } else {
        return of(onSaveCities([]));
      }
    }),
    switchMap((action) => concat(
      action,
      of(setCurrentCity()),
      of(onHideLoader())
    ))
  );

const setCurrentCityEpic: MyEpic = (action$, state$) =>
  action$.pipe(
    ofType(CitiesActionTypes.SetCurrentCity),
    filter(() => state$.value.cities.citiesCache.length > 0),
    switchMap(({payload}) => {
      const c = state$.value.cities.citiesCache[0];
      
      const cityToSetAsCurrent:ICity = payload ?? c;
      const currentLang = state$.value.core.language;
      
      const cityHasDesc = Object.keys(cityToSetAsCurrent).some(key => key === currentLang) && cityToSetAsCurrent[currentLang] &&  !Object.values(cityToSetAsCurrent[currentLang]!).some(item => item === undefined);
      
      if(cityHasDesc){
        const cityHasForecast = Boolean(cityToSetAsCurrent.forecast) && cityToSetAsCurrent.forecast!.length>0;
        // console.log({ cityHasForecast, cityToSetAsCurrent });
        
        if(cityHasForecast){
          return of(onSetCurrentCity(cityToSetAsCurrent));
        } else {
          return callWithLoader$(
            from(getCityForecastService( cityToSetAsCurrent.latitude,cityToSetAsCurrent.longitude))
              .pipe(
                switchMap(({results,count}) => {
                  return of(onSetCurrentCity({
                    ...cityToSetAsCurrent,
                   forecast: results,
                   forecastCount: count
                  }))
                })
              )
          )
        }

      } else {
        const cityName:string = cityToSetAsCurrent.en?.name ?? cityToSetAsCurrent.es!.name;
        return callWithLoader$(
          from(getCityByNameService(cityName, currentLang))
            .pipe(
              switchMap((res) => {
                const cityFromRes = res.results.find(city => city.id === cityToSetAsCurrent.id);
                if(cityFromRes){
                  const cityForSave:ICity = {
                    ...cityToSetAsCurrent,
                    [currentLang]:{
                      country: cityFromRes.country,
                      countryCode: cityFromRes.country_code,
                      desc1: cityFromRes.desc1,
                      desc2: cityFromRes.desc2,
                      desc3: cityFromRes.desc3,
                      name: cityFromRes.name,
                      timezone: cityFromRes.timezone
                    }
                  };
                  return concat(
                    of(onUpdateCity(cityForSave)),
                    of(onSetCurrentCity(cityForSave)),
                  );
                }
                return EMPTY;
              })
            )
        )
      }
    })
  )

const getLocalizedCitiesEpic: MyEpic = (action$, state$) =>
  action$.pipe(
    ofType(CitiesActionTypes.GetLocalizedCities),
    map(action =>
      action.payload
        ? (action.payload as ICity[])
        : state$.value.cities.citiesCache.filter(item => item.isSaved)
    ),
    switchMap((cities, number) => {
      const lang = state$.value.core.language;
      const localizedCities: ICity[] = [];

      const getCityName$ = (cityName:string) => from(
        getCityByNameService(cityName, lang)
      );

      const observables = cities.map(city => {
        if (city[lang]) {
          localizedCities.push(city);
          return of(null);
        } else {
          return getCityName$(city.en?.name ?? city.es!.name)
            .pipe(
              map(res => {
                const cityFromRes = res.results.find(
                  resCity => resCity.id === city.id
                );
                if (cityFromRes) {
                  const cityForSave: ICity = {
                    ...city,
                    [lang]: {
                      country: cityFromRes.country,
                      countryCode: cityFromRes.country_code,
                      desc1: cityFromRes.desc1,
                      desc2: cityFromRes.desc2,
                      desc3: cityFromRes.desc3,
                      name: cityFromRes.name,
                      timezone: cityFromRes.timezone,
                    },
                  };
                  localizedCities.push(cityForSave);
                }
              })
            )
        }
      });
      return forkJoin(observables).pipe(
        switchMap(() => of(onSaveCities(localizedCities))
        )
      )
    })
  );


const actualizeSavedCities: MyEpic = (action$, state$) => 
    action$.pipe(
      ofType('cities/onSetCurrentCity'),
      switchMap(({payload}) => {
        const newSavedCities = state$.value.cities.citiesCache.map(city => {
          if(city.id === payload.id){
            return {
              ...city,
              forecast: payload.forecast
            }
          } else {
            return city;
          }
        });
        return of(onSaveCities(newSavedCities));
        
      })
    )

const saveCitiesToStorageEpic: MyEpic = (action$, state$) => 
  action$.pipe(
    ofType(
      'cities/onSaveCities',
      'cities/onAddCities',
    ),
    switchMap(() => {
      const cities = state$.value.cities.citiesCache;
      saveToStorage(cities, StorageKeysCities.SavedCities);
      return EMPTY;
    })
  )


const citiesEpics = combineEpics(
  actualizeSavedCities,
  chooseCityEpic,
  getLocalizedCitiesEpic,
  getSavedCitiesEpic,
  saveCitiesToStorageEpic,
  setCurrentCityEpic,
);

export default citiesEpics;
