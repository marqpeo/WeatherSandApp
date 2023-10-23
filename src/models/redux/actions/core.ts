import { IAction, IPayloadAction } from ".";
import { LanguageType } from "../../locales";

export const enum CoreActionTypes {
  InitAction = 'core/INIT_ACTION',
  ChangeCurrentLanguage = 'core/CHANGE_CURRENT_LANGUAGE'
};

export type ActionTypes =
  IAction<CoreActionTypes.InitAction> |
  IPayloadAction<CoreActionTypes.ChangeCurrentLanguage, LanguageType>
  ;

export const initAction = ():ActionTypes => ({
  type: CoreActionTypes.InitAction
});

export const changeCurrentLanguage = (payload: LanguageType):ActionTypes => ({
  type: CoreActionTypes.ChangeCurrentLanguage,
  payload
});
