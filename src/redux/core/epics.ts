import { Epic, combineEpics, ofType } from 'redux-observable';
import { of, switchMap } from 'rxjs';
import { IAppState, ICoreState } from '../../models/AppState';
import { AnyAction } from '@reduxjs/toolkit';
import { CitiesActionTypes } from '../../models/redux/actions/cities';
import { getFromStorage } from '../../helpers/localstorage.helpers';
import { StorageKeysCore, setCurrentLanguage } from '../core';
import i18n from '../../locales';
import { CoreActionTypes } from '../../models/redux/actions/core';
import { LanguageType } from '../../models/locales';

export type MyEpic = Epic<AnyAction, AnyAction, IAppState>;

const initEpic: MyEpic = (action$, state$) =>
  action$.pipe(
    ofType(CitiesActionTypes.GetSavedCities),
    switchMap(() => {
      const storage = getFromStorage(StorageKeysCore.Core);      
      if(storage){
        const parsedStorage = JSON.parse(storage) as ICoreState;
        if(parsedStorage.language){
          return of(setCurrentLanguage(parsedStorage.language))
        }
      }
      return of(setCurrentLanguage(i18n.language as LanguageType));
    })
  );

const changeLanguageEpic: MyEpic = (action$) => 
    action$.pipe(
      ofType(CoreActionTypes.ChangeCurrentLanguage),
      switchMap((action) => 
        of(setCurrentLanguage(action.payload))
      )
    )

const coreEpics = combineEpics(
  initEpic,
  changeLanguageEpic
);

export default coreEpics;
  