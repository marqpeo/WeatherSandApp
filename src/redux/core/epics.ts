import { Epic, combineEpics, ofType } from 'redux-observable';
import { concat, map, of, switchMap } from 'rxjs';
import { IAppState, ICoreState } from '../../models/AppState';
import { AnyAction } from '@reduxjs/toolkit';
import { getFromStorage } from '../../helpers/localstorage.helpers';
import { StorageKeysCore, onSetCurrentLanguage } from '../core';
import i18n from '../../locales';
import { CoreActionTypes } from '../../models/redux/actions/core';
import { LanguageType } from '../../models/locales';
import { getLocalizedCities, getSavedCities, setCurrentCity } from '../../models/redux/actions/cities';

export type MyEpic = Epic<AnyAction, AnyAction, IAppState>;

const initEpic: MyEpic = (action$) =>
  action$.pipe(
    ofType(CoreActionTypes.InitAction),
    map(() => {
      let language = i18n.language as LanguageType;
      const storage = getFromStorage(StorageKeysCore.Core);   
      // console.log({language, storage});
       
      if(storage){
        const parsedStorage = JSON.parse(storage) as ICoreState;
        if(parsedStorage.language){
          i18n.changeLanguage(parsedStorage.language);
          language = parsedStorage.language
        }
      }      
      return onSetCurrentLanguage(language);
    }),
    switchMap((setLangActionType) => {
      
      const initActionsArray = [
        of(getSavedCities())
      ];
      return concat(
        of(setLangActionType),
        ...initActionsArray
      );
    })
  );

const changeLanguageEpic: MyEpic = (action$) => 
    action$.pipe(
      ofType(CoreActionTypes.ChangeCurrentLanguage),
      switchMap((action) => 
        concat(
          of(onSetCurrentLanguage(action.payload)),
          of(getLocalizedCities()),
          of(setCurrentCity()),
          )
      )
    )

const coreEpics = combineEpics(
  initEpic,
  changeLanguageEpic
);

export default coreEpics;
  