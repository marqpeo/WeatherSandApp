import { IAction, IPayloadAction } from ".";
import { LanguageType } from "../../locales";

export const enum CoreActionTypes {
  ChangeCurrentLanguage = 'core/CHANGE_CURRENT_LANGUAGE'
};

export type ActionTypes =
IPayloadAction<CoreActionTypes.ChangeCurrentLanguage, LanguageType>
  ;

export const changeCurrentLanguage = (payload: LanguageType):ActionTypes => ({
  type: CoreActionTypes.ChangeCurrentLanguage,
  payload
});
