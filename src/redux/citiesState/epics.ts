import { Epic, combineEpics, ofType } from 'redux-observable';
import { concat, from, map, of, pipe, switchMap } from 'rxjs';
import { IAppState } from '../../models/AppState';
import { selectCurrentCity, saveAndChooseNewCity, updateCity, saveCities, StorageKeysCities } from '../citiesState';
import { callWithLoader$ } from '../helpers.redux';
import { ICity } from '../../models/City';
import { WeatherConvert } from '../../models/WeatherForecastDay';
import { getCityForecast } from '../../services/forecastServices';
import { ForecastActionTypes } from '../../models/redux/actions/forecast';
import { AnyAction } from '@reduxjs/toolkit';
import { CitiesActionTypes } from '../../models/redux/actions/cities';
import { getFromStorage } from '../../helpers/localstorage.helpers';
import { hideLoader } from '../core';

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
          return of(selectCurrentCity(cachedCity.id));
        } else {
          const getCityForecast$ = from(
            getCityForecast(cachedCity.latitude, cachedCity.longitude)
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
              switchMap(res => {
                if (res) {
                  return of(updateCity(res));
                } else {
                  return of();
                }
              })
            )
          );
        }
      } else {
        const getCityForecast$ = from(
          getCityForecast(city.latitude, city.longitude)
        ).pipe(
          map(res => {
            if (res.status === 'ok') {
              const newCity: ICity = {
                ...city,
                forecast: WeatherConvert.toWeatherForecastDays(res.results),
                forecastCount: res.count as number,
              };
              return newCity;
            }
          })
        );
        return callWithLoader$(
          getCityForecast$.pipe(
            switchMap(res => {
              if (res) {
                return of(saveAndChooseNewCity(res));
              } else {
                return of();
              }
            })
          )
        );
      }
    })
  );

const getSavedCitiesEpic: MyEpic = (action$, state$) =>
    action$.pipe(
      ofType(CitiesActionTypes.GetSavedCities),
      switchMap(() => {
        const storage = getFromStorage(StorageKeysCities.SavedCities);
        if (storage) {
          
          const parsedState = JSON.parse(storage) as ICity[];
          
          const citiesArr = parsedState.map(item => {
            if (item.forecast) {            
              return Date.now() > new Date(item.forecast[1].date).getTime()
              ? { ...item, forecast: undefined, forecastCount: undefined }
              : item;
            } else return item;
          });
          if(!citiesArr[0].forecast){
            const renewedCity = citiesArr.shift()!;
            
            return callWithLoader$(
              from(getCityForecast(renewedCity.latitude, renewedCity.longitude)).pipe(
                switchMap((res) => 
                    of(saveCities([
                      {...renewedCity,
                      forecast: WeatherConvert.toWeatherForecastDays(res.results),
                      forecastCount: res.count as number,},
                      ...citiesArr
                    ]))
                )
                )
            )
            
          } else return concat(
            of(saveCities(citiesArr)),
            of(hideLoader())
          )

        } else {
          return concat(
            of(saveCities([])),
            of(hideLoader())
          )
        }
      })
    )

const citiesEpics = combineEpics(
  chooseCityEpic,
  getSavedCitiesEpic
);

export default citiesEpics;
